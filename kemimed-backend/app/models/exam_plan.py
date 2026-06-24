import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, Float, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class ExamPlan(Base):
    __tablename__ = "exam_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    exam_name = Column(String(255), nullable=False)
    exam_date = Column(Date, nullable=False)
    institution = Column(String(255))
    topics = Column(JSONB, default=[])
    daily_hours = Column(Float, default=3)
    plan_json = Column(JSONB, default={})
    readiness_pct = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()", onupdate="now()")

    user = relationship("User", back_populates="exam_plans")
    topic = relationship("Topic", back_populates="exam_plans")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50))
    message = Column(Text)
    send_at = Column(DateTime(timezone=True))
    channel = Column(String(20), default="in_app")
    is_sent = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    user = relationship("User", back_populates="reminders")
