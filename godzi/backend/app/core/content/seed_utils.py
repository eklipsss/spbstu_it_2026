from __future__ import annotations

from sqlmodel import Session, select

from app.models.entity import Entity, EntityCreate
from app.models.relations import EntityCategory, EntityTag


def get_entity_by_name(session: Session, name: str) -> Entity | None:
    statement = select(Entity).where(Entity.name == name)
    return session.exec(statement).first()


def create_or_update_entity_with_relations(session: Session, entity_in: EntityCreate) -> Entity:
    existing_entity = get_entity_by_name(session=session, name=entity_in.name)
    entity_payload = entity_in.model_dump(exclude={"category_ids", "tag_ids"})

    if existing_entity:
        for field_name, field_value in entity_payload.items():
            setattr(existing_entity, field_name, field_value)
        entity = existing_entity
    else:
        entity = Entity(**entity_payload)
        session.add(entity)
        session.commit()
        session.refresh(entity)

    current_entity_categories = session.exec(
        select(EntityCategory).where(EntityCategory.entity_id == entity.entity_id)
    ).all()
    for item in current_entity_categories:
        session.delete(item)

    current_entity_tags = session.exec(select(EntityTag).where(EntityTag.entity_id == entity.entity_id)).all()
    for item in current_entity_tags:
        session.delete(item)

    session.commit()

    for category_id in entity_in.category_ids:
        session.add(EntityCategory(entity_id=entity.entity_id, category_id=category_id))

    for tag_id in entity_in.tag_ids:
        session.add(EntityTag(entity_id=entity.entity_id, tag_id=tag_id))

    session.commit()
    session.refresh(entity)
    return entity


def set_entity_photo_if_empty(session: Session, entity: Entity, photo_url: str) -> None:
    if entity.photo or not photo_url:
        return

    entity.photo = photo_url
    session.add(entity)
    session.commit()
    session.refresh(entity)
