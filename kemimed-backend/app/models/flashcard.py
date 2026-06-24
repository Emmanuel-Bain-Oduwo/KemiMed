import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, Float, ForeignKey, ARRAY, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey("topics.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    is_shared = Column(Boolean, default=False)
    share_code = Column(String(20), unique=True, nullable=True)
    card_count = Column(Integer, default=0)
    mastery_percent = Column(Integer, default=0)
    last_studied = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    user = relationship("User", back_populates="flashcard_decks")
    topic = relationship("Topic", back_populates="flashcard_decks")
    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deck_id = Column(UUID(as_uuid=True), ForeignKey("flashcard_decks.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    hint = Column(Text)
    pearl = Column(Text)
    mnemonic = Column(Text)
    image_url = Column(Text)
    tags = Column(ARRAY(String), default=[])
    difficulty = Column(String(20), default="medium")
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default="now()")

    deck = relationship("FlashcardDeck", back_populates="cards")
    progress = relationship("FlashcardProgress", back_populates="card", cascade="all, delete")


class FlashcardProgress(Base):
    __tablename__ = "flashcard_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    card_id = Column(UUID(as_uuid=True), ForeignKey("flashcards.id", ondelete="CASCADE"), nullable=False)
    ease_factor = Column(Float, default=2.5)
    interval_days = Column(Integer, default=0)
    repetitions = Column(Integer, default=0)
    next_review = Column(DateTime(timezone=True), server_default="now()")
    last_review = Column(DateTime(timezone=True), nullable=True)
    last_grade = Column(Integer, nullable=True)

    __table_args__ = (UniqueConstraint("user_id", "card_id", name="uq_user_card"),)

    user = relationship("User", back_populates="flashcard_progress")
    card = relationship("Flashcard", back_populates="progress")
