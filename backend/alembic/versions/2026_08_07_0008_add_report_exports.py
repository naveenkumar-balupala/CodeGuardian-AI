"""Add Report Exports table

Revision ID: 2026_08_07_0008
Revises: 2026_08_07_0007
Create Date: 2026-08-07 13:33:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0008'
down_revision: str | None = '2026_08_07_0007'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    op.create_table(
        'report_exports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('repository_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('format', sa.String(16), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('executive_summary', sa.Text(), nullable=False),
        sa.Column('branding_info', postgresql.JSONB(), nullable=False),
        sa.Column('sections', postgresql.JSONB(), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(512), nullable=False),
        sa.Column('file_size_bytes', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('download_url', sa.String(512), nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_report_export_repo_id', 'report_exports', ['repository_id'])

def downgrade() -> None:
    op.drop_table('report_exports')
