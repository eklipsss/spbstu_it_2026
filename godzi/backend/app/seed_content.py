from __future__ import annotations

import logging

from sqlmodel import Session

from app.core.db import seed_static_content
from app.db import create_db_and_tables, engine
from app.models import *  # noqa: F401,F403

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("Creating database tables if needed")
    create_db_and_tables()

    logger.info("Seeding categories, tags and entities")
    with Session(engine) as session:
        seed_static_content(session=session)

    logger.info("Content seeding completed")


if __name__ == "__main__":
    main()
