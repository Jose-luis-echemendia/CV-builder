"""Esquemas Pydantic para endpoints de utilidad."""

from typing import Any, Literal

from pydantic import BaseModel


class WelcomeResponse(BaseModel):
    """Respuesta del endpoint raíz."""

    message: str
    project: str
    version: str | None = None
    environment: Literal["local", "staging", "production"] = "local"
