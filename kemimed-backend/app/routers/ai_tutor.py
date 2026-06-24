import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models.session import AISession
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limit import limiter, limit_ai
from app.services.ai_service import chat_stream, build_tutor_prompt
from app.utils.response import success

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str
    mode: str = "teach"
    discipline: str = "pharmacy"
    topic_id: str | None = None


@router.post("/chat")
@limiter.limit(limit_ai)
async def chat(request: Request, body: ChatRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session = None
    messages = []

    if body.session_id:
        result = await db.execute(select(AISession).where(AISession.id == uuid.UUID(body.session_id), AISession.user_id == current_user.id))
        session = result.scalar_one_or_none()
        if session:
            messages = session.messages or []

    messages.append({"role": "user", "content": body.message})
    system_prompt = build_tutor_prompt(body.discipline, body.mode)

    async def stream_generator():
        full_response = ""
        async for token in chat_stream(messages, system_prompt):
            full_response += token
            yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

        messages.append({"role": "assistant", "content": full_response})

        if session:
            session.messages = messages
            session.updated_at = datetime.utcnow()
        else:
            new_session = AISession(
                user_id=current_user.id,
                topic_id=uuid.UUID(body.topic_id) if body.topic_id else None,
                title=body.message[:60],
                mode=body.mode,
                discipline_mode=body.discipline,
                messages=messages,
            )
            db.add(new_session)
        await db.commit()

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(stream_generator(), media_type="text/event-stream")


@router.get("/sessions")
async def list_sessions(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AISession).where(AISession.user_id == current_user.id).order_by(AISession.updated_at.desc()).limit(20))
    sessions = result.scalars().all()
    return success([{
        "id": str(s.id), "title": s.title, "mode": s.mode,
        "discipline_mode": s.discipline_mode,
        "message_count": len(s.messages or []),
        "updated_at": str(s.updated_at),
    } for s in sessions])


@router.get("/sessions/{session_id}")
async def get_session(session_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AISession).where(AISession.id == uuid.UUID(session_id), AISession.user_id == current_user.id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return success({"id": str(session.id), "title": session.title, "mode": session.mode, "messages": session.messages})


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AISession).where(AISession.id == uuid.UUID(session_id), AISession.user_id == current_user.id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    return success(message="Session deleted")
