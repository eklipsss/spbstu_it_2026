from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.api.main import api_router
from app.core.db import (
    seed_relation_types,
    seed_roles,
    seed_static_content,
    seed_superuser,
    should_seed_static_content_on_startup,
)
from app.db import create_db_and_tables, ensure_user_profile_columns
from app.db import engine
from app.models import *  # noqa: F401,F403


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    ensure_user_profile_columns()
    with Session(engine) as session:
        seed_roles(session=session)
        seed_relation_types(session=session)
        seed_superuser(session=session)
        if should_seed_static_content_on_startup():
            seed_static_content(session=session)
    yield


app = FastAPI(title="Backend API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/homepage")
def home():
    return {"status": "ok"}
