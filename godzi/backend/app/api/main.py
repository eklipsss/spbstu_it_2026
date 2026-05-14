from fastapi import APIRouter

from app.api.routes import admin, auth, categories, entities, favorites, tags, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(entities.router, prefix="/entities", tags=["entities"])
api_router.include_router(favorites.router, prefix="/favorites", tags=["favorites"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
