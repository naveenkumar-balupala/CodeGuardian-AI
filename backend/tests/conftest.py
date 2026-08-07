import uuid
from collections.abc import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.api.deps import get_db
from app.core.security import create_access_token, get_password_hash
from app.main import app
from app.models import Organization, Repository, User, UserRole, UserStatus
from app.models.base import Base

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture(scope="function")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False, future=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture(scope="function")
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    async_session = async_sessionmaker(bind=test_engine, expire_on_commit=False)
    async with async_session() as session:
        yield session
        await session.rollback()

@pytest_asyncio.fixture
async def mock_user(db_session: AsyncSession) -> User:
    unique_email = f"auditor_{uuid.uuid4().hex[:8]}@codeguardian.ai"
    user = User(
        id=uuid.uuid4(),
        email=unique_email,
        full_name="Test Auditor User",
        hashed_password=get_password_hash("TestPassword123!"),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE,
        is_verified=True,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user

@pytest_asyncio.fixture
async def mock_repository(db_session: AsyncSession, mock_user: User) -> Repository:
    org = Organization(
        id=uuid.uuid4(),
        name=f"Org {uuid.uuid4().hex[:6]}",
        slug=f"org-{uuid.uuid4().hex[:6]}",
    )
    db_session.add(org)
    await db_session.commit()

    repo = Repository(
        id=uuid.uuid4(),
        organization_id=org.id,
        name="CodeGuardian-AI",
        full_name="naveenkumar-balupala/CodeGuardian-AI",
        clone_url="https://github.com/naveenkumar-balupala/CodeGuardian-AI.git",
        default_branch="main",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)
    return repo

@pytest_asyncio.fixture
async def auth_headers(mock_user: User) -> dict:
    access_token = create_access_token(
        subject=str(mock_user.id),
        roles=[mock_user.role.value],
    )
    return {"Authorization": f"Bearer {access_token}"}

@pytest_asyncio.fixture
async def async_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
