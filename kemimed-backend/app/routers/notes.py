from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Any
from app.database import get_db
from app.models.note import Note
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success
from app.services.ai_service import chat_complete
import uuid

router = APIRouter()


class NoteCreate(BaseModel):
    title: str = "Untitled Note"
    content_json: dict | None = None
    content_text: str | None = None
    topic_id: str | None = None
    tags: list[str] = []


class NoteUpdate(BaseModel):
    title: str | None = None
    content_json: dict | None = None
    content_text: str | None = None
    tags: list[str] | None = None
    is_pinned: bool | None = None


def note_dict(n: Note) -> dict:
    return {
        "id": str(n.id), "title": n.title, "content_json": n.content_json,
        "content_text": n.content_text, "tags": n.tags, "is_pinned": n.is_pinned,
        "word_count": n.word_count, "topic_id": str(n.topic_id) if n.topic_id else None,
        "created_at": str(n.created_at), "updated_at": str(n.updated_at),
    }


@router.get("")
async def list_notes(
    topic_id: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Note).where(Note.user_id == current_user.id)
    if topic_id:
        query = query.where(Note.topic_id == uuid.UUID(topic_id))
    query = query.order_by(Note.is_pinned.desc(), Note.updated_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    notes = result.scalars().all()
    return success([note_dict(n) for n in notes])


@router.post("")
async def create_note(
    body: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    word_count = len((body.content_text or "").split())
    note = Note(
        user_id=current_user.id,
        topic_id=uuid.UUID(body.topic_id) if body.topic_id else None,
        title=body.title,
        content_json=body.content_json,
        content_text=body.content_text,
        tags=body.tags,
        word_count=word_count,
    )
    db.add(note)
    await db.flush()
    await db.refresh(note)
    return success(note_dict(note), "Note created")


@router.get("/{note_id}")
async def get_note(note_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.id == uuid.UUID(note_id), Note.user_id == current_user.id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return success(note_dict(note))


@router.put("/{note_id}")
async def update_note(
    note_id: str,
    body: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Note).where(Note.id == uuid.UUID(note_id), Note.user_id == current_user.id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(note, field, value)
    if body.content_text is not None:
        note.word_count = len(body.content_text.split())
    await db.flush()
    return success(message="Note updated")


@router.delete("/{note_id}")
async def delete_note(note_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.id == uuid.UUID(note_id), Note.user_id == current_user.id))
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    await db.delete(note)
    return success(message="Note deleted")


@router.post("/{note_id}/ai-expand")
async def ai_expand(note_id: str, body: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    text = body.get("selected_text", "")
    if not text:
        raise HTTPException(status_code=400, detail="selected_text required")
    expanded = await chat_complete(
        [{"role": "user", "content": f"Expand this clinical text with more detail, mechanisms, and examples:\n\n{text}"}],
        "You are a medical education expert. Expand the text clearly and clinically.",
    )
    return success({"expanded": expanded})


@router.post("/{note_id}/ai-simplify")
async def ai_simplify(note_id: str, body: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    text = body.get("selected_text", "")
    if not text:
        raise HTTPException(status_code=400, detail="selected_text required")
    simplified = await chat_complete(
        [{"role": "user", "content": f"Simplify this medical text so a 2nd year health sciences student can understand it:\n\n{text}"}],
        "You are a medical education expert. Simplify clearly without losing clinical accuracy.",
    )
    return success({"simplified": simplified})
