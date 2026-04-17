"""drop user preference csv columns

Revision ID: a91c8ef1e3d0
Revises: 8b2e7d9a44b1
Create Date: 2026-04-07 10:45:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "a91c8ef1e3d0"
down_revision = "8b2e7d9a44b1"
branch_labels = None
depends_on = None


def _has_column(table_name: str, column_name: str) -> bool:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    return column_name in {column["name"] for column in inspector.get_columns(table_name)}


def upgrade() -> None:
    if _has_column("user", "tags_csv"):
        op.drop_column("user", "tags_csv")
    if _has_column("user", "categories_csv"):
        op.drop_column("user", "categories_csv")


def downgrade() -> None:
    if not _has_column("user", "categories_csv"):
        op.add_column("user", sa.Column("categories_csv", sa.Text(), nullable=False, server_default=""))
    if not _has_column("user", "tags_csv"):
        op.add_column("user", sa.Column("tags_csv", sa.Text(), nullable=False, server_default=""))
