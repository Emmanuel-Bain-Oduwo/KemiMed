import uuid
import enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class DisciplineEnum(str, enum.Enum):
    pharmacy = "pharmacy"
    medicine = "medicine"
    nursing = "nursing"
    mls = "mls"
    physiotherapy = "physiotherapy"
    dentistry = "dentistry"
    nutrition = "nutrition"
    public_health = "public_health"
    other = "other"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    avatar_url = Column(Text)
    discipline = Column(Enum(DisciplineEnum), default=DisciplineEnum.pharmacy)
    study_year = Column(Integer)
    university = Column(String(255))
    country = Column(String(100))
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    xp_total = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_study_date = Column(DateTime(timezone=True))
    image_count = Column(Integer, default=0)
    pdf_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()", onupdate="now()")

    notes = relationship("Note", back_populates="user", cascade="all, delete")
    flashcard_decks = relationship("FlashcardDeck", back_populates="user", cascade="all, delete")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete")
    ai_sessions = relationship("AISession", back_populates="user", cascade="all, delete")
    documents = relationship("Document", back_populates="user", cascade="all, delete")
    media_files = relationship("MediaFile", back_populates="user", cascade="all, delete")
    exam_plans = relationship("ExamPlan", back_populates="user", cascade="all, delete")
    articles = relationship("Article", back_populates="author", cascade="all, delete")
    study_sessions = relationship("StudySession", back_populates="user", cascade="all, delete")
    reminders = relationship("Reminder", back_populates="user", cascade="all, delete")
    mindmaps = relationship("Mindmap", back_populates="user", cascade="all, delete")
    voice_sessions = relationship("VoiceSession", back_populates="user", cascade="all, delete")
    flashcard_progress = relationship("FlashcardProgress", back_populates="user", cascade="all, delete")
