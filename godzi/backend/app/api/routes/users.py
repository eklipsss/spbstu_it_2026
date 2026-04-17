from fastapi import APIRouter

from app import cruds
from app.api.deps import CurrentUser, SessionDep
from app.models.user import UserPublic, UserUpdateMe

router = APIRouter()


@router.get("/me", response_model=UserPublic)
def get_me(current_user: CurrentUser) -> UserPublic:
    return UserPublic.from_model(current_user)


@router.put("/me", response_model=UserPublic)
def update_me(user_update: UserUpdateMe, current_user: CurrentUser, session: SessionDep) -> UserPublic:
    updated_user = cruds.user.update_user(
        session=session,
        db_user=current_user,
        user_in=user_update,
    )
    return UserPublic.from_model(updated_user)
