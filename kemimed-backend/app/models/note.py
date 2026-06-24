import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Note(Base):
    __tablename__ = "notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    title = Column(String(255), default="Untitled Note")
    content_json = Column(JSONB)
    content_text = Column(Text)
    tags = Column(ARRAY(String), default=[])
    is_pinned = Column(Boolean, default=False)
    word_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()", onupdate="now()")

    user = relationship("User", back_populates="notes")
    topic = relationship("Topic", back_populates="notes")
