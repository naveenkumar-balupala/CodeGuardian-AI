import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class RepositoryAnalysis(Base):
    """Stores automated technology detection and architecture analysis for a repository."""
    __tablename__ = "repo_analyses"

    repository_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, index=True)

    languages: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict) # e.g. {"Python": 45, "TypeScript": 40, "HTML/CSS": 15}
    frameworks: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # e.g. ["Next.js", "FastAPI", "React", "Tailwind CSS"]
    architecture_style: Mapped[str] = mapped_column(String(64), default="MONOREPO", nullable=False) # MONOREPO, MICROSERVICES, LAYERED_MONOLITH, SERVERLESS, SPA
    databases: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # e.g. ["PostgreSQL", "Redis"]
    ci_cd_tools: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # e.g. ["GitHub Actions"]
    docker_configs: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # e.g. ["Dockerfile", "docker-compose.yml"]
    package_managers: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # e.g. ["npm", "pip"]
    has_swagger: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    dependencies: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # List of {"name": "fastapi", "version": ">=0.111.0", "category": "backend"}
    summary_report: Mapped[str] = mapped_column(Text, nullable=False)

    scanned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationship
    repository: Mapped["Repository"] = relationship("Repository")

    __table_args__ = (
        Index("idx_repo_analysis_repo_id", "repository_id"),
    )
