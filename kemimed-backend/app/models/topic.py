import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100), nullable=False)
    disciplines = Column(ARRAY(String), default=[])
    icon = Column(String(10))
    color = Column(String(20))
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    notes = relationship("Note", back_populates="topic")
    flashcard_decks = relationship("FlashcardDeck", back_populates="topic")
    quiz_attempts = relationship("QuizAttempt", back_populates="topic")
    ai_sessions = relationship("AISession", back_populates="topic")
    documents = relationship("Document", back_populates="topic")
    exam_plans = relationship("ExamPlan", back_populates="topic")
    mindmaps = relationship("Mindmap", back_populates="topic")
    study_sessions = relationship("StudySession", back_populates="topic")
    voice_sessions = relationship("VoiceSession", back_populates="topic")
