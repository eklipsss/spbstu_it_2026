"""add user category and user tag tables

Revision ID: 8b2e7d9a44b1
Revises: 5d3d6f1f2a1e
Create Date: 2026-04-06 19:15:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "8b2e7d9a44b1"
down_revision = "5d3d6f1f2a1e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "usercategory",
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=True),
        sa.Column("user_category_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.user_id"]),
        sa.ForeignKeyConstraint(["category_id"], ["category.category_id"]),
        sa.PrimaryKeyConstraint("user_category_id"),
        sa.UniqueConstraint("user_id", "category_id", name="pair_user_category"),
    )
    op.create_table(
        "usertag",
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=True),
        sa.Column("user_tag_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("tag_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.user_id"]),
        sa.ForeignKeyConstraint(["tag_id"], ["tag.tag_id"]),
        sa.PrimaryKeyConstraint("user_tag_id"),
        sa.UniqueConstraint("user_id", "tag_id", name="pair_user_tag"),
    )


def downgrade() -> None:
    op.drop_table("usertag")
    op.drop_table("usercategory")
