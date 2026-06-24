import uuid
import json
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database import get_db
from app.models.flashcard import FlashcardDeck, Flashcard
from app.models.quiz import QuizAttempt
from app.models.mindmap import Mindmap
from app.models.exam_plan import ExamPlan
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limit import limiter, limit_ai
from app.services.ai_service import chat_complete, chat_stream
from app.utils.response import success
from loguru import logger

router = APIRouter()


class FlashcardGenRequest(BaseModel):
    topic: str
    notes_text: str | None = None
    count: int = 10
    difficulty: str = "medium"
    include_pearls: bool = True
    include_mnemonics: bool = True


class QuizGenRequest(BaseModel):
    topic: str
    count: int = 10
    type: str = "mcq"
    level: str = "undergraduate"
    include_explanations: bool = True


class SummaryRequest(BaseModel):
    text: str
    format: str = "bullets"


class MindmapRequest(BaseModel):
    topic: str


class RevisionPlanRequest(BaseModel):
    exam_name: str
    exam_date: str
    topics: list[str]
    daily_hours: float = 3
    current_mastery: dict = {}


class ArticleRequest(BaseModel):
    topic: str
    format: str = "comprehensive"
    length_words: int = 800


class ClinicalCaseRequest(BaseModel):
    topic: str
    difficulty: str = "undergraduate"
    discipline: str = "medicine"


class BoardExamRequest(BaseModel):
    exam_type: str
    topic: str
    count: int = 5


@router.post("/flashcards")
@limiter.limit(limit_ai)
async def generate_flashcards(request: Request, body: FlashcardGenRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    source = f"\n\nAdditional notes:\n{body.notes_text}" if body.notes_text else ""
    prompt = f"""Generate {body.count} clinical flashcards for health sciences students on: {body.topic}{source}

Return ONLY a valid JSON array with no extra text:
[{{"front": "question", "back": "answer", "hint": "hint or null", "pearl": "clinical pearl or null", "mnemonic": "mnemonic or null", "difficulty": "{body.difficulty}", "tags": ["tag1"]}}]"""

    raw = await chat_complete([{"role": "user", "content": prompt}], "You are a medical educator. Return only valid JSON.", json_mode=True)

    try:
        cards_data = json.loads(raw)
        if not isinstance(cards_data, list):
            cards_data = cards_data.get("flashcards", cards_data.get("cards", []))
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    deck = FlashcardDeck(user_id=current_user.id, title=f"{body.topic} — AI Deck", card_count=len(cards_data))
    db.add(deck)
    await db.flush()

    cards = []
    for i, c in enumerate(cards_data):
        card = Flashcard(
            deck_id=deck.id, user_id=current_user.id,
            front=c.get("front", ""), back=c.get("back", ""),
            hint=c.get("hint"), pearl=c.get("pearl"), mnemonic=c.get("mnemonic"),
            tags=c.get("tags", []), difficulty=c.get("difficulty", body.difficulty),
            position=i,
        )
        db.add(card)
        cards.append(c)
    await db.flush()
    return success({"deck_id": str(deck.id), "cards": cards})


@router.post("/quiz")
@limiter.limit(limit_ai)
async def generate_quiz(request: Request, body: QuizGenRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    prompt = f"""Generate {body.count} {body.type} clinical questions on '{body.topic}' at {body.level} level.

Return ONLY a valid JSON array:
[{{"question": "...", "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}}, "correct": "A", "explanation": "...", "reference": "..."}}]"""

    raw = await chat_complete([{"role": "user", "content": prompt}], "You are a medical examiner. Return only valid JSON.", json_mode=True)

    try:
        questions = json.loads(raw)
        if not isinstance(questions, list):
            questions = questions.get("questions", [])
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_title=f"{body.topic} Quiz",
        quiz_type=body.type,
        difficulty=body.level,
        questions=questions,
        max_score=len(questions),
    )
    db.add(attempt)
    await db.flush()
    return success({"quiz_id": str(attempt.id), "questions": questions})


@router.post("/summary")
@limiter.limit(limit_ai)
async def generate_summary(request: Request, body: SummaryRequest, current_user: User = Depends(get_current_user)):
    fmt_map = {
        "bullets": "concise clinical bullet points",
        "table": "a structured comparison table",
        "mcq": "5 multiple-choice questions",
        "guide": "a quick-reference clinical guide",
        "soap": "SOAP note format",
        "mindmap_text": "a text-based mindmap outline",
    }
    instruction = fmt_map.get(body.format, "clear bullet points")
    summary = await chat_complete(
        [{"role": "user", "content": f"Summarize the following as {instruction}:\n\n{body.text[:15000]}"}],
        "You are a medical education expert. Summarize clinically and accurately.",
    )
    return success({"summary": summary, "format": body.format, "word_count": len(summary.split())})


@router.post("/mindmap")
@limiter.limit(limit_ai)
async def generate_mindmap(request: Request, body: MindmapRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    prompt = f"""Generate a clinical mindmap for: {body.topic}

Return ONLY valid JSON:
{{"center": "{body.topic}", "branches": [{{"label": "Branch", "color": "#hex", "icon": "emoji", "children": ["child1", "child2"]}}]}}"""

    raw = await chat_complete([{"role": "user", "content": prompt}], "You are a medical educator. Return only valid JSON.", json_mode=True)

    try:
        data = json.loads(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    mindmap = Mindmap(user_id=current_user.id, title=body.topic, data_json=data)
    db.add(mindmap)
    await db.flush()
    return success({"mindmap_id": str(mindmap.id), "data": data})


@router.post("/revision-plan")
@limiter.limit(limit_ai)
async def generate_revision_plan(request: Request, body: RevisionPlanRequest, current_user: User = Depends(get_current_user)):
    prompt = f"""Create a day-by-day study plan:
Exam: {body.exam_name}
Date: {body.exam_date}
Topics: {', '.join(body.topics)}
Daily study hours: {body.daily_hours}
Current mastery: {json.dumps(body.current_mastery)}

Return a JSON array of daily tasks:
[{{"date": "YYYY-MM-DD", "tasks": ["task1"], "focus_topic": "topic", "duration_min": 120}}]"""

    raw = await chat_complete([{"role": "user", "content": prompt}], "You are a medical exam coach. Return only valid JSON.", json_mode=True)
    try:
        plan = json.loads(raw)
        if not isinstance(plan, list):
            plan = plan.get("plan", plan.get("days", []))
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    return success({"plan": plan})


@router.post("/article")
@limiter.limit(limit_ai)
async def generate_article(request: Request, body: ArticleRequest, current_user: User = Depends(get_current_user)):
    async def stream_gen():
        async for token in chat_stream(
            [{"role": "user", "content": f"Write a {body.length_words}-word clinical article on: {body.topic}. Format: {body.format}"}],
            "You are a medical writer producing high-quality health sciences content.",
        ):
            yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(stream_gen(), media_type="text/event-stream")


@router.post("/clinical-case")
@limiter.limit(limit_ai)
async def generate_clinical_case(request: Request, body: ClinicalCaseRequest, current_user: User = Depends(get_current_user)):
    prompt = f"""Generate a realistic OSCE clinical case for {body.discipline} students on: {body.topic}
Difficulty: {body.difficulty}

Return JSON:
{{"case": {{"presentation": "...", "history": "...", "examination": "...", "investigations": "..."}}, "expected_answer_points": ["point1", "point2"]}}"""

    raw = await chat_complete([{"role": "user", "content": prompt}], "You are a clinical examiner. Return only valid JSON.", json_mode=True)
    try:
        case_data = json.loads(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    return success(case_data)


@router.post("/board-exam-questions")
@limiter.limit(limit_ai)
async def generate_board_exam_questions(request: Request, body: BoardExamRequest, current_user: User = Depends(get_current_user)):
    exam_styles = {
        "usmle": "USMLE Step 1/2 style — clinical vignette, one best answer",
        "plab": "PLAB style — UK clinical scenarios",
        "kenya_kmpdb": "Kenya Medical Practitioners and Dentists Board exam style",
        "nigeria_mdcn": "Nigeria Medical and Dental Council exam style",
        "next_india": "NExT India medical licensing exam style",
        "mccqe": "MCCQE Canada medical licensing exam style",
        "amc": "AMC Australia medical exam style",
        "hpcsa": "HPCSA South Africa exam style",
        "approbation": "German Approbation/Staatsexamen medical exam style",
    }
    style = exam_styles.get(body.exam_type, "standard medical board exam style")
    prompt = f"""Generate {body.count} {style} questions on: {body.topic}

Return ONLY a valid JSON array:
[{{"question": "...", "options": {{"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."}}, "correct": "A", "explanation": "...", "exam_tip": "..."}}]"""

    raw = await chat_complete([{"role": "user", "content": prompt}], f"You are an expert {body.exam_type.upper()} medical board examiner. Return only valid JSON.", json_mode=True)
    try:
        questions = json.loads(raw)
        if not isinstance(questions, list):
            questions = questions.get("questions", [])
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    return success({"exam_type": body.exam_type, "questions": questions})
