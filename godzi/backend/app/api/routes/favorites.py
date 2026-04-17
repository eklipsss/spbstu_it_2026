from fastapi import APIRouter, HTTPException, status

from app import cruds
from app.api.deps import CurrentUser, PaginationDep, SessionDep
from app.models.entity import EntityPublic

router = APIRouter()


@router.get("/ids", response_model=list[int])
def get_favorite_entity_ids(session: SessionDep, current_user: CurrentUser) -> list[int]:
    return cruds.user_entity.list_favorite_entity_ids(session=session, user_id=current_user.user_id)


@router.get("/", response_model=list[EntityPublic])
def get_favorites(session: SessionDep, current_user: CurrentUser, pagination: PaginationDep) -> list[EntityPublic]:
    entities = cruds.user_entity.list_favorite_entities(
        session=session,
        user_id=current_user.user_id,
        skip=pagination.skip,
        limit=pagination.limit,
    )
    return [EntityPublic.from_model(entity) for entity in entities]


@router.post("/{entity_id}", status_code=status.HTTP_201_CREATED)
def add_to_favorites(entity_id: int, session: SessionDep, current_user: CurrentUser) -> dict[str, int | bool]:
    entity = cruds.entity.get_one_by_id(session=session, id=entity_id)
    if entity is None:
        raise HTTPException(status_code=404, detail="Entity not found")

    cruds.user_entity.add_favorite(session=session, user_id=current_user.user_id, entity_id=entity_id)
    return {"entity_id": entity_id, "is_favorite": True}


@router.delete("/{entity_id}")
def remove_from_favorites(entity_id: int, session: SessionDep, current_user: CurrentUser) -> dict[str, int | bool]:
    removed = cruds.user_entity.remove_favorite(
        session=session,
        user_id=current_user.user_id,
        entity_id=entity_id,
    )
    if not removed:
        raise HTTPException(status_code=404, detail="Favorite not found")

    return {"entity_id": entity_id, "is_favorite": False}
