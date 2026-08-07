"""Initial PostgreSQL Schema for CodeGuardian AI

Revision ID: 2026_08_07_0001
Revises:
Create Date: 2026-08-07 11:30:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0001'
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    # 1. Create Enums
    user_role_enum = postgresql.ENUM('ADMIN', 'SECURITY_ENGINEER', 'DEVELOPER', 'VIEWER', name='userrole')
    user_role_enum.create(op.get_bind(), checkfirst=True)

    user_status_enum = postgresql.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', name='userstatus')
    user_status_enum.create(op.get_bind(), checkfirst=True)

    org_tier_enum = postgresql.ENUM('FREE', 'TEAM', 'ENTERPRISE', name='orgtier')
    org_tier_enum.create(op.get_bind(), checkfirst=True)

    member_role_enum = postgresql.ENUM('OWNER', 'ADMIN', 'MEMBER', 'READ_ONLY', name='memberrole')
    member_role_enum.create(op.get_bind(), checkfirst=True)

    repo_provider_enum = postgresql.ENUM('GITHUB', 'GITLAB', 'BITBUCKET', 'LOCAL', name='repoprovider')
    repo_provider_enum.create(op.get_bind(), checkfirst=True)

    scan_type_enum = postgresql.ENUM('SAST', 'DAST', 'DEPENDENCY', 'SECRET', 'FULL_AUDIT', name='scantype')
    scan_type_enum.create(op.get_bind(), checkfirst=True)

    scan_status_enum = postgresql.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', name='scanstatus')
    scan_status_enum.create(op.get_bind(), checkfirst=True)

    severity_level_enum = postgresql.ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO', name='severitylevel')
    severity_level_enum.create(op.get_bind(), checkfirst=True)

    finding_status_enum = postgresql.ENUM('OPEN', 'IN_REVIEW', 'RESOLVED', 'FALSE_POSITIVE', 'IGNORED', name='findingstatus')
    finding_status_enum.create(op.get_bind(), checkfirst=True)

    # 2. Create Users Table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.Enum('ADMIN', 'SECURITY_ENGINEER', 'DEVELOPER', 'VIEWER', name='userrole'), nullable=False, server_default='DEVELOPER'),
        sa.Column('status', sa.Enum('ACTIVE', 'INACTIVE', 'SUSPENDED', name='userstatus'), nullable=False, server_default='ACTIVE'),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_is_deleted', 'users', ['is_deleted'])

    # 3. Create Organizations Table
    op.create_table(
        'organizations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), nullable=False, unique=True),
        sa.Column('tier', sa.Enum('FREE', 'TEAM', 'ENTERPRISE', name='orgtier'), nullable=False, server_default='FREE'),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_orgs_slug', 'organizations', ['slug'])

    # 4. Create Organization Members Table
    op.create_table(
        'organization_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role', sa.Enum('OWNER', 'ADMIN', 'MEMBER', 'READ_ONLY', name='memberrole'), nullable=False, server_default='MEMBER'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.UniqueConstraint('organization_id', 'user_id', name='uq_org_user_membership'),
    )
    op.create_index('idx_org_user', 'organization_members', ['organization_id', 'user_id'])

    # 5. Create Repositories Table
    op.create_table(
        'repositories',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(512), nullable=False),
        sa.Column('provider', sa.Enum('GITHUB', 'GITLAB', 'BITBUCKET', 'LOCAL', name='repoprovider'), nullable=False, server_default='GITHUB'),
        sa.Column('clone_url', sa.String(1024), nullable=False),
        sa.Column('default_branch', sa.String(128), nullable=False, server_default='main'),
        sa.Column('is_private', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_org_repo_name', 'repositories', ['organization_id', 'name'])
    op.create_index('idx_repos_full_name', 'repositories', ['full_name'])

    # 6. Create API Keys Table
    op.create_table(
        'api_keys',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('key_name', sa.String(255), nullable=False),
        sa.Column('key_prefix', sa.String(16), nullable=False),
        sa.Column('hashed_key', sa.String(255), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_revoked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_api_keys_prefix', 'api_keys', ['key_prefix'])

    # 7. Create Scans Table
    op.create_table(
        'scans',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('repository_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('triggered_by_user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('scan_type', sa.Enum('SAST', 'DAST', 'DEPENDENCY', 'SECRET', 'FULL_AUDIT', name='scantype'), nullable=False, server_default='FULL_AUDIT'),
        sa.Column('status', sa.Enum('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', name='scanstatus'), nullable=False, server_default='PENDING'),
        sa.Column('commit_hash', sa.String(64), nullable=True),
        sa.Column('branch', sa.String(128), nullable=False, server_default='main'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_repo_scan_status', 'scans', ['repository_id', 'status'])

    # 8. Create Findings Table
    op.create_table(
        'findings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('scan_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('scans.id', ondelete='CASCADE'), nullable=False),
        sa.Column('repository_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rule_id', sa.String(255), nullable=False),
        sa.Column('title', sa.String(512), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('severity', sa.Enum('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO', name='severitylevel'), nullable=False, server_default='MEDIUM'),
        sa.Column('status', sa.Enum('OPEN', 'IN_REVIEW', 'RESOLVED', 'FALSE_POSITIVE', 'IGNORED', name='findingstatus'), nullable=False, server_default='OPEN'),
        sa.Column('file_path', sa.String(1024), nullable=False),
        sa.Column('line_number', sa.Integer(), nullable=False),
        sa.Column('cwe_id', sa.String(64), nullable=True),
        sa.Column('cvss_score', sa.Float(), nullable=True),
        sa.Column('extra_metadata', postgresql.JSONB(), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_repo_severity_status', 'findings', ['repository_id', 'severity', 'status'])
    op.create_index('idx_findings_rule_id', 'findings', ['rule_id'])

    # 9. Create Finding History Table
    op.create_table(
        'finding_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('finding_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('findings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('changed_by_user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('previous_status', sa.Enum('OPEN', 'IN_REVIEW', 'RESOLVED', 'FALSE_POSITIVE', 'IGNORED', name='findingstatus'), nullable=False),
        sa.Column('new_status', sa.Enum('OPEN', 'IN_REVIEW', 'RESOLVED', 'FALSE_POSITIVE', 'IGNORED', name='findingstatus'), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_history_finding_id', 'finding_history', ['finding_id'])

    # 10. Create AI Remediations Table
    op.create_table(
        'ai_remediations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('finding_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('findings.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('suggested_fix_diff', sa.Text(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=False, server_default='0.95'),
        sa.Column('prompt_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('completion_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )

    # 11. Create Audit Logs Table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('organizations.id', ondelete='CASCADE'), nullable=True),
        sa.Column('action', sa.String(128), nullable=False),
        sa.Column('resource_type', sa.String(128), nullable=False),
        sa.Column('resource_id', sa.String(255), nullable=True),
        sa.Column('ip_address', sa.String(64), nullable=True),
        sa.Column('user_agent', sa.String(512), nullable=True),
        sa.Column('payload', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_audit_org_action', 'audit_logs', ['organization_id', 'action'])

def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('ai_remediations')
    op.drop_table('finding_history')
    op.drop_table('findings')
    op.drop_table('scans')
    op.drop_table('api_keys')
    op.drop_table('repositories')
    op.drop_table('organization_members')
    op.drop_table('organizations')
    op.drop_table('users')

    op.execute('DROP TYPE IF EXISTS findingstatus')
    op.execute('DROP TYPE IF EXISTS severitylevel')
    op.execute('DROP TYPE IF EXISTS scanstatus')
    op.execute('DROP TYPE IF EXISTS scantype')
    op.execute('DROP TYPE IF EXISTS repoprovider')
    op.execute('DROP TYPE IF EXISTS memberrole')
    op.execute('DROP TYPE IF EXISTS orgtier')
    op.execute('DROP TYPE IF EXISTS userstatus')
    op.execute('DROP TYPE IF EXISTS userrole')
