from fastapi import APIRouter, HTTPException, Query

from app.api.deps import PaginationDep, SessionDep
from app import cruds
from app.models.entity import EntityCreate, EntityPublic, EntityUpdate
from app.models.tag import Tag

router = APIRouter()


@router.post("/", response_model=EntityPublic)
def create_entity(entity_create: EntityCreate, session: SessionDep) -> EntityPublic:
    for category_id in entity_create.category_ids:
        category = cruds.category.get_one_by_id(session=session, id=category_id)
        if category is None:
            raise HTTPException(status_code=404, detail=f"Category {category_id} not found")

    for tag_id in entity_create.tag_ids:
        tag = cruds.tag.get_one_by_id(session=session, id=tag_id)
        if tag is None:
            raise HTTPException(status_code=404, detail=f"Tag {tag_id} not found")

    entity = cruds.entity.create_with_relations(session=session, entity_create=entity_create)
    return EntityPublic.from_model(entity)


@router.put("/update_entity", response_model=EntityPublic)
def update_entity(entity_id: int, entity_update: EntityUpdate, session: SessionDep) -> EntityPublic:
    entity = cruds.entity.get_one_by_id(session=session, id=entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    if entity_update.category_ids is not None:
        for category_id in entity_update.category_ids:
            category = cruds.category.get_one_by_id(session=session, id=category_id)
            if category is None:
                raise HTTPException(status_code=404, detail=f"Category {category_id} not found")

    if entity_update.tag_ids is not None:
        for tag_id in entity_update.tag_ids:
            tag = cruds.tag.get_one_by_id(session=session, id=tag_id)
            if tag is None:
                raise HTTPException(status_code=404, detail=f"Tag {tag_id} not found")

    updated_entity = cruds.entity.update_with_relations(session=session, entity=entity, entity_update=entity_update)
    return EntityPublic.from_model(updated_entity)


@router.delete("/")
def delete_entity(entity_id: int, session: SessionDep) -> dict[str, str]:
    entity = cruds.entity.get_one_by_id(session=session, id=entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    cruds.entity.remove_with_relations(session=session, id=entity_id)
    return {"message": "Entity deleted successfully"}


@router.get("/entity_tags", response_model=list[Tag])
def get_entity_tags(entity_id: int, session: SessionDep) -> list[Tag]:
    entity = cruds.entity.get_one_by_id(session=session, id=entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return [entity_tag.tag for entity_tag in entity.entity_tags]


@router.get("/get_entities", response_model=list[EntityPublic])
def get_entities(
    session: SessionDep,
    pagination: PaginationDep,
    name: str | None = None,
    categories_ids: list[int] | None = Query(default=None),
    tag_ids: list[int] | None = Query(default=None),
) -> list[EntityPublic]:
    entities = cruds.entity.get_by_name_like(
        session=session,
        name=name,
        categories_ids=categories_ids or [],
        tag_ids=tag_ids or [],
        skip=pagination.skip,
        limit=pagination.limit,
    )
    return [EntityPublic.from_model(entity) for entity in entities]


@router.get("/get_recommendations", response_model=list[EntityPublic])
def get_recommendations(session: SessionDep, pagination: PaginationDep) -> list[EntityPublic]:
    place_categories = cruds.category.get_all_children_categories(session=session, category_id=1)
    place_category_ids = [1, *[category.category_id for category in place_categories]]

    entities = cruds.entity.get_by_name_like(
        session=session,
        shuffle=True,
        categories_ids=place_category_ids,
        skip=pagination.skip,
        limit=pagination.limit,
    )
    return [EntityPublic.from_model(entity) for entity in entities]


@router.get("/{entity_id}", response_model=EntityPublic)
def get_entity(entity_id: int, session: SessionDep) -> EntityPublic:
    entity = cruds.entity.get_one_by_id(session=session, id=entity_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return EntityPublic.from_model(entity)
