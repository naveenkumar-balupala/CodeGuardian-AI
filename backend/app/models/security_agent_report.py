import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class SecurityAgentReport(Base):
    """Stores automated Security Agent scan findings, OWASP taxonomy, CVSS v3.1 scores, risk score (0-100), AI recommendations, patch diffs, and chart datasets."""
    __tablename__ = "security_agent_reports"

    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)

    risk_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0) # 0 to 100
    risk_level: Mapped[str] = mapped_column(String(32), nullable=False, default="LOW") # CRITICAL, HIGH, MEDIUM, LOW

    critical_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    high_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    medium_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    low_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Telemetry Lists & Datasets
    findings: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    owasp_distribution: Mapped[dict] = mapped_column(JSON_TYPE, nullable=False, default=dict)
    chart_dataset: Mapped[dict] = mapped_column(JSON_TYPE, nullable=False, default=dict)

    scanned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationship
    repository: Mapped["Repository"] = relationship("Repository")

    __table_args__ = (
        Index("idx_security_agent_repo_id", "repository_id"),
    )
