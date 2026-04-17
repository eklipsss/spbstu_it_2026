from sqlmodel import Session, select

from app.cruds.base import CRUDBase
from app.models.entity import Entity
from app.models.relations import EntityCategory, EntityTag, UserEntity
from app.models.relationtype import RelationType


class CRUDEntityCategory(CRUDBase[EntityCategory]):
    def get_entities_by_categories(self, *, session: Session, category_ids: list[int]) -> list[EntityCategory]:
        return session.exec(select(EntityCategory).where(EntityCategory.category_id.in_(category_ids))).all()


class CRUDUserEntity(CRUDBase[UserEntity]):
    favorite_relation_name = "favorite"

    def get_relation_type_by_name(self, *, session: Session, name: str) -> RelationType | None:
        return session.exec(select(RelationType).where(RelationType.name == name)).first()

    def get_or_create_favorite_relation_type(self, *, session: Session) -> RelationType:
        relation_type = self.get_relation_type_by_name(session=session, name=self.favorite_relation_name)
        if relation_type is not None:
            return relation_type

        relation_type = RelationType(name=self.favorite_relation_name)
        session.add(relation_type)
        session.commit()
        session.refresh(relation_type)
        return relation_type

    def get_favorite_link(self, *, session: Session, user_id: int, entity_id: int) -> UserEntity | None:
        return session.exec(
            select(UserEntity)
            .join(RelationType, RelationType.relation_type_id == UserEntity.relation_type_id)
            .where(
                UserEntity.user_id == user_id,
                UserEntity.entity_id == entity_id,
                RelationType.name == self.favorite_relation_name,
            ),
        ).first()

    def list_favorite_entity_ids(self, *, session: Session, user_id: int) -> list[int]:
        rows = session.exec(
            select(UserEntity.entity_id)
            .join(RelationType, RelationType.relation_type_id == UserEntity.relation_type_id)
            .where(
                UserEntity.user_id == user_id,
                RelationType.name == self.favorite_relation_name,
            ),
        ).all()
        return list(rows)

    def list_favorite_entities(
        self,
        *,
        session: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Entity]:
        return session.exec(
            select(Entity)
            .distinct()
            .join(UserEntity, UserEntity.entity_id == Entity.entity_id)
            .join(RelationType, RelationType.relation_type_id == UserEntity.relation_type_id)
            .where(
                UserEntity.user_id == user_id,
                RelationType.name == self.favorite_relation_name,
            )
            .offset(skip)
            .limit(limit),
        ).all()

    def add_favorite(self, *, session: Session, user_id: int, entity_id: int) -> UserEntity:
        favorite = self.get_favorite_link(session=session, user_id=user_id, entity_id=entity_id)
        if favorite is not None:
            return favorite

        relation_type = self.get_or_create_favorite_relation_type(session=session)
        favorite = UserEntity(
            user_id=user_id,
            entity_id=entity_id,
            relation_type_id=relation_type.relation_type_id,
        )
        session.add(favorite)
        session.commit()
        session.refresh(favorite)
        return favorite

    def remove_favorite(self, *, session: Session, user_id: int, entity_id: int) -> bool:
        favorite = self.get_favorite_link(session=session, user_id=user_id, entity_id=entity_id)
        if favorite is None:
            return False

        session.delete(favorite)
        session.commit()
        return True


class CRUDEntityTag(CRUDBase[EntityTag]):
    def get_entities_by_tags(self, *, session: Session, tag_ids: list[int]) -> list[EntityTag]:
        return session.exec(select(EntityTag).where(EntityTag.tag_id.in_(tag_ids))).all()


entity_category = CRUDEntityCategory(EntityCategory)
user_entity = CRUDUserEntity(UserEntity)
entity_tag = CRUDEntityTag(EntityTag)
