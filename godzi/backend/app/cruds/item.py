from app.cruds.base import CRUDBase
from app.models.user import Item


class CRUDItem(CRUDBase[Item]):
    pass


item = CRUDItem(Item)
