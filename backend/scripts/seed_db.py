import asyncio
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.database import AsyncSessionLocal
from app.models import (
    AIRemediation,
    AuditLog,
    Finding,
    FindingHistory,
    FindingStatus,
    MemberRole,
    Organization,
    OrganizationMember,
    OrgTier,
    RepoProvider,
    Repository,
    Scan,
    ScanStatus,
    ScanType,
    SeverityLevel,
    User,
    UserRole,
    UserStatus,
)


async def seed_database():
    print("Starting database seeding...")
    async with AsyncSessionLocal() as session:
        try:
            # 1. Create Default Admin User
            admin_user = User(
                email="admin@codeguardian.ai",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW", # hashed 'admin123'
                full_name="System Administrator",
                role=UserRole.ADMIN,
                status=UserStatus.ACTIVE,
            )
            session.add(admin_user)
            await session.flush()

            # 2. Create Default Organization
            org = Organization(
                name="CodeGuardian Enterprise",
                slug="codeguardian-enterprise",
                tier=OrgTier.ENTERPRISE,
            )
            session.add(org)
            await session.flush()

            # 3. Create Org Membership
            membership = OrganizationMember(
                organization_id=org.id,
                user_id=admin_user.id,
                role=MemberRole.OWNER,
            )
            session.add(membership)

            # 4. Create Sample Repository
            repo = Repository(
                organization_id=org.id,
                name="core-engine",
                full_name="codeguardian-enterprise/core-engine",
                provider=RepoProvider.GITHUB,
                clone_url="https://github.com/codeguardian-enterprise/core-engine.git",
                default_branch="main",
                is_private=True,
            )
            session.add(repo)
            await session.flush()

            # 5. Create Sample Scan
            scan = Scan(
                repository_id=repo.id,
                triggered_by_user_id=admin_user.id,
                scan_type=ScanType.SAST,
                status=ScanStatus.COMPLETED,
                commit_hash="a1b2c3d4e5f67890",
                branch="main",
            )
            session.add(scan)
            await session.flush()

            # 6. Create Security Finding
            finding = Finding(
                scan_id=scan.id,
                repository_id=repo.id,
                rule_id="CWE-89-SQL-INJECTION",
                title="Potential Unsanitized SQL Query String Concatenation",
                description="User input is directly concatenated into SQL query string without parameterized queries.",
                severity=SeverityLevel.CRITICAL,
                status=FindingStatus.OPEN,
                file_path="app/api/v1/auth.py",
                line_number=42,
                cwe_id="CWE-89",
                cvss_score=9.8,
            )
            session.add(finding)
            await session.flush()

            # 7. Create Finding History Audit Record
            history = FindingHistory(
                finding_id=finding.id,
                changed_by_user_id=admin_user.id,
                previous_status=FindingStatus.OPEN,
                new_status=FindingStatus.OPEN,
                comment="Initial vulnerability detected during automated SAST scan.",
            )
            session.add(history)

            # 8. Create AI Remediation Suggestion
            ai_fix = AIRemediation(
                finding_id=finding.id,
                suggested_fix_diff=(
                    "--- app/api/v1/auth.py\n"
                    "+++ app/api/v1/auth.py\n"
                    "@@ -42,1 +42,1 @@\n"
                    "- query = f'SELECT * FROM users WHERE email = {user_input}'\n"
                    "+ query = select(User).where(User.email == user_input)\n"
                ),
                explanation="Replace raw string concatenation with SQLAlchemy parameterized select construct to eliminate SQL injection vulnerability.",
                confidence_score=0.99,
                prompt_tokens=420,
                completion_tokens=180,
            )
            session.add(ai_fix)

            # 9. Create System Audit Log
            audit = AuditLog(
                user_id=admin_user.id,
                organization_id=org.id,
                action="INITIALIZE_SEED_DATA",
                resource_type="DATABASE",
                resource_id=str(org.id),
                ip_address="127.0.0.1",
                payload={"status": "database_seeded_successfully"},
            )
            session.add(audit)

            await session.commit()
            print("Database successfully seeded with initial records!")

        except Exception as e:
            await session.rollback()
            print(f"Error seeding database: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(seed_database())
