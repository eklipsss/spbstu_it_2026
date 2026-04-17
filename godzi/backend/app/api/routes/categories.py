from fastapi import APIRouter, HTTPException

from app.api.deps import PaginationDep, SessionDep
from app import cruds
from app.models.category import Category

router = APIRouter()


@router.get("/", response_model=list[Category])
def get_all_categories(session: SessionDep, pagination: PaginationDep) -> list[Category]:
    categories = cruds.category.get_list(skip=pagination.skip, limit=pagination.limit, session=session)
    if not categories:
        raise HTTPException(status_code=404, detail="Categories are empty")
    return categories


@router.get("/child_categories", response_model=list[Category])
def get_child_categories(session: SessionDep, pagination: PaginationDep, category_id: int) -> list[Category]:
    categories = cruds.category.get_list(
        skip=pagination.skip,
        limit=pagination.limit,
        session=session,
        filters=[Category.parent_id == category_id],
    )
    if not categories:
        raise HTTPException(status_code=404, detail="Categories are empty")
    return categories


@router.get("/all_children_categories", response_model=list[Category])
def get_all_children_categories(session: SessionDep, category_id: int) -> list[Category]:
    categories = cruds.category.get_all_children_categories(session=session, category_id=category_id)
    if not categories:
        raise HTTPException(status_code=404, detail="Categories are empty")
    return categories
