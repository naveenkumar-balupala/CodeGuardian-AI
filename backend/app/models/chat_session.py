import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, ForeignKey, DateTime, Text, Index, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class ChatSession(Base):
    """Stores chat conversation sessions associated with a repository."""
    __tablename__ = "chat_sessions"

    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, default="New Code Analysis Session")

    # Relationship
    repository: Mapped["Repository"] = relationship("Repository")
    user: Mapped["User"] = relationship("User")
    messages: Mapped[List["ChatMessage"]] = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at.asc()")

    __table_args__ = (
        Index("idx_chat_session_repo_user", "repository_id", "user_id"),
    )

class ChatMessage(Base):
    """Stores individual messages, role (user/assistant), content, and referenced source code snippets/files."""
    __tablename__ = "chat_messages"

    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(32), nullable=False) # 'user' | 'assistant' | 'system'
    content: Mapped[str] = mapped_column(Text, nullable=False)

    referenced_files: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list) # List of {file_path, line_start, line_end, snippet}

    # Relationship
    session: Mapped["ChatSession"] = relationship("ChatSession", back_populates="messages")

    __table_args__ = (
        Index("idx_chat_message_session_id", "session_id"),
    )
