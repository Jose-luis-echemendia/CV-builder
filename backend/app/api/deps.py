from collections.abc import Generator
from typing import Annotated, AsyncGenerator

from fastapi import Depends, Header, HTTPException, status

from sqlmodel import Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker

from uuid import UUID

from app.core.db import engine, a_engine

# ========================================================================
#     --- DEPENDENCIAS PARA OBTENER LA SESSION DE LA BD ---
# ========================================================================

# --- DEPENDENCIAS PARA ASYNC SESSION ---

AsyncSessionLocal = async_sessionmaker(
    bind=a_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def a_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


AsyncSessionDep = Annotated[AsyncSession, Depends(a_get_db)]


# --- DEPENDENCIAS PARA SYNC SESSION ---


def get_db() -> Generator[Session, None, None]:
    """Dependency para obtener sesión de base de datos."""
    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()


SessionDep = Annotated[Session, Depends(get_db)]


# ========================================================================
#     --- DEPENDENCIAS PARA OBTENER EL USUARIO ---
# ========================================================================

async def get_user_id(
    x_user_id: str = Header(..., alias="X-User-Id"),
) -> UUID:
    """
    El microservicio de auth valida el JWT y reenvía el user_id
    como header interno. Este backend sólo lo lee y confía.
    """
    try:
        return UUID(x_user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-User-Id header must be a valid UUID.",
        )


# ========================================================================
#     --- DEPENDENCIAS PARA LOS REPOSITORIOS ---
# ========================================================================


# ========================================================================
#     --- DEPENDENCIAS PARA LA GESTIÓN DE VARIABLES DE CONFIGURACIÓN ---
# ========================================================================

from app.services.settings import SettingsService


def get_settings_service(session: AsyncSession = Depends(a_get_db)) -> SettingsService:
    return SettingsService(session=session)


SettingsServiceDep = Annotated[SettingsService, Depends(get_settings_service)]
