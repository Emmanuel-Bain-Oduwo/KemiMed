import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Date, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class StudyRoom(Base):
    __tablename__ = "study_rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    deck_id = Column(UUID(as_uuid=True), ForeignKey("flashcard_decks.id"), nullable=True)
    members = Column(ARRAY(String), default=[])
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    date = Column(Date, server_default="CURRENT_DATE")
    duration_min = Column(Integer, default=0)
    activity_type = Column(String(50))
    xp_earned = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    user = relationship("User", back_populates="study_sessions")
    topic = relationship("Topic", back_populates="study_sessions")
