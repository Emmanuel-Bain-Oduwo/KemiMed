import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limit import limiter, limit_ai
from app.services.openai_service import generate_image
from app.services.gemini_service import analyze_image
from app.services.storage_service import upload_file
from app.config import settings
from app.utils.response import success

router = APIRouter()


class ImageGenRequest(BaseModel):
    prompt: str
    image_type: str = "anatomy"


@router.post("/generate")
@limiter.limit(limit_ai)
async def generate_clinical_image(request: Request, body: ImageGenRequest, current_user: User = Depends(get_current_user)):
    image_bytes = await generate_image(body.prompt, body.image_type)
    file_key = f"users/{current_user.id}/generated/{uuid.uuid4()}.png"
    image_url = await upload_file(image_bytes, file_key, "image/png")
    return success({"image_url": image_url, "prompt": body.prompt, "image_type": body.image_type})


@router.post("/analyze")
@limiter.limit(limit_ai)
async def analyze_clinical_image(
    request: Request,
    file: UploadFile = File(...),
    question: str = "",
    current_user: User = Depends(get_current_user),
):
    content = await file.read()
    if len(content) > settings.max_file_size_bytes:
        raise HTTPException(status_code=400, detail=f"Image too large. Max {settings.MAX_FILE_SIZE_MB}MB.")

    mime = file.content_type or "image/jpeg"
    if mime not in settings.allowed_image_types_list:
        raise HTTPException(status_code=400, detail=f"Invalid image type: {mime}")

    prompt = question if question else (
        "Analyze this medical/clinical image. Identify: chart type, key findings, "
        "data trends, clinical implications, and statistical significance if shown."
    )
    analysis = await analyze_image(content, mime, prompt)
    return success({
        "analysis": analysis,
        "question": question or "General clinical analysis",
    })
