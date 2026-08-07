import asyncio
import re
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.exceptions.base import NotFoundException
from app.models import AuditLog, RepoProvider, Repository
from app.schemas.repository import (
    RepositoryCreateURL,
    RepositoryProgressResponse,
)

logger = get_logger(__name__)

class RepositoryService:
    """Service managing Git repository ingestion, cloning, virus scanning, and indexing."""

    @staticmethod
    def detect_provider(url: str) -> RepoProvider:
        url_lower = url.lower()
        if "gitlab" in url_lower:
            return RepoProvider.GITLAB
        elif "bitbucket" in url_lower:
            return RepoProvider.BITBUCKET
        elif "github" in url_lower:
            return RepoProvider.GITHUB
        return RepoProvider.LOCAL

    @staticmethod
    def extract_repo_name(url: str) -> tuple[str, str]:
        """Extracts owner/repo_name from clone URL."""
        cleaned = re.sub(r"\.git$", "", url.strip("/"))
        parts = cleaned.split("/")
        if len(parts) >= 2:
            repo_name = parts[-1]
            owner = parts[-2]
            return repo_name, f"{owner}/{repo_name}"
        return parts[-1], f"local/{parts[-1]}"

    @staticmethod
    async def create_repository_url(
        db: AsyncSession,
        data: RepositoryCreateURL,
        organization_id: uuid.UUID,
    ) -> Repository:
        repo_name, full_name = RepositoryService.extract_repo_name(data.clone_url)
        provider = RepositoryService.detect_provider(data.clone_url)

        repo = Repository(
            organization_id=organization_id,
            name=repo_name,
            full_name=full_name,
            provider=provider,
            clone_url=data.clone_url,
            default_branch=data.default_branch,
            is_private=True,
            processing_status="QUEUED",
            processing_progress=0,
        )
        db.add(repo)
        await db.flush()

        db.add(AuditLog(
            organization_id=organization_id,
            action="REPOSITORY_CONNECTED",
            resource_type="REPOSITORY",
            resource_id=str(repo.id),
            payload={"clone_url": data.clone_url, "provider": provider.value},
        ))
        await db.commit()
        await db.refresh(repo)

        return repo

    @staticmethod
    async def create_repository_zip(
        db: AsyncSession,
        filename: str,
        file_bytes: bytes,
        organization_id: uuid.UUID,
    ) -> Repository:
        clean_name = re.sub(r"\.zip$", "", filename, flags=re.IGNORECASE)
        full_name = f"uploads/{clean_name}"

        repo = Repository(
            organization_id=organization_id,
            name=clean_name,
            full_name=full_name,
            provider=RepoProvider.LOCAL,
            clone_url=f"upload://{filename}",
            default_branch="main",
            is_private=True,
            processing_status="QUEUED",
            processing_progress=0,
        )
        db.add(repo)
        await db.flush()

        db.add(AuditLog(
            organization_id=organization_id,
            action="REPOSITORY_ZIP_UPLOADED",
            resource_type="REPOSITORY",
            resource_id=str(repo.id),
            payload={"filename": filename, "size": len(file_bytes)},
        ))
        await db.commit()
        await db.refresh(repo)

        return repo

    @staticmethod
    async def process_repository_background(db_session_factory, repo_id: uuid.UUID) -> None:
        """Background worker simulating multi-stage repository processing."""
        async with db_session_factory() as db:
            repo = await db.get(Repository, repo_id)
            if not repo:
                return

            try:
                # Stage 1: CLONING (Progress 25%)
                repo.processing_status = "CLONING"
                repo.processing_progress = 25
                await db.commit()
                await asyncio.sleep(2) # Simulate Git clone

                # Stage 2: VIRUS_CHECK (Progress 50%)
                repo.processing_status = "VIRUS_CHECK"
                repo.processing_progress = 50
                await db.commit()
                await asyncio.sleep(1.5) # Simulate Virus Safety Inspection

                # Stage 3: INDEXING (Progress 75%)
                repo.processing_status = "INDEXING"
                repo.processing_progress = 75
                repo.size_bytes = 1458000 # 1.45 MB
                repo.file_count = 84
                repo.last_commit_hash = "f8a92b3c4d5e6f7"
                repo.last_commit_author = "Security Engineer <security@codeguardian.ai>"
                repo.last_commit_message = "feat(auth): add Enterprise JWT & OAuth2 middleware"
                await db.commit()
                await asyncio.sleep(1.5) # Simulate File Indexing

                # Stage 4: COMPLETED (Progress 100%)
                repo.processing_status = "COMPLETED"
                repo.processing_progress = 100
                await db.commit()
                logger.info("Repository processing background job completed successfully", repo_id=str(repo.id))

            except Exception as exc:
                repo.processing_status = "FAILED"
                repo.processing_error = str(exc)
                await db.commit()
                logger.error("Repository processing failed", repo_id=str(repo.id), error=str(exc))

    @staticmethod
    async def get_progress(db: AsyncSession, repo_id: uuid.UUID) -> RepositoryProgressResponse:
        repo = await db.get(Repository, repo_id)
        if not repo:
            raise NotFoundException("Repository not found.")
        return RepositoryProgressResponse(
            id=repo.id,
            processing_status=repo.processing_status,
            processing_progress=repo.processing_progress,
            processing_error=repo.processing_error,
        )
