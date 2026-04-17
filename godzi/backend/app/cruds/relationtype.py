from app.cruds.base import CRUDBase
from app.models.relationtype import RelationType


class CRUDRelationType(CRUDBase[RelationType]):
    pass


relationtype = CRUDRelationType(RelationType)
