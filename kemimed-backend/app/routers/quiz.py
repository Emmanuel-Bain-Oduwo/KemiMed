import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.database import get_db
from app.models.quiz import QuizAttempt
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success

router = APIRouter()


class QuizCreate(BaseModel):
    topic_id: str | None = None
    quiz_title: str = "Untitled Quiz"
    quiz_type: str = "mcq"
    difficulty: str = "undergraduate"
    questions: list[dict]


class QuizSubmit(BaseModel):
    answers: list[dict]
    time_taken_sec: int | None = None


@router.post("/attempts")
async def create_attempt(body: QuizCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    attempt = QuizAttempt(
        user_id=current_user.id,
        topic_id=uuid.UUID(body.topic_id) if body.topic_id else None,
        quiz_title=body.quiz_title,
        quiz_type=body.quiz_type,
        difficulty=body.difficulty,
        questions=body.questions,
        max_score=len(body.questions),
    )
    db.add(attempt)
    await db.flush()
    await db.refresh(attempt)
    return success({"attempt_id": str(attempt.id), "question_count": len(body.questions)})


@router.get("/attempts")
async def list_attempts(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(QuizAttempt).where(QuizAttempt.user_id == current_user.id).order_by(QuizAttempt.created_at.desc()).limit(50))
    attempts = result.scalars().all()
    return success([{
        "id": str(a.id), "quiz_title": a.quiz_title, "quiz_type": a.quiz_type,
        "difficulty": a.difficulty, "score": a.score, "max_score": a.max_score,
        "completed": a.completed, "created_at": str(a.created_at),
    } for a in attempts])


@router.get("/attempts/{attempt_id}")
async def get_attempt(attempt_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(QuizAttempt).where(QuizAttempt.id == uuid.UUID(attempt_id), QuizAttempt.user_id == current_user.id))
    attempt = result.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Quiz attempt not found")
    return success({
        "id": str(attempt.id), "quiz_title": attempt.quiz_title,
        "questions": attempt.questions, "answers": attempt.answers,
        "score": attempt.score, "max_score": attempt.max_score,
        "completed": attempt.completed,
    })


@router.post("/attempts/{attempt_id}/submit")
async def submit_attempt(attempt_id: str, body: QuizSubmit, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(QuizAttempt).where(QuizAttempt.id == uuid.UUID(attempt_id), QuizAttempt.user_id == current_user.id))
    attempt = result.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Quiz attempt not found")
    if attempt.completed:
        raise HTTPException(status_code=400, detail="Quiz already submitted")

    score = 0
    correct = []
    wrong = []
    for answer in body.answers:
        idx = answer.get("question_index", -1)
        selected = answer.get("selected_option", "")
        if 0 <= idx < len(attempt.questions):
            q = attempt.questions[idx]
            if selected == q.get("correct"):
                score += 1
                correct.append(idx)
            else:
                wrong.append({"index": idx, "selected": selected, "correct": q.get("correct"), "explanation": q.get("explanation", "")})

    attempt.answers = body.answers
    attempt.score = score
    attempt.completed = True
    attempt.time_taken_sec = body.time_taken_sec
    attempt.completed_at = datetime.utcnow()
    await db.flush()

    percentage = round((score / attempt.max_score) * 100) if attempt.max_score else 0
    return success({
        "score": score, "max_score": attempt.max_score, "percentage": percentage,
        "correct_questions": correct, "wrong_questions": wrong,
    })


@router.get("/stats")
async def quiz_stats(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(
            func.count(QuizAttempt.id).label("total"),
            func.avg(QuizAttempt.score * 100.0 / QuizAttempt.max_score).label("avg_score"),
        ).where(QuizAttempt.user_id == current_user.id, QuizAttempt.completed == True)
    )
    row = result.one()
    return success({"total_quizzes": row.total or 0, "average_score_pct": round(row.avg_score or 0, 1)})
