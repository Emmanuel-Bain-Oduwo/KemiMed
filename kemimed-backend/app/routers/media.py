import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.media import MediaFile
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.services.storage_service import upload_file, delete_file
from app.services.document_service import parse_pdf
from app.utils.response import success
from app.config import settings
from loguru import logger

router = APIRouter()


def detect_mime(content: bytes, filename: str) -> str:
    """Simple mime detection by file extension as fallback."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    ext_map = {
        "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
        "webp": "image/webp", "gif": "image/gif",
        "pdf": "application/pdf",
        "mp3": "audio/mpeg", "wav": "audio/wav", "ogg": "audio/ogg",
        "m4a": "audio/mp4", "webm": "audio/webm",
        "mp4": "video/mp4", "mov": "video/quicktime",
    }
    return ext_map.get(ext, "application/octet-stream")


async def _upload_media(
    file: UploadFile,
    file_type: str,
    allowed_types: list[str],
    count_field: str | None,
    max_count: int | None,
    current_user: User,
    db: AsyncSession,
    topic_id: str | None = None,
) -> dict:
    content = await file.read()
    size = len(content)
    if size > settings.max_file_size_bytes:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB.")

    mime = file.content_type or detect_mime(content, file.filename or "")
    if mime not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Invalid file type: {mime}. Allowed: {', '.join(allowed_types)}")

    if count_field and max_count:
        current_count = getattr(current_user, count_field, 0)
        if current_count >= max_count:
            raise HTTPException(status_code=400, detail=f"{file_type.capitalize()} upload limit reached (max {max_count})")

    ext = (file.filename or "file").rsplit(".", 1)[-1].lower()
    file_key = f"users/{current_user.id}/{file_type}s/{uuid.uuid4()}.{ext}"
    file_url = await upload_file(content, file_key, mime)

    parsed_text = None
    if file_type == "pdf":
        parsed_text, _ = parse_pdf(content)

    media = MediaFile(
        user_id=current_user.id,
        file_name=file.filename or file_key,
        file_url=file_url,
        file_key=file_key,
        file_type=file_type,
        mime_type=mime,
        file_size=size,
        topic_id=uuid.UUID(topic_id) if topic_id else None,
        parsed_text=parsed_text,
    )
    db.add(media)
    if count_field:
        setattr(current_user, count_field, getattr(current_user, count_field, 0) + 1)
    await db.flush()
    await db.refresh(media)

    return {
        "file_id": str(media.id),
        "file_url": media.file_url,
        "file_name": media.file_name,
        "file_type": media.file_type,
        "file_size": media.file_size,
        "parsed_text_preview": (parsed_text or "")[:500] if file_type == "pdf" else None,
    }


@router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    topic_id: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = await _upload_media(file, "image", settings.allowed_image_types_list, "image_count", settings.MAX_IMAGES_PER_USER, current_user, db, topic_id)
    return success(data, "Image uploaded")


@router.post("/upload/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    topic_id: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = await _upload_media(file, "pdf", settings.allowed_pdf_types_list, "pdf_count", settings.MAX_PDFS_PER_USER, current_user, db, topic_id)
    return success(data, "PDF uploaded and parsed")


@router.post("/upload/audio")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = await _upload_media(file, "audio", settings.allowed_audio_types_list, None, None, current_user, db)
    return success(data, "Audio uploaded")


@router.post("/upload/video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = await _upload_media(file, "video", settings.allowed_video_types_list, None, None, current_user, db)
    return success(data, "Video uploaded")


@router.get("/my-files")
async def my_files(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MediaFile).where(MediaFile.user_id == current_user.id).order_by(MediaFile.created_at.desc()))
    files = result.scalars().all()
    grouped: dict[str, list] = {"images": [], "pdfs": [], "audio": [], "videos": []}
    for f in files:
        key = {"image": "images", "pdf": "pdfs", "audio": "audio", "video": "videos"}.get(f.file_type, "images")
        grouped[key].append({
            "id": str(f.id), "file_name": f.file_name, "file_url": f.file_url,
            "file_size": f.file_size, "mime_type": f.mime_type, "created_at": str(f.created_at),
        })
    grouped["counts"] = {k: len(v) for k, v in grouped.items() if k != "counts"}
    return success(grouped)


@router.delete("/{file_id}")
async def delete_media(file_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MediaFile).where(MediaFile.id == uuid.UUID(file_id), MediaFile.user_id == current_user.id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        await delete_file(media.file_key)
    except Exception as e:
        logger.warning(f"R2 delete failed for {media.file_key}: {e}")

    if media.file_type == "image":
        current_user.image_count = max(0, current_user.image_count - 1)
    elif media.file_type == "pdf":
        current_user.pdf_count = max(0, current_user.pdf_count - 1)

    await db.delete(media)
    return success(message="File deleted")
