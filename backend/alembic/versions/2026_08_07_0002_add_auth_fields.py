"""Add Auth, OAuth, Lockout, and RefreshToken fields

Revision ID: 2026_08_07_0002
Revises: 2026_08_07_0001
Create Date: 2026-08-07 11:32:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2026_08_07_0002'
down_revision: Union[str, None] = '2026_08_07_0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Add Auth & Security columns to Users table
    op.add_column('users', sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('verification_token', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('reset_token', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('reset_token_expires_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('failed_login_attempts', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('locked_until', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('totp_secret', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('is_totp_enabled', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('oauth_provider', sa.String(64), nullable=True))
    op.add_column('users', sa.Column('oauth_id', sa.String(255), nullable=True))

    op.create_index('idx_users_verification_token', 'users', ['verification_token'])
    op.create_index('idx_users_reset_token', 'users', ['reset_token'])
    op.create_index('idx_users_oauth_id', 'users', ['oauth_id'])

    # 2. Create Refresh Tokens Table
    op.create_table(
        'refresh_tokens',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token_hash', sa.String(255), nullable=False, unique=True),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('is_revoked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('idx_refresh_tokens_user', 'refresh_tokens', ['user_id'])
    op.create_index('idx_refresh_tokens_hash', 'refresh_tokens', ['token_hash'])

def downgrade() -> None:
    op.drop_table('refresh_tokens')
    op.drop_index('idx_users_oauth_id', 'users')
    op.drop_index('idx_users_reset_token', 'users')
    op.drop_index('idx_users_verification_token', 'users')

    op.drop_column('users', 'oauth_id')
    op.drop_column('users', 'oauth_provider')
    op.drop_column('users', 'is_totp_enabled')
    op.drop_column('users', 'totp_secret')
    op.drop_column('users', 'locked_until')
    op.drop_column('users', 'failed_login_attempts')
    op.drop_column('users', 'reset_token_expires_at')
    op.drop_column('users', 'reset_token')
    op.drop_column('users', 'verification_token')
    op.drop_column('users', 'is_verified')
