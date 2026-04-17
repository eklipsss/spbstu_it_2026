from pydantic import EmailStr
from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel

from app import cruds
from app.api.deps import SessionDep
from app.core.security import create_access_token
from app.models.user import Token, UserCreate, UserPublic

router = APIRouter()


class LoginRequest(SQLModel):
    email: EmailStr
    password: str


@router.post("/register", response_model=Token)
def register(user_create: UserCreate, session: SessionDep) -> Token:
    existing_user = cruds.user.get_user_by_email(session=session, email=user_create.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с такой почтой уже существует")

    role = cruds.role.get_by_name(session=session, name="authorized_user")
    db_user = cruds.user.create_user(session=session, user_create=user_create)

    if role is not None:
        db_user.role_id = role.role_id
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

    return Token(
        access_token=create_access_token(db_user.user_id),
        user=UserPublic.from_model(db_user),
    )


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, session: SessionDep) -> Token:
    user = cruds.user.authenticate(
        session=session,
        email=login_data.email,
        password=login_data.password,
    )
    if not user:
        raise HTTPException(status_code=400, detail="Неверная почта или пароль")

    return Token(
        access_token=create_access_token(user.user_id),
        user=UserPublic.from_model(user),
    )
