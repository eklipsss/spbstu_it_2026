from __future__ import annotations

import hashlib

from sqlmodel import Session, select

from app.cruds.base import CRUDBase
from app.models.category import Category
from app.models.relations import UserCategory, UserTag
from app.models.tag import Tag
from app.models.user import User, UserCreate, UserUpdate


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _verify_password(password: str, hashed_password: str) -> bool:
    return _hash_password(password) == hashed_password


def _normalize_names(items: list[str] | None) -> list[str]:
    return [item.strip() for item in (items or []) if item and item.strip()]


def _get_categories_by_names(*, session: Session, names: list[str]) -> list[Category]:
    if not names:
        return []
    return session.exec(select(Category).where(Category.name.in_(names))).all()


def _get_tags_by_names(*, session: Session, names: list[str]) -> list[Tag]:
    if not names:
        return []
    return session.exec(select(Tag).where(Tag.name.in_(names))).all()


def _sync_user_preferences(
    *,
    session: Session,
    user: User,
    category_names: list[str] | None = None,
    tag_names: list[str] | None = None,
) -> None:
    if category_names is not None:
        selected_categories = _get_categories_by_names(session=session, names=_normalize_names(category_names))
        selected_category_ids = {category.category_id for category in selected_categories}
        current_category_links = session.exec(
            select(UserCategory).where(UserCategory.user_id == user.user_id),
        ).all()
        current_category_ids = {item.category_id for item in current_category_links}

        for item in current_category_links:
            if item.category_id not in selected_category_ids:
                session.delete(item)

        for category_id in selected_category_ids - current_category_ids:
            session.add(UserCategory(user_id=user.user_id, category_id=category_id))

    if tag_names is not None:
        selected_tags = _get_tags_by_names(session=session, names=_normalize_names(tag_names))
        selected_tag_ids = {tag.tag_id for tag in selected_tags}
        current_tag_links = session.exec(
            select(UserTag).where(UserTag.user_id == user.user_id),
        ).all()
        current_tag_ids = {item.tag_id for item in current_tag_links}

        for item in current_tag_links:
            if item.tag_id not in selected_tag_ids:
                session.delete(item)

        for tag_id in selected_tag_ids - current_tag_ids:
            session.add(UserTag(user_id=user.user_id, tag_id=tag_id))

    session.commit()
    session.refresh(user)


class CRUDUser(CRUDBase[User]):
    def authenticate(self, *, session: Session, email: str, password: str) -> User | None:
        db_user = self.get_user_by_email(session=session, email=email)
        if not db_user:
            return None
        if not _verify_password(password, db_user.hashed_password):
            return None
        return db_user

    def create_user(self, *, session: Session, user_create: UserCreate) -> User:
        db_obj = User.model_validate(
            user_create,
            update={
                "hashed_password": _hash_password(user_create.password),
            },
        )
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        _sync_user_preferences(
            session=session,
            user=db_obj,
            category_names=user_create.categories,
            tag_names=user_create.tags,
        )
        return db_obj

    def update_user(self, *, session: Session, db_user: User, user_in: UserUpdate) -> User:
        update_data = user_in.model_dump(exclude_unset=True)
        categories = update_data.pop("categories", None) if "categories" in update_data else None
        tags = update_data.pop("tags", None) if "tags" in update_data else None
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = _hash_password(update_data.pop("password"))
        updated_user = self.update(session=session, obj_current=db_user, obj_new=update_data)
        if categories is not None or tags is not None:
            _sync_user_preferences(
                session=session,
                user=updated_user,
                category_names=categories,
                tag_names=tags,
            )
        return updated_user

    def get_user_by_email(self, *, session: Session, email: str) -> User | None:
        return session.exec(select(User).where(User.email == email)).first()


user = CRUDUser(User)
