"""Add Security Agent Report table

Revision ID: 2026_08_07_0006
Revises: 2026_08_07_0005
Create Date: 2026-08-07 13:15:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0006'
down_revision: Union[str, None] = '2026_08_07_0005'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'security_agent_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('repository_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('risk_score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('risk_level', sa.String(32), nullable=False, server_default='LOW'),
        sa.Column('critical_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('high_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('medium_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('low_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('findings', postgresql.JSONB(), nullable=False),
        sa.Column('owasp_distribution', postgresql.JSONB(), nullable=False),
        sa.Column('chart_dataset', postgresql.JSONB(), nullable=False),
        sa.Column('scanned_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_security_agent_repo_id', 'security_agent_reports', ['repository_id'])

def downgrade() -> None:
    op.drop_table('security_agent_reports')
