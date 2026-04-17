"""add user profile fields

Revision ID: 5d3d6f1f2a1e
Revises: d0823823f5f0
Create Date: 2026-04-06 18:40:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "5d3d6f1f2a1e"
down_revision = "d0823823f5f0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("user", sa.Column("city", sa.String(length=255), nullable=True))
    op.add_column("user", sa.Column("about", sa.String(length=1000), nullable=True))


def downgrade() -> None:
    op.drop_column("user", "about")
    op.drop_column("user", "city")
