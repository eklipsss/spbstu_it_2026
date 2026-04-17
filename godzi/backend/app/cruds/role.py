from typing import Optional

from sqlmodel import Session, select

from app.cruds.base import CRUDBase
from app.models.role import Role


class CRUDRole(CRUDBase[Role]):
    def get_by_name(self, *, session: Session, name: str) -> Optional[Role]:
        return session.exec(select(Role).where(Role.name == name)).first()


role = CRUDRole(Role)
