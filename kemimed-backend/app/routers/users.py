from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User, DisciplineEnum
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success

router = APIRouter()


class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    discipline: DisciplineEnum | None = None
    study_year: int | None = None
    university: str | None = None
    country: str | None = None
    avatar_url: str | None = None


@router.get("/me")
async def get_profile(current_user: User = Depends(get_current_user)):
    return success({
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "avatar_url": current_user.avatar_url,
        "discipline": current_user.discipline,
        "study_year": current_user.study_year,
        "university": current_user.university,
        "country": current_user.country,
        "is_verified": current_user.is_verified,
        "xp_total": current_user.xp_total,
        "streak_days": current_user.streak_days,
        "image_count": current_user.image_count,
        "pdf_count": current_user.pdf_count,
    })


@router.put("/me")
async def update_profile(
    body: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    await db.flush()
    return success(message="Profile updated")


@router.delete("/me")
async def delete_account(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_user.is_active = False
    await db.flush()
    return success(message="Account deactivated")
