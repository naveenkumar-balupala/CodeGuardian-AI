"""Add Code Review table

Revision ID: 2026_08_07_0005
Revises: 2026_08_07_0004
Create Date: 2026-08-07 11:53:30.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0005'
down_revision: str | None = '2026_08_07_0004'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    op.create_table(
        'code_reviews',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('repository_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('overall_score', sa.Integer(), nullable=False, server_default='100'),
        sa.Column('grade', sa.String(10), nullable=False, server_default='A+'),
        sa.Column('cyclomatic_complexity', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('maintainability_index', sa.Float(), nullable=False, server_default='100.0'),
        sa.Column('dead_code_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('naming_violations_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('code_smells_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('issues', postgresql.JSONB(), nullable=False),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_code_review_repo_id', 'code_reviews', ['repository_id'])

def downgrade() -> None:
    op.drop_table('code_reviews')
