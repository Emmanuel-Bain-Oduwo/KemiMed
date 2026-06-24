import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models.mindmap import Mindmap
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success

router = APIRouter()


class MindmapCreate(BaseModel):
    title: str
    data_json: dict
    topic_id: str | None = None


@router.get("")
async def list_mindmaps(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mindmap).where(Mindmap.user_id == current_user.id).order_by(Mindmap.created_at.desc()))
    mindmaps = result.scalars().all()
    return success([{"id": str(m.id), "title": m.title, "image_url": m.image_url, "created_at": str(m.created_at)} for m in mindmaps])


@router.post("")
async def create_mindmap(body: MindmapCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    mindmap = Mindmap(
        user_id=current_user.id,
        topic_id=uuid.UUID(body.topic_id) if body.topic_id else None,
        title=body.title,
        data_json=body.data_json,
    )
    db.add(mindmap)
    await db.flush()
    await db.refresh(mindmap)
    return success({"id": str(mindmap.id), "title": mindmap.title, "data_json": mindmap.data_json})


@router.get("/{mindmap_id}")
async def get_mindmap(mindmap_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mindmap).where(Mindmap.id == uuid.UUID(mindmap_id), Mindmap.user_id == current_user.id))
    mindmap = result.scalar_one_or_none()
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mindmap not found")
    return success({"id": str(mindmap.id), "title": mindmap.title, "data_json": mindmap.data_json, "image_url": mindmap.image_url})


@router.delete("/{mindmap_id}")
async def delete_mindmap(mindmap_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mindmap).where(Mindmap.id == uuid.UUID(mindmap_id), Mindmap.user_id == current_user.id))
    mindmap = result.scalar_one_or_none()
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mindmap not found")
    await db.delete(mindmap)
    return success(message="Mindmap deleted")
