from __future__ import annotations

from sqlmodel import Session, select

from app.models.entity import Entity, EntityCreate
from app.models.relations import EntityCategory, EntityTag


CAFE_CATEGORY_IDS = {
    3, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 80, 81, 82,
}
BAR_CATEGORY_IDS = {4, 28, 29, 67, 68, 69, 70, 71, 72}
MUSEUM_CATEGORY_IDS = {5, 30, 31, 32, 33, 34, 35}
ENTERTAINMENT_CATEGORY_IDS = {7, 8, 9, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52}
PARK_CATEGORY_IDS = {6, 36, 37}
CONCERT_CATEGORY_IDS = {11}
FESTIVAL_CATEGORY_IDS = {10, 12, 53, 54, 55, 56, 73, 74, 75, 76, 77, 78, 79}


def get_category_photo_key(category_ids: list[int]) -> str:
    category_id_set = set(category_ids)

    if category_id_set & CAFE_CATEGORY_IDS:
        return "cafe"
    if category_id_set & BAR_CATEGORY_IDS:
        return "bar"
    if category_id_set & MUSEUM_CATEGORY_IDS:
        return "museum"
    if category_id_set & ENTERTAINMENT_CATEGORY_IDS:
        return "museum2"
    if category_id_set & PARK_CATEGORY_IDS:
        return "park"
    if category_id_set & CONCERT_CATEGORY_IDS:
        return "concert"
    if category_id_set & FESTIVAL_CATEGORY_IDS:
        return "festival"
    return ""


def get_entity_by_name(session: Session, name: str) -> Entity | None:
    statement = select(Entity).where(Entity.name == name)
    return session.exec(statement).first()


def create_or_update_entity_with_relations(session: Session, entity_in: EntityCreate) -> Entity:
    existing_entity = get_entity_by_name(session=session, name=entity_in.name)
    entity_payload = entity_in.model_dump(exclude={"category_ids", "tag_ids"})
    if not entity_payload.get("photo"):
        entity_payload["photo"] = get_category_photo_key(entity_in.category_ids)

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
