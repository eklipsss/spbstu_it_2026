from typing import Optional

from sqlmodel import Session, select

from app.cruds.base import CRUDBase
from app.models.category import Category


class CRUDCategory(CRUDBase[Category]):
    def get_by_name(self, *, session: Session, name: str) -> Optional[Category]:
        return session.exec(select(Category).where(Category.name == name)).first()

    def get_all_children_categories(self, *, session: Session, category_id: int) -> list[Category]:
        result = session.exec(select(Category).where(Category.parent_id == category_id)).all()
        output = list(result)
        for category in result:
            output.extend(self.get_all_children_categories(session=session, category_id=category.category_id))
        return output


category = CRUDCategory(Category)
