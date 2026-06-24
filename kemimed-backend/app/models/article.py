import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, index=True)
    content_json = Column(JSONB)
    content_text = Column(Text)
    excerpt = Column(Text)
    cover_url = Column(Text)
    category = Column(String(100))
    tags = Column(ARRAY(String), default=[])
    status = Column(String(20), default="draft")
    views = Column(Integer, default=0)
    read_min = Column(Integer, default=5)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")
    updated_at = Column(DateTime(timezone=True), server_default="now()", onupdate="now()")

    author = relationship("User", back_populates="articles")
