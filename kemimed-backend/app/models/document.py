import uuid
from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    file_name = Column(String(255))
    file_url = Column(Text)
    file_type = Column(String(50))
    parsed_text = Column(Text)
    summary = Column(Text)
    summary_format = Column(String(50))
    page_count = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    user = relationship("User", back_populates="documents")
    topic = relationship("Topic", back_populates="documents")
