import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.document import Document
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.services.document_service import parse_pdf, parse_pptx, parse_docx
from app.services.storage_service import upload_file, delete_file
from app.services.ai_service import chat_complete
from app.utils.response import success
from app.config import settings
from loguru import logger

router = APIRouter()

PARSE_MAP = {
    "application/pdf": parse_pdf,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": parse_pptx,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": parse_docx,
}

ALLOWED_DOC_TYPES = list(PARSE_MAP.keys())


@router.post("/parse")
async def parse_document(
    file: UploadFile = File(...),
    topic_id: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    if len(content) > settings.max_file_size_bytes:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB.")

    mime = file.content_type or ""
    if mime not in ALLOWED_DOC_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {mime}")

    parse_fn = PARSE_MAP[mime]
    parsed_text, page_count = parse_fn(content)

    file_key = f"users/{current_user.id}/documents/{uuid.uuid4()}_{file.filename}"
    try:
        file_url = await upload_file(content, file_key, mime)
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        file_url = ""

    doc = Document(
        user_id=current_user.id,
        topic_id=uuid.UUID(topic_id) if topic_id else None,
        file_name=file.filename,
        file_url=file_url,
        file_type=mime,
        parsed_text=parsed_text,
        page_count=page_count,
    )
    db.add(doc)
    await db.flush()
    await db.refresh(doc)

    return success({
        "doc_id": str(doc.id),
        "file_name": doc.file_name,
        "file_url": doc.file_url,
        "page_count": page_count,
        "parsed_text_preview": (parsed_text or "")[:500],
    })


@router.post("/{doc_id}/summarize")
async def summarize_document(doc_id: str, body: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == uuid.UUID(doc_id), Document.user_id == current_user.id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if not doc.parsed_text:
        raise HTTPException(status_code=400, detail="No parsed text available")

    fmt = body.get("format", "bullets")
    prompt_map = {
        "bullets": "Summarize as clinical bullet points.",
        "table": "Summarize as a structured table.",
        "guide": "Summarize as a clinical quick-reference guide.",
        "mcq": "Generate 5 MCQs from this document.",
        "soap": "Summarize in SOAP note format.",
    }
    system = f"You are a medical education expert. {prompt_map.get(fmt, 'Summarize clearly.')}"
    summary = await chat_complete(
        [{"role": "user", "content": f"Summarize this document:\n\n{doc.parsed_text[:12000]}"}],
        system,
    )
    doc.summary = summary
    doc.summary_format = fmt
    await db.flush()
    return success({"summary": summary, "format": fmt})


@router.get("")
async def list_documents(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.user_id == current_user.id).order_by(Document.created_at.desc()))
    docs = result.scalars().all()
    return success([{"id": str(d.id), "file_name": d.file_name, "file_type": d.file_type, "page_count": d.page_count, "created_at": str(d.created_at)} for d in docs])


@router.delete("/{doc_id}")
async def delete_document(doc_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == uuid.UUID(doc_id), Document.user_id == current_user.id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    await db.delete(doc)
    return success(message="Document deleted")
