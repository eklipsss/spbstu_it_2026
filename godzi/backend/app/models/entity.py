from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.models.timestamp import TimeStampModel

if TYPE_CHECKING:
    from app.models.relations import EntityCategory, EntityTag, Like, UserEntity, Visit


class EntityBase(SQLModel):
    name: str
    contributors: str
    address: str
    metro: str
    description: str
    links: str
    contacts: str
    photo: str
    cost: Optional[str] = None
    average_cost: Optional[str] = None
    age_gap: Optional[str] = None
    date: Optional[str] = None
    is_featured: bool = False


class EntityBaseWithDates(TimeStampModel, EntityBase):
    pass


class EntityCreate(EntityBase):
    category_ids: list[int]
    tag_ids: list[int]


class EntityUpdate(EntityBase):
    name: str | None = None
    contributors: str | None = None
    address: str | None = None
    metro: str | None = None
    description: str | None = None
    links: str | None = None
    contacts: str | None = None
    photo: str | None = None
    cost: str | None = None
    average_cost: str | None = None
    age_gap: str | None = None
    date: str | None = None
    is_featured: bool | None = None
    category_ids: list[int] | None = None
    tag_ids: list[int] | None = None


class EntityPublic(EntityBase):
    entity_id: int
    tags_ids: list[int] = Field(default_factory=list)
    categories_ids: list[int] = Field(default_factory=list)

    @classmethod
    def from_model(cls, entity: "Entity") -> "EntityPublic":
        return cls(
            **entity.model_dump(),
            categories_ids=[category.category_id for category in entity.entity_categories],
            tags_ids=[tag.tag_id for tag in entity.entity_tags],
        )


class Entity(EntityBaseWithDates, table=True):
    entity_id: Optional[int] = Field(default=None, primary_key=True)
    entity_tags: list["EntityTag"] = Relationship(back_populates="entity")
    user_entities: list["UserEntity"] = Relationship(back_populates="entity")
    entity_categories: list["EntityCategory"] = Relationship(back_populates="entity")
    like: list["Like"] = Relationship(back_populates="entity")
    visit: list["Visit"] = Relationship(back_populates="entity")
