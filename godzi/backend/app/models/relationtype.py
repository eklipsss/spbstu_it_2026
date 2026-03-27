from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship

from app.models.timestamp import TimeStampModel

if TYPE_CHECKING:
    from app.models.relations import UserEntity


class RelationType(TimeStampModel, table=True):
    relation_type_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    user_entities: list["UserEntity"] = Relationship(back_populates="relation_type")
