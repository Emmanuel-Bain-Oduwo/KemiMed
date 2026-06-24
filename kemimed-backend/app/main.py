from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from loguru import logger
from app.config import settings
from app.database import engine
from app.models import Base
from app.middleware.rate_limit import limiter
from app.routers import (
    auth, users, topics, notes, flashcards, quiz,
    documents, media, ai_tutor, ai_generate, ai_voice,
    ai_image, exam_planner, progress, articles, mindmaps,
    study_rooms, board_exams, research, websocket,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("KemiMed™ API starting up...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ensured.")
    yield
    await engine.dispose()
    logger.info("KemiMed™ API shut down.")


app = FastAPI(
    title="KemiMed™ API",
    description="Backend API for KemiMed™ — AI Health Sciences Learning Platform by Kemirix Health Technologies",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Rate limiter state
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"success": False, "error": "Rate limit exceeded. Please slow down.", "code": 429},
    )


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router,         prefix="/api/auth",        tags=["Auth"])
app.include_router(users.router,        prefix="/api/users",       tags=["Users"])
app.include_router(topics.router,       prefix="/api/topics",      tags=["Topics"])
app.include_router(notes.router,        prefix="/api/notes",       tags=["Notes"])
app.include_router(flashcards.router,   prefix="/api/flashcards",  tags=["Flashcards"])
app.include_router(quiz.router,         prefix="/api/quiz",        tags=["Quiz"])
app.include_router(documents.router,    prefix="/api/documents",   tags=["Documents"])
app.include_router(media.router,        prefix="/api/media",       tags=["Media"])
app.include_router(ai_tutor.router,     prefix="/api/ai/tutor",    tags=["AI Tutor"])
app.include_router(ai_generate.router,  prefix="/api/ai/generate", tags=["AI Generate"])
app.include_router(ai_voice.router,     prefix="/api/ai/voice",    tags=["AI Voice"])
app.include_router(ai_image.router,     prefix="/api/ai/image",    tags=["AI Image"])
app.include_router(exam_planner.router, prefix="/api/exam",        tags=["Exam Planner"])
app.include_router(progress.router,     prefix="/api/progress",    tags=["Progress"])
app.include_router(articles.router,     prefix="/api/articles",    tags=["Articles"])
app.include_router(mindmaps.router,     prefix="/api/mindmaps",    tags=["Mindmaps"])
app.include_router(study_rooms.router,  prefix="/api/rooms",       tags=["Study Rooms"])
app.include_router(board_exams.router,  prefix="/api/board-exams", tags=["Board Exams"])
app.include_router(research.router,     prefix="/api/research",    tags=["Research"])
app.include_router(websocket.router,    prefix="/ws",              tags=["WebSocket"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "product": "KemiMed™", "version": "1.0.0", "by": "Kemirix Health Technologies"}


@app.get("/", tags=["Health"])
async def root():
    return {"message": "Welcome to KemiMed™ API", "docs": "/docs", "health": "/health"}
