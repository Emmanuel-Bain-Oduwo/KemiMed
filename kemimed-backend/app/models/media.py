import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, BigInteger, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_url = Column(Text, nullable=False)
    file_key = Column(Text, nullable=False)
    file_type = Column(String(20), nullable=False)
    mime_type = Column(String(100))
    file_size = Column(BigInteger)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    parsed_text = Column(Text)
    ai_summary = Column(Text)
    duration_sec = Column(Integer)
    thumbnail = Column(Text)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    user = relationship("User", back_populates="media_files")


class VoiceSession(Base):
    __tablename__ = "voice_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    transcript = Column(JSONB, default=[])
    duration_sec = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    user = relationship("User", back_populates="voice_sessions")
    topic = relationship("Topic", back_populates="voice_sessions")
