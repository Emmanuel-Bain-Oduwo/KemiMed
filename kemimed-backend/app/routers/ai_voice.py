import uuid
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi.responses import StreamingResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models.media import VoiceSession
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limit import limiter, limit_ai
from app.services.gemini_service import transcribe_audio, text_to_speech
from app.services.ai_service import chat_complete, build_tutor_prompt
from app.services.storage_service import upload_file
from app.config import settings
from app.utils.response import success

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    voice: str = "DrCore"
    language: str = "en"


class VoiceSessionStart(BaseModel):
    topic_id: str | None = None
    mode: str = "teach"
    language: str = "en"


@router.post("/transcribe")
@limiter.limit(limit_ai)
async def transcribe(request: Request, file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    content = await file.read()
    if len(content) > settings.max_file_size_bytes:
        raise HTTPException(status_code=400, detail=f"Audio too large. Max {settings.MAX_FILE_SIZE_MB}MB.")

    mime = file.content_type or "audio/mpeg"
    if mime not in settings.allowed_audio_types_list:
        raise HTTPException(status_code=400, detail=f"Invalid audio type: {mime}")

    transcript = await transcribe_audio(content, mime)
    return success({"transcript": transcript, "language_detected": "en"})


@router.post("/speak")
@limiter.limit(limit_ai)
async def speak(request: Request, body: TTSRequest, current_user: User = Depends(get_current_user)):
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="text is required")
    audio_bytes = await text_to_speech(body.text, body.voice)
    return Response(content=audio_bytes, media_type="audio/wav")


@router.post("/session/start")
async def start_voice_session(body: VoiceSessionStart, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session = VoiceSession(
        user_id=current_user.id,
        topic_id=uuid.UUID(body.topic_id) if body.topic_id else None,
    )
    db.add(session)
    await db.flush()
    await db.refresh(session)
    return success({"session_id": str(session.id)})


@router.post("/session/{session_id}/message")
@limiter.limit(limit_ai)
async def voice_message(
    request: Request,
    session_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(VoiceSession).where(VoiceSession.id == uuid.UUID(session_id), VoiceSession.user_id == current_user.id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Voice session not found")

    audio_content = await file.read()
    mime = file.content_type or "audio/mpeg"
    transcript = await transcribe_audio(audio_content, mime)

    messages = session.transcript or []
    messages.append({"role": "user", "content": transcript})
    ai_response = await chat_complete(messages, build_tutor_prompt("general", "teach"))
    messages.append({"role": "assistant", "content": ai_response})
    session.transcript = messages

    audio_response = await text_to_speech(ai_response, "DrCore")
    audio_key = f"users/{current_user.id}/voice/{uuid.uuid4()}.wav"
    audio_url = await upload_file(audio_response, audio_key, "audio/wav")

    await db.flush()
    return success({"transcript": transcript, "ai_response_text": ai_response, "audio_url": audio_url})
