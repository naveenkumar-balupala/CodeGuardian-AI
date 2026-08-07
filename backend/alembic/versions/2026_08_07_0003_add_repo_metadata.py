"""Add repository metadata and processing status fields

Revision ID: 2026_08_07_0003
Revises: 2026_08_07_0002
Create Date: 2026-08-07 11:37:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0003'
down_revision: str | None = '2026_08_07_0002'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    op.add_column('repositories', sa.Column('size_bytes', sa.BigInteger(), nullable=False, server_default='0'))
    op.add_column('repositories', sa.Column('file_count', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('repositories', sa.Column('last_commit_hash', sa.String(64), nullable=True))
    op.add_column('repositories', sa.Column('last_commit_author', sa.String(255), nullable=True))
    op.add_column('repositories', sa.Column('last_commit_message', sa.Text(), nullable=True))

    op.add_column('repositories', sa.Column('processing_status', sa.String(32), nullable=False, server_default='QUEUED'))
    op.add_column('repositories', sa.Column('processing_progress', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('repositories', sa.Column('processing_error', sa.Text(), nullable=True))

    op.create_index('idx_repos_proc_status', 'repositories', ['processing_status'])

def downgrade() -> None:
    op.drop_index('idx_repos_proc_status', 'repositories')

    op.drop_column('repositories', 'processing_error')
    op.drop_column('repositories', 'processing_progress')
    op.drop_column('repositories', 'processing_status')
    op.drop_column('repositories', 'last_commit_message')
    op.drop_column('repositories', 'last_commit_author')
    op.drop_column('repositories', 'last_commit_hash')
    op.drop_column('repositories', 'file_count')
    op.drop_column('repositories', 'size_bytes')
