from fastapi import APIRouter, HTTPException

from app import cruds
from app.api.deps import PaginationDep, SessionDep
from app.models.tag import Tag

router = APIRouter()


@router.get("/", response_model=list[Tag])
def get_all_tags(session: SessionDep, pagination: PaginationDep) -> list[Tag]:
    tags = cruds.tag.get_list(skip=pagination.skip, limit=pagination.limit, session=session)
    if not tags:
        raise HTTPException(status_code=404, detail="Tags are empty")
    return tags
