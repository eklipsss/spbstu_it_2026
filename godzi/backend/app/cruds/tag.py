from typing import Optional

from sqlmodel import Session, select

from app.cruds.base import CRUDBase
from app.models.tag import Tag


class CRUDTag(CRUDBase[Tag]):
    def get_by_name(self, *, session: Session, name: str) -> Optional[Tag]:
        return session.exec(select(Tag).where(Tag.name == name)).first()


tag = CRUDTag(Tag)
