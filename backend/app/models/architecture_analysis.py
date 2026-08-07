import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class ArchitectureReport(Base):
    """Stores automated architecture inspection results, dependency graph, Mermaid diagram syntax, coupling metrics, SOLID/DRY/KISS violations, design patterns, and AI recommendations."""
    __tablename__ = "architecture_reports"

    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)

    pattern: Mapped[str] = mapped_column(String(64), nullable=False, default="MONOREPO") # MONOREPO, MICROSERVICES, LAYERED_MONOLITH, SERVERLESS
    coupling_score: Mapped[float] = mapped_column(Float, nullable=False, default=1.5) # 0.0 to 10.0 (lower is better)
    solid_score: Mapped[int] = mapped_column(Integer, nullable=False, default=95) # 0 to 100
    dry_score: Mapped[int] = mapped_column(Integer, nullable=False, default=90) # 0 to 100
    kiss_score: Mapped[int] = mapped_column(Integer, nullable=False, default=92) # 0 to 100

    # Detailed Telemetry Lists & Diagrams
    detected_patterns: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    solid_violations: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    dry_violations: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    kiss_violations: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    module_coupling: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    mermaid_diagram: Mapped[str] = mapped_column(Text, nullable=False)
    ai_recommendations: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)

    scanned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationship
    repository: Mapped["Repository"] = relationship("Repository")

    __table_args__ = (
        Index("idx_arch_report_repo_id", "repository_id"),
    )
