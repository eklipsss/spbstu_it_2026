from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app import cruds
from app.api.deps import CurrentUser, PaginationDep, SessionDep
from app.models.category import Category, CategoryCreate, CategoryPublic
from app.models.entity import EntityCreate, EntityPublic, EntityUpdate
from app.models.relations import EntityCategory, Like, UserCategory, UserEntity, UserTag, Visit
from app.models.user import Item, User, UserCreate, UserPublic

router = APIRouter()


def require_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Требуются права администратора")
    return current_user


AdminUser = Annotated[User, Depends(require_superuser)]


def validate_category_ids(*, session: Session, category_ids: list[int] | None) -> None:
    for category_id in category_ids or []:
        category = cruds.category.get_one_by_id(session=session, id=category_id)
        if category is None:
            raise HTTPException(status_code=404, detail=f"Category {category_id} not found")


def validate_tag_ids(*, session: Session, tag_ids: list[int] | None) -> None:
    for tag_id in tag_ids or []:
        tag = cruds.tag.get_one_by_id(session=session, id=tag_id)
        if tag is None:
            raise HTTPException(status_code=404, detail=f"Tag {tag_id} not found")


@router.get("/categories", response_model=list[CategoryPublic])
def get_categories(_: AdminUser, session: SessionDep, pagination: PaginationDep) -> list[CategoryPublic]:
    categories = cruds.category.get_list(
        session=session,
        skip=pagination.skip,
        limit=pagination.limit,
        order="asc",
        order_by="category_id",
    )
    return [CategoryPublic.model_validate(category) for category in categories]


@router.post("/categories", response_model=CategoryPublic, status_code=status.HTTP_201_CREATED)
def create_category(category_create: CategoryCreate, _: AdminUser, session: SessionDep) -> CategoryPublic:
    if category_create.parent_id is not None:
        parent = cruds.category.get_one_by_id(session=session, id=category_create.parent_id)
        if parent is None:
            raise HTTPException(status_code=404, detail="Parent category not found")

    category = cruds.category.create(session=session, obj_in=category_create)
    return CategoryPublic.model_validate(category)


@router.delete("/categories/{category_id}")
def delete_category(category_id: int, _: AdminUser, session: SessionDep) -> dict[str, str]:
    category = cruds.category.get_one_by_id(session=session, id=category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    child_categories = session.exec(select(Category).where(Category.parent_id == category_id)).all()
    for child_category in child_categories:
        child_category.parent_id = None
        session.add(child_category)

    for relation_model in (EntityCategory, UserCategory):
        rows = session.exec(select(relation_model).where(relation_model.category_id == category_id)).all()
        for row in rows:
            session.delete(row)

    session.delete(category)
    session.commit()
    return {"message": "Category deleted successfully"}


@router.get("/entities", response_model=list[EntityPublic])
def get_entities(_: AdminUser, session: SessionDep, pagination: PaginationDep) -> list[EntityPublic]:
    entities = cruds.entity.get_list(
        session=session,
        skip=pagination.skip,
        limit=pagination.limit,
        order="desc",
        order_by="entity_id",
    )
    return [EntityPublic.from_model(entity) for entity in entities]


@router.post("/entities", response_model=EntityPublic, status_code=status.HTTP_201_CREATED)
def create_entity(entity_create: EntityCreate, _: AdminUser, session: SessionDep) -> EntityPublic:
    validate_category_ids(session=session, category_ids=entity_create.category_ids)
    validate_tag_ids(session=session, tag_ids=entity_create.tag_ids)

    entity = cruds.entity.create_with_relations(session=session, entity_create=entity_create)
    return EntityPublic.from_model(entity)


@router.put("/entities/{entity_id}", response_model=EntityPublic)
def update_entity(entity_id: int, entity_update: EntityUpdate, _: AdminUser, session: SessionDep) -> EntityPublic:
    entity = cruds.entity.get_one_by_id(session=session, id=entity_id)
    if entity is None:
        raise HTTPException(status_code=404, detail="Entity not found")

    validate_category_ids(session=session, category_ids=entity_update.category_ids)
    validate_tag_ids(session=session, tag_ids=entity_update.tag_ids)

    updated_entity = cruds.entity.update_with_relations(session=session, entity=entity, entity_update=entity_update)
    return EntityPublic.from_model(updated_entity)


@router.delete("/entities/{entity_id}")
def delete_entity(entity_id: int, _: AdminUser, session: SessionDep) -> dict[str, str]:
    cruds.entity.remove_with_relations(session=session, id=entity_id)
    return {"message": "Entity deleted successfully"}


@router.get("/collection", response_model=list[EntityPublic])
def get_collection(_: AdminUser, session: SessionDep, pagination: PaginationDep) -> list[EntityPublic]:
    entities = cruds.entity.get_list(
        session=session,
        filters=[cruds.entity.model.is_featured.is_(True)],
        skip=pagination.skip,
        limit=pagination.limit,
        order="desc",
        order_by="entity_id",
    )
    return [EntityPublic.from_model(entity) for entity in entities]


@router.get("/users", response_model=list[UserPublic])
def get_users(_: AdminUser, session: SessionDep, pagination: PaginationDep) -> list[UserPublic]:
    users = cruds.user.get_list(
        session=session,
        skip=pagination.skip,
        limit=pagination.limit,
        order="desc",
        order_by="user_id",
    )
    return [UserPublic.from_model(user) for user in users]


@router.post("/users", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def create_user(user_create: UserCreate, _: AdminUser, session: SessionDep) -> UserPublic:
    existing_user = cruds.user.get_user_by_email(session=session, email=user_create.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с такой почтой уже существует")

    try:
        user = cruds.user.create_user(session=session, user_create=user_create)
    except IntegrityError as error:
        raise HTTPException(status_code=409, detail="User could not be created") from error

    return UserPublic.from_model(user)


@router.delete("/users/{user_id}")
def delete_user(user_id: int, current_admin: AdminUser, session: SessionDep) -> dict[str, str]:
    if current_admin.user_id == user_id:
        raise HTTPException(status_code=400, detail="Нельзя удалить текущего администратора")

    user = cruds.user.get_one_by_id(session=session, id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    for relation_model in (UserEntity, UserCategory, UserTag, Like, Visit):
        rows = session.exec(select(relation_model).where(relation_model.user_id == user_id)).all()
        for row in rows:
            session.delete(row)

    items = session.exec(select(Item).where(Item.owner_id == user_id)).all()
    for item in items:
        session.delete(item)

    session.delete(user)
    session.commit()
    return {"message": "User deleted successfully"}
