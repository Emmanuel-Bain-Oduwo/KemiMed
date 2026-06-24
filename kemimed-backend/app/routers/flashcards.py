import uuid
import secrets
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from app.models.flashcard import FlashcardDeck, Flashcard, FlashcardProgress
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.services.sm2_service import calculate_sm2
from app.utils.response import success

router = APIRouter()


class DeckCreate(BaseModel):
    title: str
    description: str | None = None
    topic_id: str | None = None


class CardCreate(BaseModel):
    deck_id: str
    front: str
    back: str
    hint: str | None = None
    pearl: str | None = None
    mnemonic: str | None = None
    tags: list[str] = []
    difficulty: str = "medium"


class ReviewSubmit(BaseModel):
    card_id: str
    grade: int


@router.get("/decks")
async def list_decks(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FlashcardDeck).where(FlashcardDeck.user_id == current_user.id).order_by(FlashcardDeck.created_at.desc()))
    decks = result.scalars().all()
    return success([{
        "id": str(d.id), "title": d.title, "description": d.description,
        "card_count": d.card_count, "mastery_percent": d.mastery_percent,
        "is_shared": d.is_shared, "share_code": d.share_code,
        "last_studied": str(d.last_studied) if d.last_studied else None,
        "topic_id": str(d.topic_id) if d.topic_id else None,
    } for d in decks])


@router.post("/decks")
async def create_deck(body: DeckCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deck = FlashcardDeck(
        user_id=current_user.id,
        topic_id=uuid.UUID(body.topic_id) if body.topic_id else None,
        title=body.title,
        description=body.description,
    )
    db.add(deck)
    await db.flush()
    await db.refresh(deck)
    return success({"id": str(deck.id), "title": deck.title}, "Deck created")


@router.get("/decks/{deck_id}")
async def get_deck(deck_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FlashcardDeck).where(FlashcardDeck.id == uuid.UUID(deck_id), FlashcardDeck.user_id == current_user.id))
    deck = result.scalar_one_or_none()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    cards_result = await db.execute(select(Flashcard).where(Flashcard.deck_id == deck.id).order_by(Flashcard.position))
    cards = cards_result.scalars().all()
    return success({
        "id": str(deck.id), "title": deck.title, "description": deck.description,
        "card_count": deck.card_count, "mastery_percent": deck.mastery_percent,
        "cards": [{"id": str(c.id), "front": c.front, "back": c.back, "hint": c.hint, "pearl": c.pearl, "mnemonic": c.mnemonic, "difficulty": c.difficulty} for c in cards],
    })


@router.delete("/decks/{deck_id}")
async def delete_deck(deck_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FlashcardDeck).where(FlashcardDeck.id == uuid.UUID(deck_id), FlashcardDeck.user_id == current_user.id))
    deck = result.scalar_one_or_none()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    await db.delete(deck)
    return success(message="Deck deleted")


@router.post("/decks/{deck_id}/share")
async def share_deck(deck_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FlashcardDeck).where(FlashcardDeck.id == uuid.UUID(deck_id), FlashcardDeck.user_id == current_user.id))
    deck = result.scalar_one_or_none()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    if not deck.share_code:
        deck.share_code = secrets.token_urlsafe(8)
        deck.is_shared = True
        await db.flush()
    return success({"share_code": deck.share_code})


@router.get("/decks/shared/{code}")
async def get_shared_deck(code: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FlashcardDeck).where(FlashcardDeck.share_code == code, FlashcardDeck.is_shared == True))
    deck = result.scalar_one_or_none()
    if not deck:
        raise HTTPException(status_code=404, detail="Shared deck not found")
    cards_result = await db.execute(select(Flashcard).where(Flashcard.deck_id == deck.id))
    cards = cards_result.scalars().all()
    return success({
        "id": str(deck.id), "title": deck.title,
        "cards": [{"front": c.front, "back": c.back, "hint": c.hint} for c in cards],
    })


@router.get("/due")
async def due_cards(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    result = await db.execute(
        select(FlashcardProgress, Flashcard)
        .join(Flashcard, FlashcardProgress.card_id == Flashcard.id)
        .where(FlashcardProgress.user_id == current_user.id, FlashcardProgress.next_review <= now)
        .limit(50)
    )
    rows = result.all()
    return success([{
        "card_id": str(p.card_id), "front": c.front, "back": c.back,
        "hint": c.hint, "pearl": c.pearl, "mnemonic": c.mnemonic,
        "ease_factor": p.ease_factor, "interval_days": p.interval_days,
    } for p, c in rows])


@router.post("/review")
async def submit_review(body: ReviewSubmit, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(FlashcardProgress).where(
            FlashcardProgress.user_id == current_user.id,
            FlashcardProgress.card_id == uuid.UUID(body.card_id),
        )
    )
    progress = result.scalar_one_or_none()
    if not progress:
        progress = FlashcardProgress(user_id=current_user.id, card_id=uuid.UUID(body.card_id))
        db.add(progress)

    sm2 = calculate_sm2(progress.ease_factor, progress.interval_days, progress.repetitions, body.grade)
    progress.ease_factor = sm2["ease_factor"]
    progress.interval_days = sm2["interval_days"]
    progress.repetitions = sm2["repetitions"]
    progress.next_review = sm2["next_review"]
    progress.last_review = datetime.utcnow()
    progress.last_grade = body.grade
    await db.flush()
    return success(sm2)


@router.post("/cards")
async def create_card(body: CardCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deck_result = await db.execute(select(FlashcardDeck).where(FlashcardDeck.id == uuid.UUID(body.deck_id), FlashcardDeck.user_id == current_user.id))
    deck = deck_result.scalar_one_or_none()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    card = Flashcard(
        deck_id=deck.id, user_id=current_user.id,
        front=body.front, back=body.back, hint=body.hint,
        pearl=body.pearl, mnemonic=body.mnemonic,
        tags=body.tags, difficulty=body.difficulty,
    )
    db.add(card)
    deck.card_count += 1
    await db.flush()
    await db.refresh(card)
    return success({"id": str(card.id)}, "Card created")


@router.delete("/cards/{card_id}")
async def delete_card(card_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Flashcard).where(Flashcard.id == uuid.UUID(card_id), Flashcard.user_id == current_user.id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    deck_result = await db.execute(select(FlashcardDeck).where(FlashcardDeck.id == card.deck_id))
    deck = deck_result.scalar_one_or_none()
    if deck:
        deck.card_count = max(0, deck.card_count - 1)
    await db.delete(card)
    return success(message="Card deleted")
