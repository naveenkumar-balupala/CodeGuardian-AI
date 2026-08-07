import uuid
from typing import Optional
from sqlalchemy import String, ForeignKey, Index, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class AuditLog(Base):
    """System-wide immutable security audit log."""
    __tablename__ = "audit_logs"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True, index=True)
    
    action: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    resource_type: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    resource_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    ip_address: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    payload: Mapped[Optional[dict]] = mapped_column(JSON_TYPE, nullable=True)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="audit_logs")
    organization: Mapped[Optional["Organization"]] = relationship("Organization", back_populates="audit_logs")

    __table_args__ = (
        Index("idx_audit_org_action", "organization_id", "action"),
    )
