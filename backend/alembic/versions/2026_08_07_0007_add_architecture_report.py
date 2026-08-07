"""Add Architecture Report table

Revision ID: 2026_08_07_0007
Revises: 2026_08_07_0006
Create Date: 2026-08-07 13:23:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0007'
down_revision: str | None = '2026_08_07_0006'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    op.create_table(
        'architecture_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('repository_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('pattern', sa.String(64), nullable=False, server_default='MONOREPO'),
        sa.Column('coupling_score', sa.Float(), nullable=False, server_default='1.5'),
        sa.Column('solid_score', sa.Integer(), nullable=False, server_default='95'),
        sa.Column('dry_score', sa.Integer(), nullable=False, server_default='90'),
        sa.Column('kiss_score', sa.Integer(), nullable=False, server_default='92'),
        sa.Column('detected_patterns', postgresql.JSONB(), nullable=False),
        sa.Column('solid_violations', postgresql.JSONB(), nullable=False),
        sa.Column('dry_violations', postgresql.JSONB(), nullable=False),
        sa.Column('kiss_violations', postgresql.JSONB(), nullable=False),
        sa.Column('module_coupling', postgresql.JSONB(), nullable=False),
        sa.Column('mermaid_diagram', sa.Text(), nullable=False),
        sa.Column('ai_recommendations', postgresql.JSONB(), nullable=False),
        sa.Column('scanned_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_arch_report_repo_id', 'architecture_reports', ['repository_id'])

def downgrade() -> None:
    op.drop_table('architecture_reports')
