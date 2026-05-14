from __future__ import annotations

from typing import Any

from sqlalchemy import and_
from sqlmodel import Session, func, select

from app.cruds.base import CRUDBase
from app.models.entity import Entity, EntityCreate, EntityUpdate
from app.models.relations import EntityCategory, EntityTag, Like, UserEntity, Visit


class CRUDEntity(CRUDBase[Entity]):
    def get_by_name_like(
        self,
        *,
        session: Session,
        name: str | None = None,
        filters: list[Any] | None = None,
        skip: int = 0,
        limit: int = 100,
        shuffle: bool = False,
        tag_ids: list[int] | None = None,
        categories_ids: list[int] | None = None,
    ) -> list[Entity]:
        query = select(Entity).distinct()
        all_filters = list(filters or [])

        if tag_ids:
            query = query.join(EntityTag)
            all_filters.append(EntityTag.tag_id.in_(tag_ids))

        if categories_ids:
            query = query.join(EntityCategory)
            all_filters.append(EntityCategory.category_id.in_(categories_ids))

        if name:
            escaped_value = name.replace("_", "/_").replace("%", "/%")
            all_filters.append(func.lower(Entity.name).contains(func.lower(escaped_value), escape="/"))

        if all_filters:
            query = query.where(and_(*all_filters))

        if shuffle:
            query = query.order_by(func.random())

        query = query.offset(skip).limit(limit)
        return session.exec(query).all()

    def create_with_relations(self, *, session: Session, entity_create: EntityCreate) -> Entity:
        from app.core.content.seed_utils import create_or_update_entity_with_relations

        return create_or_update_entity_with_relations(session=session, entity_in=entity_create)

    def update_with_relations(
        self,
        *,
        session: Session,
        entity: Entity,
        entity_update: EntityUpdate,
    ) -> Entity:
        update_data = entity_update.model_dump(exclude_unset=True)
        category_ids = update_data.pop("category_ids", None)
        tag_ids = update_data.pop("tag_ids", None)

        for field_name, field_value in update_data.items():
            setattr(entity, field_name, field_value)

        session.add(entity)
        session.commit()
        session.refresh(entity)

        if category_ids is not None:
            current_entity_categories = session.exec(
                select(EntityCategory).where(EntityCategory.entity_id == entity.entity_id)
            ).all()
            for item in current_entity_categories:
                session.delete(item)
            for category_id in category_ids:
                session.add(EntityCategory(entity_id=entity.entity_id, category_id=category_id))

        if tag_ids is not None:
            current_entity_tags = session.exec(select(EntityTag).where(EntityTag.entity_id == entity.entity_id)).all()
            for item in current_entity_tags:
                session.delete(item)
            for tag_id in tag_ids:
                session.add(EntityTag(entity_id=entity.entity_id, tag_id=tag_id))

        session.commit()
        session.refresh(entity)
        return entity

    def remove_with_relations(self, *, session: Session, id: int) -> Entity:
        entity = self.get_one_by_id(session=session, id=id)
        if entity is None:
            from fastapi import HTTPException

            raise HTTPException(status_code=404, detail="Entity not found")

        for relation_model in (EntityCategory, EntityTag, UserEntity, Like, Visit):
            rows = session.exec(select(relation_model).where(relation_model.entity_id == id)).all()
            for row in rows:
                session.delete(row)

        session.delete(entity)
        session.commit()
        return entity


entity = CRUDEntity(Entity)
