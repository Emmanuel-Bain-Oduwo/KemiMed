import uuid
import re
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models.article import Article
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success

router = APIRouter()


class ArticleCreate(BaseModel):
    title: str
    content_json: dict | None = None
    content_text: str | None = None
    excerpt: str | None = None
    cover_url: str | None = None
    category: str | None = None
    tags: list[str] = []


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def article_dict(a: Article) -> dict:
    return {
        "id": str(a.id), "title": a.title, "slug": a.slug, "excerpt": a.excerpt,
        "cover_url": a.cover_url, "category": a.category, "tags": a.tags,
        "status": a.status, "views": a.views, "read_min": a.read_min,
        "author_id": str(a.author_id), "published_at": str(a.published_at) if a.published_at else None,
        "created_at": str(a.created_at),
    }


@router.get("")
async def list_articles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.status == "published").order_by(Article.published_at.desc()).limit(50))
    articles = result.scalars().all()
    return success([article_dict(a) for a in articles])


@router.post("")
async def create_article(body: ArticleCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    base_slug = slugify(body.title)
    slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
    word_count = len((body.content_text or "").split())
    read_min = max(1, word_count // 200)

    article = Article(
        author_id=current_user.id,
        title=body.title, slug=slug,
        content_json=body.content_json, content_text=body.content_text,
        excerpt=body.excerpt, cover_url=body.cover_url,
        category=body.category, tags=body.tags, read_min=read_min,
    )
    db.add(article)
    await db.flush()
    await db.refresh(article)
    return success(article_dict(article), "Article created")


@router.get("/my")
async def my_articles(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.author_id == current_user.id).order_by(Article.created_at.desc()))
    articles = result.scalars().all()
    return success([article_dict(a) for a in articles])


@router.get("/{slug}")
async def get_article(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.slug == slug))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.views += 1
    await db.flush()
    data = article_dict(article)
    data["content_json"] = article.content_json
    data["content_text"] = article.content_text
    return success(data)


@router.put("/{article_id}")
async def update_article(article_id: str, body: ArticleCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == uuid.UUID(article_id), Article.author_id == current_user.id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(article, field, value)
    await db.flush()
    return success(message="Article updated")


@router.post("/{article_id}/publish")
async def publish_article(article_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == uuid.UUID(article_id), Article.author_id == current_user.id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    article.status = "published"
    article.published_at = datetime.utcnow()
    await db.flush()
    return success({"slug": article.slug}, "Article published")


@router.delete("/{article_id}")
async def delete_article(article_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == uuid.UUID(article_id), Article.author_id == current_user.id))
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.delete(article)
    return success(message="Article deleted")
