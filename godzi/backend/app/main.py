from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session

from app import cruds
from app.api.main import api_router
from app.api.deps import OptionalCurrentUser, SessionDep
from app.core.db import (
    seed_relation_types,
    seed_roles,
    seed_static_content,
    seed_superuser,
    should_seed_static_content_on_startup,
)
from app.db import create_db_and_tables, ensure_user_profile_columns
from app.db import ensure_entity_admin_columns
from app.db import engine
from app.models import *  # noqa: F401,F403
from app.models.category import Category
from app.models.entity import EntityPublic


def run_startup_tasks() -> None:
    create_db_and_tables()
    ensure_user_profile_columns()
    ensure_entity_admin_columns()
    with Session(engine) as session:
        seed_roles(session=session)
        seed_relation_types(session=session)
        seed_superuser(session=session)
        if should_seed_static_content_on_startup():
            seed_static_content(session=session)


app = FastAPI(title="Backend API", version="0.1.0")


@app.on_event("startup")
def startup() -> None:
    run_startup_tasks()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


class HomepageResponse(BaseModel):
    categories: list[Category]
    recommendations: list[EntityPublic]
    favorite_entity_ids: list[int]


@app.get("/homepage")
def home(session: SessionDep, current_user: OptionalCurrentUser) -> HomepageResponse:
    categories = cruds.category.get_list(
        session=session,
        skip=0,
        limit=500,
        order="asc",
        order_by="category_id",
    )

    place_categories = cruds.category.get_all_children_categories(session=session, category_id=1)
    place_category_ids = [1, *[category.category_id for category in place_categories]]
    recommendations = [
        EntityPublic.from_model(entity)
        for entity in cruds.entity.get_by_name_like(
            session=session,
            categories_ids=place_category_ids,
            shuffle=True,
            skip=0,
            limit=10,
        )
    ]

    favorite_entity_ids = []
    if current_user is not None:
        favorite_entity_ids = cruds.user_entity.list_favorite_entity_ids(
            session=session,
            user_id=current_user.user_id,
        )

    return HomepageResponse(
        categories=categories,
        recommendations=recommendations,
        favorite_entity_ids=favorite_entity_ids,
    )
