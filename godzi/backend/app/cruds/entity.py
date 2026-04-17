from __future__ import annotations

from typing import Any

from sqlalchemy import and_
from sqlmodel import Session, func, select

from app.cruds.base import CRUDBase
from app.models.entity import Entity, EntityCreate
from app.models.relations import EntityCategory, EntityTag


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


entity = CRUDEntity(Entity)
