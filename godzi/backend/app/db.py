import os
import time

from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, create_engine

def build_database_url() -> str:
    postgres_server = os.getenv("POSTGRES_SERVER", "localhost")
    postgres_user = os.getenv("POSTGRES_USER", "app")
    postgres_password = os.getenv("POSTGRES_PASSWORD", "app")
    postgres_db = os.getenv("POSTGRES_DB", "app")
    postgres_port = os.getenv("POSTGRES_PORT", "5432")
    return (
        f"postgresql+psycopg://{postgres_user}:{postgres_password}"
        f"@{postgres_server}:{postgres_port}/{postgres_db}"
    )


database_url = build_database_url()
engine = create_engine(database_url, echo=False)


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


def ensure_user_profile_columns() -> None:
    inspector = inspect(engine)
    if "user" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("user")}
    legacy_columns = []
    if "categories_csv" in existing_columns:
        legacy_columns.append("categories_csv")
    if "tags_csv" in existing_columns:
        legacy_columns.append("tags_csv")

    if legacy_columns:
        with engine.begin() as connection:
            for column_name in legacy_columns:
                connection.execute(text(f'ALTER TABLE "user" DROP COLUMN IF EXISTS {column_name}'))
        inspector = inspect(engine)
        existing_columns = {column["name"] for column in inspector.get_columns("user")}

    missing_columns = []
    if "city" not in existing_columns:
        missing_columns.append('ADD COLUMN city VARCHAR(255)')
    if "about" not in existing_columns:
        missing_columns.append('ADD COLUMN about VARCHAR(1000)')

    if not missing_columns:
        return

    with engine.begin() as connection:
        for statement in missing_columns:
            connection.execute(text(f'ALTER TABLE "user" {statement}'))


def ensure_entity_admin_columns() -> None:
    inspector = inspect(engine)
    if "entity" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("entity")}
    if "is_featured" in existing_columns:
        return

    with engine.begin() as connection:
        connection.execute(text('ALTER TABLE "entity" ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false'))


def get_session():
    with Session(engine) as session:
        yield session
