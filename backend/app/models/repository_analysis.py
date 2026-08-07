import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

class RepositoryAnalysis(Base):
    """Stores automated technology detection and architecture analysis for a repository."""
    __tablename__ = "repo_analyses"

    repository_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)

    languages: Mapped[dict] = mapped_column(JSON_TYPE, nullable=False, default=dict)
    frameworks: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    architecture_style: Mapped[str] = mapped_column(String(64), default="MONOREPO", nullable=False)
    databases: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    ci_cd_tools: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    docker_configs: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    package_managers: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    has_swagger: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    dependencies: Mapped[list] = mapped_column(JSON_TYPE, nullable=False, default=list)
    summary_report: Mapped[str] = mapped_column(Text, nullable=False)

    scanned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationship
    repository: Mapped["Repository"] = relationship("Repository")

    __table_args__ = (
        Index("idx_repo_analysis_repo_id", "repository_id"),
    )
