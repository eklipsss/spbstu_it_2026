from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship

from app.models.timestamp import TimeStampModel

if TYPE_CHECKING:
    from app.models.relations import EntityCategory, UserCategory


class CategoryBase(TimeStampModel):
    name: str = Field(unique=True)


class CategoryCreate(CategoryBase):
    parent_id: int | None = Field(foreign_key="category.category_id", nullable=True, default=None)


class Category(CategoryBase, table=True):
    category_id: Optional[int] = Field(default=None, primary_key=True)
    parent_id: Optional[int] = Field(foreign_key="category.category_id", nullable=True, default=None)
    entity_categories: list["EntityCategory"] = Relationship(back_populates="category")
    user_categories: list["UserCategory"] = Relationship(back_populates="category")


class CategoryPublic(CategoryBase):
    category_id: int
    parent_id: int | None = None
