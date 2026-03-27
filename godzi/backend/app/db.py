import os
import time
from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "app.db"
sqlite_url = f"sqlite:///{DB_PATH.as_posix()}"


def build_database_url() -> str:
    postgres_server = os.getenv("POSTGRES_SERVER")

    if postgres_server:
        postgres_user = os.getenv("POSTGRES_USER", "app")
        postgres_password = os.getenv("POSTGRES_PASSWORD", "app")
        postgres_db = os.getenv("POSTGRES_DB", "app")
        postgres_port = os.getenv("POSTGRES_PORT", "5432")
        return (
            f"postgresql+psycopg://{postgres_user}:{postgres_password}"
            f"@{postgres_server}:{postgres_port}/{postgres_db}"
        )

    return sqlite_url


database_url = build_database_url()
engine_kwargs = {"echo": False}

if database_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(database_url, **engine_kwargs)


def create_db_and_tables(retries: int = 10, delay_seconds: int = 2) -> None:
    last_error: Exception | None = None

    for attempt in range(1, retries + 1):
        try:
            SQLModel.metadata.create_all(engine)
            return
        except Exception as error:  # noqa: BLE001
            last_error = error
            if attempt == retries:
                raise
            time.sleep(delay_seconds)

    if last_error is not None:
        raise last_error


def get_session():
    with Session(engine) as session:
        yield session
