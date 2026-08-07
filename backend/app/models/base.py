import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, Boolean, Column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr

class Base(DeclarativeBase):
    """Base SQLAlchemy declarative model with automatic table naming and UUID PK."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    @declared_attr.directive
    def __tablename__(cls) -> str:
        """Automatically set table name to pluralized snake_case."""
        name = cls.__name__
        return "".join([f"_{c.lower()}" if c.isupper() and i > 0 else c.lower() for i, c in enumerate(name)]) + "s"

class SoftDeleteMixin:
    """Mixin adding soft delete capability to database entities."""

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )

    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    def soft_delete(self) -> None:
        self.is_deleted = True
        self.deleted_at = datetime.now(timezone.utc)
