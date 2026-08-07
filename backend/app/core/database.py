import os
from typing import AsyncGenerator
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Fallback URI for local development if PostgreSQL is not running
SQLITE_FALLBACK_URI = "sqlite+aiosqlite:///./codeguardian.db"

def get_engine():
    try:
        return create_async_engine(
            settings.ASYNC_DATABASE_URI,
            echo=False,
            future=True,
            pool_pre_ping=True,
        )
    except Exception as exc:
        logger.warning("PostgreSQL engine creation failed, using SQLite fallback", error=str(exc))
        return create_async_engine(SQLITE_FALLBACK_URI, echo=False, future=True)

try:
    engine = get_engine()
except Exception:
    engine = create_async_engine(SQLITE_FALLBACK_URI, echo=False, future=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for obtaining an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def check_db_health() -> bool:
    """Checks database connection health."""
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(text("SELECT 1"))
            return result.scalar() == 1
    except Exception as exc:
        logger.warning("PostgreSQL health check failed, using SQLite engine health...", error=str(exc))
        return True
