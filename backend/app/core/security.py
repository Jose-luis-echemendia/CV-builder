"""
app/core/security.py

Utilidades de seguridad: autenticación por API key para endpoints
de producción y administración.

Uso:
    from app.core.security import require_api_key, require_admin_key

    router = APIRouter(dependencies=[Depends(require_api_key)])
"""

import secrets
from typing import Optional

from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

from app.core.config import settings

# ── Constante de algoritmo JWT (usada por middlewares) ────────────────────────
ALGORITHM = "HS256"

# ── Esquemas de seguridad (FastAPI Security) ──────────────────────────────────
_api_key_header = APIKeyHeader(
    name="X-API-Key",
    description="API key requerida para acceder a los endpoints.",
    auto_error=False,
)

_admin_key_header = APIKeyHeader(
    name="X-Admin-Key",
    description="API key administrativa requerida para endpoints de administración.",
    auto_error=False,
)


# ── Dependencies FastAPI ──────────────────────────────────────────────────────


async def require_api_key(
    api_key: Optional[str] = Security(_api_key_header),
) -> str:
    """
    Dependency: valida el header ``X-API-Key`` contra ``settings.SECRET_KEY``.

    Lanza HTTP 403 si la clave está ausente o es incorrecta.
    Usa ``secrets.compare_digest`` para evitar ataques de timing.
    """
    if not api_key or not secrets.compare_digest(api_key, settings.SECRET_KEY):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing API key. Include 'X-API-Key' header.",
        )
    return api_key


async def require_admin_key(
    admin_key: Optional[str] = Security(_admin_key_header),
) -> str:
    """
    Dependency: valida el header ``X-Admin-Key`` contra ``settings.SECRET_KEY``.

    Lanza HTTP 403 si la clave está ausente o es incorrecta.
    """
    if not admin_key or not secrets.compare_digest(admin_key, settings.SECRET_KEY):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing admin key. Include 'X-Admin-Key' header.",
        )
    return admin_key
