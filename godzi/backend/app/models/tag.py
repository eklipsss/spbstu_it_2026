from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship

from app.models.timestamp import TimeStampModel

if TYPE_CHECKING:
    from app.models.relations import EntityTag, UserTag


class TagCreate(TimeStampModel):
    name: str = Field(unique=True)


class Tag(TagCreate, table=True):
    tag_id: Optional[int] = Field(default=None, primary_key=True)
    entity_tags: list["EntityTag"] = Relationship(back_populates="tag")
    user_tags: list["UserTag"] = Relationship(back_populates="tag")


class TagPublic(TagCreate):
    tag_id: int
