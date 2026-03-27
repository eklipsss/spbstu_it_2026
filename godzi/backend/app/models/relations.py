from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint

from app.models.timestamp import TimeStampModel

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.entity import Entity
    from app.models.relationtype import RelationType
    from app.models.tag import Tag
    from app.models.user import User


class EntityCategoryCreate(SQLModel):
    entity_id: int = Field(foreign_key="entity.entity_id")
    category_id: int = Field(foreign_key="category.category_id")


class EntityCategoryPublic(TimeStampModel, EntityCategoryCreate):
    entity_category_id: Optional[int]


class EntityCategory(TimeStampModel, table=True):
    __table_args__ = (UniqueConstraint("entity_id", "category_id", name="pair_entity_category"),)

    entity_category_id: Optional[int] = Field(default=None, primary_key=True)
    entity_id: int = Field(foreign_key="entity.entity_id")
    entity: "Entity" = Relationship(back_populates="entity_categories")
    category_id: int = Field(foreign_key="category.category_id")
    category: "Category" = Relationship(back_populates="entity_categories")


class UserEntityCreate(SQLModel):
    user_id: int = Field(foreign_key="user.user_id")
    entity_id: int = Field(foreign_key="entity.entity_id")
    relation_type_id: int = Field(foreign_key="relationtype.relation_type_id")


class UserEntityPublic(UserEntityCreate, TimeStampModel):
    user_entity_id: Optional[int]


class UserEntity(TimeStampModel, table=True):
    __table_args__ = (UniqueConstraint("user_id", "entity_id", name="pair_user_entity"),)

    user_entity_id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.user_id")
    entity_id: int = Field(foreign_key="entity.entity_id")
    relation_type_id: int = Field(foreign_key="relationtype.relation_type_id")
    user: "User" = Relationship(back_populates="user_entities")
    entity: "Entity" = Relationship(back_populates="user_entities")
    relation_type: "RelationType" = Relationship(back_populates="user_entities")


class EntityTagCreate(SQLModel):
    entity_id: int = Field(foreign_key="entity.entity_id")
    tag_id: int = Field(foreign_key="tag.tag_id")


class EntityTagWithDates(EntityTagCreate, TimeStampModel):
    pass


class EntityTag(EntityTagWithDates, table=True):
    __table_args__ = (UniqueConstraint("entity_id", "tag_id", name="pair_entity_tag"),)

    entity_tag_id: int | None = Field(default=None, primary_key=True)
    entity_id: int = Field(foreign_key="entity.entity_id")
    entity: "Entity" = Relationship(back_populates="entity_tags")
    tag_id: int = Field(foreign_key="tag.tag_id")
    tag: "Tag" = Relationship(back_populates="entity_tags")


class RelationCreate(TimeStampModel):
    entity_id: int = Field(foreign_key="entity.entity_id")
    user_id: int = Field(foreign_key="user.user_id")


class Like(RelationCreate, table=True):
    __table_args__ = (UniqueConstraint("entity_id", "user_id", name="pair_user_place"),)

    like_id: int | None = Field(default=None, primary_key=True)
    entity: "Entity" = Relationship(back_populates="like")
    user: "User" = Relationship(back_populates="like")


class LikePublic(RelationCreate):
    like_id: int


class LikesPublic(RelationCreate):
    data: list[LikePublic]
    count: int


class Visit(RelationCreate, table=True):
    __table_args__ = (UniqueConstraint("entity_id", "user_id", name="pair_user_event"),)

    visit_id: int | None = Field(default=None, primary_key=True)
    entity: "Entity" = Relationship(back_populates="visit")
    user: "User" = Relationship(back_populates="visit")


class VisitPublic(RelationCreate):
    visit_id: int


class VisitsPublic(RelationCreate):
    data: list[VisitPublic]
    count: int
