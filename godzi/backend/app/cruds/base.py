from __future__ import annotations

from typing import Any, Generic, TypeVar

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import exc
from sqlmodel import SQLModel, Session, func, select

ModelType = TypeVar("ModelType", bound=SQLModel)
SchemaType = TypeVar("SchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType]):
    def __init__(self, model: type[ModelType]):
        self.model = model

    def get_one_by_id(
        self,
        *,
        id: int | str,
        session: Session,
        filters: list[Any] | None = None,
    ) -> ModelType | None:
        query = select(self.model).where(self.model.__table__.primary_key.columns[0] == id)
        if filters:
            query = query.where(*filters)
        return session.exec(query).first()

    def get_many_by_ids(
        self,
        *,
        list_ids: list[int | str],
        session: Session,
        filters: list[Any] | None = None,
    ) -> list[ModelType]:
        query = select(self.model).where(self.model.__table__.primary_key.columns[0].in_(list_ids))
        if filters:
            query = query.where(*filters)
        return session.exec(query).all()

    def get_count(self, *, session: Session) -> int:
        query = select(func.count()).select_from(self.model)
        return session.exec(query).one()

    def get_list(
        self,
        *,
        skip: int = 0,
        limit: int = 100,
        query=None,
        filters: list[Any] | None = None,
        order: str | None = None,
        order_by: str | None = None,
        session: Session,
    ) -> list[ModelType]:
        statement = query or select(self.model)
        if filters:
            statement = statement.where(*filters)
        if order_by:
            column = getattr(self.model, order_by)
            statement = statement.order_by(column.asc() if order == "asc" else column.desc())
        statement = statement.offset(skip).limit(limit)
        return session.exec(statement).all()

    def create(
        self,
        *,
        obj_in: Any,
        session: Session,
    ) -> ModelType:
        db_obj = self.model.model_validate(obj_in)  # type: ignore[arg-type]
        try:
            session.add(db_obj)
            session.commit()
        except exc.IntegrityError as error:
            session.rollback()
            raise HTTPException(status_code=409, detail=str(error)) from error
        session.refresh(db_obj)
        return db_obj

    def update(
        self,
        *,
        obj_current: ModelType,
        obj_new: dict[str, Any] | Any,
        session: Session,
    ) -> ModelType:
        update_data = obj_new if isinstance(obj_new, dict) else obj_new.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(obj_current, field, value)

        session.add(obj_current)
        session.commit()
        session.refresh(obj_current)
        return obj_current

    def remove(self, *, id: int | str, session: Session) -> ModelType:
        obj = self.get_one_by_id(id=id, session=session)
        if obj is None:
            raise HTTPException(status_code=404, detail=f"{self.model.__name__} not found")
        session.delete(obj)
        session.commit()
        return obj
