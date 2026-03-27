from enum import Enum
from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models.user import User


class UserRole(Enum):
    ADMIN = "администратор"
    SIMPLE = "обычный пользователь"


class RoleCreate(SQLModel):
    name: str = Field(unique=True)


class Role(RoleCreate, table=True):
    role_id: Optional[int] = Field(default=None, primary_key=True)
    user: list["User"] = Relationship(back_populates="role")


class RolePublic(RoleCreate):
    role_id: Optional[int]
