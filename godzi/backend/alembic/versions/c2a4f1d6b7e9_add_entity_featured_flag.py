"""add entity featured flag

Revision ID: c2a4f1d6b7e9
Revises: a91c8ef1e3d0
Create Date: 2026-05-12 12:00:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "c2a4f1d6b7e9"
down_revision = "a91c8ef1e3d0"
branch_labels = None
depends_on = None


def _has_column(table_name: str, column_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return column_name in {column["name"] for column in inspector.get_columns(table_name)}


def upgrade() -> None:
    if not _has_column("entity", "is_featured"):
        op.add_column("entity", sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    if _has_column("entity", "is_featured"):
        op.drop_column("entity", "is_featured")
