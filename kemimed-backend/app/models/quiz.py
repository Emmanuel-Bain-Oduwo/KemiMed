import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    quiz_title = Column(String(255))
    quiz_type = Column(String(50), default="mcq")
    difficulty = Column(String(50), default="undergraduate")
    questions = Column(JSONB, nullable=False)
    answers = Column(JSONB, default=[])
    score = Column(Integer, default=0)
    max_score = Column(Integer)
    time_taken_sec = Column(Integer)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="quiz_attempts")
    topic = relationship("Topic", back_populates="quiz_attempts")
