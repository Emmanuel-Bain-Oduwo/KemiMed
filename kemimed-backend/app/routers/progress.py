import uuid
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.database import get_db
from app.models.study_room import StudySession
from app.models.exam_plan import Reminder
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success

router = APIRouter()


class StudySessionLog(BaseModel):
    topic_id: str | None = None
    duration_min: int
    activity_type: str
    xp_earned: int = 0


class ReminderCreate(BaseModel):
    type: str
    message: str | None = None
    send_at: str
    channel: str = "in_app"


@router.get("/dashboard")
async def dashboard(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    today = date.today()
    month_start = today.replace(day=1)

    sessions_result = await db.execute(
        select(func.sum(StudySession.duration_min), func.sum(StudySession.xp_earned))
        .where(StudySession.user_id == current_user.id, StudySession.date >= month_start)
    )
    row = sessions_result.one()
    study_time_min = row[0] or 0
    xp_month = row[1] or 0

    return success({
        "streak_days": current_user.streak_days,
        "xp_total": current_user.xp_total,
        "study_time_this_month_min": study_time_min,
        "image_uploads": current_user.image_count,
        "pdf_uploads": current_user.pdf_count,
        "discipline": current_user.discipline,
    })


@router.post("/study-session")
async def log_study_session(body: StudySessionLog, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session = StudySession(
        user_id=current_user.id,
        topic_id=uuid.UUID(body.topic_id) if body.topic_id else None,
        duration_min=body.duration_min,
        activity_type=body.activity_type,
        xp_earned=body.xp_earned,
    )
    db.add(session)
    current_user.xp_total = (current_user.xp_total or 0) + body.xp_earned
    await db.flush()
    return success({"xp_total": current_user.xp_total}, "Study session logged")


@router.get("/heatmap")
async def heatmap(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    today = date.today()
    start = today - timedelta(days=29)
    result = await db.execute(
        select(StudySession.date, func.sum(StudySession.duration_min).label("total_min"))
        .where(StudySession.user_id == current_user.id, StudySession.date >= start)
        .group_by(StudySession.date)
    )
    rows = result.all()
    day_map = {str(r.date): r.total_min for r in rows}

    heatmap_data = []
    for i in range(30):
        d = str(start + timedelta(days=i))
        mins = day_map.get(d, 0)
        intensity = 0 if mins == 0 else (1 if mins < 30 else (2 if mins < 60 else (3 if mins < 120 else 4)))
        heatmap_data.append({"date": d, "intensity": intensity, "minutes": mins})
    return success(heatmap_data)


@router.get("/reminders")
async def list_reminders(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reminder).where(Reminder.user_id == current_user.id).order_by(Reminder.send_at))
    reminders = result.scalars().all()
    return success([{"id": str(r.id), "type": r.type, "message": r.message, "send_at": str(r.send_at), "channel": r.channel, "is_sent": r.is_sent} for r in reminders])


@router.post("/reminders")
async def create_reminder(body: ReminderCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from datetime import datetime
    reminder = Reminder(
        user_id=current_user.id,
        type=body.type,
        message=body.message,
        send_at=datetime.fromisoformat(body.send_at),
        channel=body.channel,
    )
    db.add(reminder)
    await db.flush()
    await db.refresh(reminder)
    return success({"id": str(reminder.id)}, "Reminder set")


@router.delete("/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reminder).where(Reminder.id == uuid.UUID(reminder_id), Reminder.user_id == current_user.id))
    reminder = result.scalar_one_or_none()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    await db.delete(reminder)
    return success(message="Reminder deleted")
