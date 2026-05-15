from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from pydantic import BaseModel
from sqlmodel import Session

from app import cruds
from app.core.security import decode_token
from app.db import engine
from app.models.user import User


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]


class Pagination(BaseModel):
    skip: int = 0
    limit: int = 10


def get_pagination_params(pagination: Pagination = Depends()) -> Pagination:
    return pagination


PaginationDep = Annotated[Pagination, Depends(get_pagination_params)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def get_current_user(session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    credentials_exception = HTTPException(status_code=401, detail="Не удалось проверить авторизацию")

    try:
        token_payload = decode_token(token)
    except JWTError as error:
        raise credentials_exception from error

    if token_payload.sub is None:
        raise credentials_exception

    user = cruds.user.get_one_by_id(session=session, id=token_payload.sub)
    if user is None:
        raise credentials_exception

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_optional_current_user(
    session: SessionDep,
    token: Annotated[str | None, Depends(optional_oauth2_scheme)],
) -> User | None:
    if not token:
        return None

    try:
        token_payload = decode_token(token)
    except JWTError:
        return None

    if token_payload.sub is None:
        return None

    return cruds.user.get_one_by_id(session=session, id=token_payload.sub)


OptionalCurrentUser = Annotated[User | None, Depends(get_optional_current_user)]
