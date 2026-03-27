from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import Session

from app.core.db import seed_static_content, should_seed_static_content_on_startup
from app.db import create_db_and_tables
from app.db import engine
from app.models import *  # noqa: F401,F403


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    if should_seed_static_content_on_startup():
        with Session(engine) as session:
            seed_static_content(session=session)
    yield


app = FastAPI(title="Backend API", version="0.1.0", lifespan=lifespan)

@app.get("/homepage")
def home():
    return {"status": "ok"}
