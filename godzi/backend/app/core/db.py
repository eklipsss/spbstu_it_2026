from __future__ import annotations

import logging
import os

from sqlmodel import Session, select

from app.core.content.categories import categories_to_create, categories_to_init
from app.core.content.entities import entities_to_create
from app.core.content.seed_utils import create_or_update_entity_with_relations
from app.core.content.tags import tags_to_create
from app.models.category import Category, CategoryCreate
from app.models.role import Role, RoleCreate
from app.models.tag import Tag, TagCreate

logger = logging.getLogger(__name__)

roles_to_create = (
    RoleCreate(name="authorized_user"),
    RoleCreate(name="unauthorized_user"),
    RoleCreate(name="organisation"),
)


def _get_role_by_name(session: Session, name: str) -> Role | None:
    return session.exec(select(Role).where(Role.name == name)).first()


def _get_tag_by_name(session: Session, name: str) -> Tag | None:
    return session.exec(select(Tag).where(Tag.name == name)).first()


def _get_category_by_name(session: Session, name: str) -> Category | None:
    return session.exec(select(Category).where(Category.name == name)).first()


def _create_role(session: Session, role_in: RoleCreate) -> Role:
    role = Role(**role_in.model_dump())
    session.add(role)
    session.commit()
    session.refresh(role)
    return role


def _create_tag(session: Session, tag_in: TagCreate) -> Tag:
    tag = Tag(**tag_in.model_dump())
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag


def _update_tag(session: Session, tag: Tag, tag_in: TagCreate) -> Tag:
    tag.name = tag_in.name
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag


def _create_category(session: Session, category_in: CategoryCreate) -> Category:
    category = Category(**category_in.model_dump())
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def _update_category(session: Session, category: Category, category_in: CategoryCreate) -> Category:
    category.name = category_in.name
    category.parent_id = category_in.parent_id
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def seed_roles(session: Session) -> None:
    for role in roles_to_create:
        if not _get_role_by_name(session=session, name=role.name):
            _create_role(session=session, role_in=role)


def seed_tags(session: Session) -> None:
    for tag in tags_to_create:
        existing_tag = _get_tag_by_name(session=session, name=tag.name)
        if existing_tag:
            _update_tag(session=session, tag=existing_tag, tag_in=tag)
        else:
            _create_tag(session=session, tag_in=tag)


def seed_categories(session: Session) -> None:
    for category in categories_to_init:
        existing_category = _get_category_by_name(session=session, name=category.name)
        if existing_category:
            _update_category(session=session, category=existing_category, category_in=category)
        else:
            _create_category(session=session, category_in=category)

    for category in categories_to_create:
        existing_category = _get_category_by_name(session=session, name=category.name)
        if existing_category:
            _update_category(session=session, category=existing_category, category_in=category)
        else:
            _create_category(session=session, category_in=category)


def seed_entities(session: Session) -> None:
    for entity in entities_to_create:
        create_or_update_entity_with_relations(session=session, entity_in=entity)


def seed_static_content(session: Session) -> None:
    seed_tags(session=session)
    seed_categories(session=session)
    seed_entities(session=session)


def init_db(
    session: Session,
    *,
    include_roles: bool = True,
    include_static_entities: bool = True,
) -> None:
    if include_roles:
        seed_roles(session=session)

    seed_tags(session=session)
    seed_categories(session=session)

    if include_static_entities:
        seed_entities(session=session)


def should_seed_static_content_on_startup() -> bool:
    value = os.getenv("SEED_STATIC_CONTENT_ON_STARTUP", "").strip().lower()
    return value in {"1", "true", "yes", "on"}
