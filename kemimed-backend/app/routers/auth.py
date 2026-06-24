from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.user import User, DisciplineEnum
from app.utils.security import hash_password, verify_password, create_access_token, create_refresh_token, verify_token
from app.utils.response import success, error
from app.redis_client import set_refresh_token, get_refresh_token, delete_refresh_token
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limit import limiter, limit_auth
import uuid

router = APIRouter()


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
    discipline: DisciplineEnum = DisciplineEnum.pharmacy
    study_year: int | None = None
    university: str | None = None
    country: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


def user_to_dict(user: User) -> dict:
    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "discipline": user.discipline,
        "study_year": user.study_year,
        "university": user.university,
        "country": user.country,
        "is_verified": user.is_verified,
        "xp_total": user.xp_total,
        "streak_days": user.streak_days,
        "image_count": user.image_count,
        "pdf_count": user.pdf_count,
        "created_at": str(user.created_at),
    }


@router.post("/register")
@limiter.limit(limit_auth)
async def register(request: Request, body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        discipline=body.discipline,
        study_year=body.study_year,
        university=body.university,
        country=body.country,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    await set_refresh_token(str(user.id), refresh_token)

    return success({"access_token": access_token, "refresh_token": refresh_token, "user": user_to_dict(user)}, "Registered successfully")


@router.post("/login")
@limiter.limit(limit_auth)
async def login(request: Request, body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    await set_refresh_token(str(user.id), refresh_token)

    return success({"access_token": access_token, "refresh_token": refresh_token, "user": user_to_dict(user)}, "Login successful")


@router.post("/refresh")
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    user_id = verify_token(body.refresh_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    stored = await get_refresh_token(user_id)
    if not stored or stored != body.refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token expired or revoked")

    access_token = create_access_token(user_id)
    return success({"access_token": access_token}, "Token refreshed")


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    await delete_refresh_token(str(current_user.id))
    return success(message="Logged out successfully")


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return success(user_to_dict(current_user))
