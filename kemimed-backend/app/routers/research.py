import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.services.pubmed_service import search_pubmed, fetch_abstract
from app.services.ai_service import chat_complete
from app.utils.response import success

router = APIRouter()

# In-memory saved articles (in production use a DB table)
_saved: dict[str, list] = {}


@router.get("/search")
async def search(
    query: str = Query(...),
    max_results: int = Query(20, le=50),
    date_from: str = Query(""),
    date_to: str = Query(""),
    current_user: User = Depends(get_current_user),
):
    articles = await search_pubmed(query, max_results, date_from, date_to)
    return success({"results": articles, "count": len(articles)})


@router.get("/article/{pmid}/summary")
async def summarize_article(pmid: str, current_user: User = Depends(get_current_user)):
    abstract = await fetch_abstract(pmid)
    if not abstract:
        return success({"summary": "Abstract not available.", "pmid": pmid})

    summary_raw = await chat_complete(
        [{"role": "user", "content": f"Summarize this medical article abstract clinically:\n\n{abstract[:6000]}"}],
        "You are a medical research expert. Summarize key findings, clinical implications, and limitations.",
    )
    return success({
        "pmid": pmid,
        "summary": summary_raw,
        "abstract": abstract[:2000],
    })


@router.post("/save/{pmid}")
async def save_article(pmid: str, current_user: User = Depends(get_current_user)):
    user_id = str(current_user.id)
    if user_id not in _saved:
        _saved[user_id] = []
    if pmid not in _saved[user_id]:
        _saved[user_id].append(pmid)
    return success({"saved_pmids": _saved[user_id]}, "Article saved")


@router.get("/library")
async def library(current_user: User = Depends(get_current_user)):
    user_id = str(current_user.id)
    return success({"saved_pmids": _saved.get(user_id, [])})
