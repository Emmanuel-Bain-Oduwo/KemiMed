from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.topic import Topic
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.utils.response import success
import json
from app.redis_client import get_cached, set_cached, TTL_TOPICS_ALL

router = APIRouter()


@router.get("")
async def list_topics(
    discipline: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    cached = await get_cached("topics:all")
    if cached and not discipline:
        return success(json.loads(cached))

    query = select(Topic)
    if discipline:
        query = query.where(Topic.disciplines.contains([discipline]))

    result = await db.execute(query.order_by(Topic.name))
    topics = result.scalars().all()
    data = [
        {
            "id": str(t.id), "slug": t.slug, "name": t.name,
            "description": t.description, "category": t.category,
            "disciplines": t.disciplines, "icon": t.icon, "color": t.color,
            "is_featured": t.is_featured,
        }
        for t in topics
    ]
    if not discipline:
        await set_cached("topics:all", json.dumps(data), TTL_TOPICS_ALL)
    return success(data)


@router.get("/{slug}")
async def get_topic(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Topic).where(Topic.slug == slug))
    topic = result.scalar_one_or_none()
    if not topic:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Topic not found")
    return success({
        "id": str(topic.id), "slug": topic.slug, "name": topic.name,
        "description": topic.description, "category": topic.category,
        "disciplines": topic.disciplines, "icon": topic.icon, "color": topic.color,
    })
