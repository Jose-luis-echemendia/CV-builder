import uuid
import re
import logging
import traceback
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.models.common import ErrorDetail, ErrorResponse

# Configuración básica de logging
logger = logging.getLogger("app.errors")

# Mapa de códigos de error internos de la aplicación
_ERROR_CODE_MAP = {
    400: 1002,
    401: 1003,
    403: 1004,
    404: 1005,
    409: 1006,
    422: 1001,
    500: 5000,
}

# --- FUNCIÓN AUXILIAR PARA CONSTRUIR LA RESPUESTA (DRY) ---

def _build_json_response(
    request: Request, 
    http_code: int, 
    category: str, 
    description: str, 
    exc: Exception = None
) -> JSONResponse:
    """
    Centraliza la creación de respuestas de error, generación de UUID y logging.
    """
    request_id = str(uuid.uuid4())
    
    # 1. Registro de Logs (Logging)
    if http_code >= 500:
        # Errores de servidor: Logueamos el error real y el rastro (traceback)
        logger.error(
            f"ID: {request_id} | Error 500 en {request.method} {request.url.path}\n"
            f"Detalle: {description}\n"
            f"{traceback.format_exc()}"
        )
    elif http_code >= 400:
        # Errores de cliente: Logueamos como advertencia
        logger.warning(f"ID: {request_id} | Error {http_code} en {request.url.path} | {description}")

    # 2. Construcción del detalle del error
    error_detail = ErrorDetail(
        http_code=http_code,
        error_code=_ERROR_CODE_MAP.get(http_code, 1000 + http_code),
        category=category,
        description=description,
        request_id=request_id,
    )

    # 3. Respuesta final estructurada
    response_content = ErrorResponse(
        object=_extract_object_from_request(request),
        code=http_code,
        status="error",
        message=error_detail,
    )

    return JSONResponse(status_code=http_code, content=response_content.model_dump())


def _extract_object_from_request(request: Request) -> str:
    """Extrae el recurso y la operación (ej: user.get) del path."""
    path = request.url.path or ""
    parts = [p for p in path.strip("/").split("/") if p]
    # Ignorar prefijos comunes
    parts = [p for p in parts if not re.fullmatch(r"v\d+", p) and p.lower() != "api"]
    
    resource = parts[0] if parts else "unknown"
    operation = request.method.lower() if request.method else "unknown"
    
    # Normalizar a singular básico (quitar 's' final)
    if resource.endswith("s") and len(resource) > 1:
        resource = resource[:-1]
        
    return f"{resource}.{operation}"


# ========================================================================
# MANEJADORES DE EXCEPCIONES (EXCEPTION HANDLERS)
# ========================================================================

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Manejador para errores de validación (HTTP 422)."""
    error_descriptions = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        error_descriptions.append(f"Field '{field}': {message}")
    
    return _build_json_response(
        request=request,
        http_code=422,
        category="request_validation",
        description=", ".join(error_descriptions)
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    """Manejador para errores HTTP genéricos (400, 401, 403, 404, etc)."""
    return _build_json_response(
        request=request,
        http_code=exc.status_code,
        category="http_error",
        description=str(exc.detail)
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Manejador para cualquier error inesperado (HTTP 500)."""
    return _build_json_response(
        request=request,
        http_code=500,
        category="internal_server_error",
        description="An unexpected internal server error occurred.",
        exc=exc
    )


# ========================================================================
# CUSTOM EXCEPTIONS
# ========================================================================


class NotFoundException(HTTPException):
    """Excepción para recursos no encontrados (404)."""

    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=404, detail=detail)


class BusinessLogicException(HTTPException):
    """Excepción para errores de lógica de negocio (400)."""

    def __init__(self, detail: str = "Business logic error"):
        super().__init__(status_code=400, detail=detail)


class UnprocessableEntityException(HTTPException):
    """Excepción para entidades no procesables (422)."""

    def __init__(self, detail: str = "Unprocessable entity"):
        super().__init__(status_code=422, detail=detail)


class ConflictException(HTTPException):
    """Excepción para conflictos de recursos (409)."""

    def __init__(self, detail: str = "Resource conflict"):
        super().__init__(status_code=409, detail=detail)


class ForbiddenException(HTTPException):
    """Excepción para acceso prohibido (403)."""

    def __init__(self, detail: str = "Access forbidden"):
        super().__init__(status_code=403, detail=detail)


class UnauthorizedException(HTTPException):
    """Excepción para acceso no autorizado (401)."""

    def __init__(self, detail: str = "Unauthorized access"):
        super().__init__(status_code=401, detail=detail)
