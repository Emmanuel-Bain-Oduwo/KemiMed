import uuid
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models.exam_plan import ExamPlan
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.services.ai_service import chat_complete
from app.utils.response import success
from datetime import date

router = APIRouter()


class ExamPlanCreate(BaseModel):
    exam_name: str
    exam_date: str
    institution: str | None = None
    topics: list[str] = []
    daily_hours: float = 3


@router.get("/plans")
async def list_plans(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExamPlan).where(ExamPlan.user_id == current_user.id).order_by(ExamPlan.created_at.desc()))
    plans = result.scalars().all()
    return success([{
        "id": str(p.id), "exam_name": p.exam_name, "exam_date": str(p.exam_date),
        "institution": p.institution, "topics": p.topics,
        "daily_hours": p.daily_hours, "readiness_pct": p.readiness_pct,
    } for p in plans])


@router.post("/plans")
async def create_plan(body: ExamPlanCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    prompt = f"""Create a day-by-day medical exam study plan:
Exam: {body.exam_name}
Date: {body.exam_date}
Topics: {', '.join(body.topics)}
Daily hours available: {body.daily_hours}

Return ONLY a JSON object:
{{"days": [{{"date": "YYYY-MM-DD", "focus_topic": "topic", "tasks": ["task"], "duration_min": 120, "resources": []}}]}}"""

    raw = await chat_complete([{"role": "user", "content": prompt}], "You are a medical exam coach. Return only valid JSON.", json_mode=True)
    try:
        plan_data = json.loads(raw)
    except Exception:
        plan_data = {}

    plan = ExamPlan(
        user_id=current_user.id,
        exam_name=body.exam_name,
        exam_date=date.fromisoformat(body.exam_date),
        institution=body.institution,
        topics=body.topics,
        daily_hours=body.daily_hours,
        plan_json=plan_data,
    )
    db.add(plan)
    await db.flush()
    await db.refresh(plan)
    return success({"id": str(plan.id), "exam_name": plan.exam_name, "plan": plan_data})


@router.get("/plans/{plan_id}/plan")
async def get_plan_detail(plan_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExamPlan).where(ExamPlan.id == uuid.UUID(plan_id), ExamPlan.user_id == current_user.id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return success({"exam_name": plan.exam_name, "exam_date": str(plan.exam_date), "plan": plan.plan_json})


@router.put("/plans/{plan_id}")
async def update_plan(plan_id: str, body: ExamPlanCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExamPlan).where(ExamPlan.id == uuid.UUID(plan_id), ExamPlan.user_id == current_user.id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan.exam_name = body.exam_name
    plan.exam_date = date.fromisoformat(body.exam_date)
    plan.institution = body.institution
    plan.topics = body.topics
    plan.daily_hours = body.daily_hours
    await db.flush()
    return success(message="Plan updated")


@router.delete("/plans/{plan_id}")
async def delete_plan(plan_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExamPlan).where(ExamPlan.id == uuid.UUID(plan_id), ExamPlan.user_id == current_user.id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    await db.delete(plan)
    return success(message="Plan deleted")
