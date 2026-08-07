"""Add Repository Analysis table

Revision ID: 2026_08_07_0004
Revises: 2026_08_07_0003
Create Date: 2026-08-07 11:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0004'
down_revision: Union[str, None] = '2026_08_07_0003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'repo_analyses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('repository_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('languages', postgresql.JSONB(), nullable=False),
        sa.Column('frameworks', postgresql.JSONB(), nullable=False),
        sa.Column('architecture_style', sa.String(64), nullable=False, server_default='MONOREPO'),
        sa.Column('databases', postgresql.JSONB(), nullable=False),
        sa.Column('ci_cd_tools', postgresql.JSONB(), nullable=False),
        sa.Column('docker_configs', postgresql.JSONB(), nullable=False),
        sa.Column('package_managers', postgresql.JSONB(), nullable=False),
        sa.Column('has_swagger', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('dependencies', postgresql.JSONB(), nullable=False),
        sa.Column('summary_report', sa.Text(), nullable=False),
        sa.Column('scanned_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_repo_analysis_repo_id', 'repo_analyses', ['repository_id'])

def downgrade() -> None:
    op.drop_table('repo_analyses')
