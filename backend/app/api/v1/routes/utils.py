# endpoints for Root and Utils

from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache

from pydantic.networks import EmailStr

from app.models import Message
from app.services import SettingsService
from app.api.deps import get_settings_service
from app.core.config import settings
from app.utils import generate_test_email, send_email

router = APIRouter(prefix="/utils", tags=["utils"])


# ===========================================================================
#           --- THIS ROUTER HAS ALL ITS OPERATIONS ASYNC ---
# ===========================================================================



# ===========================================================================
#               --- Endpoint Health Check ---
# ===========================================================================


@router.get("/health-check")
async def health_check() -> bool:
    return True


# ---------------------------------------------------------------------------
#   --- Endpoint de ayuda para acceder a la documentación del sistema ---
# ---------------------------------------------------------------------------
@router.get("/docs-access")
@cache(expire=86400)
async def get_docs_access_info():
    """
    Endpoint de ayuda para acceder a la documentación interna.

    Proporciona información sobre cómo obtener acceso a /internal-docs/
    """
    # Usar la variable de entorno DOMAIN
    base_url = settings.DOMAIN

    return {
        "message": "Acceso a Documentación Interna",
        "authentication_required": False,
        "steps": [
            {
                "step": 1,
                "description": "Abrir la documentación interna",
                "url": f"{base_url}/internal-docs/",
                "method": "GET",
            }
        ],
        "notes": [
            "La documentación interna está disponible sin autenticación de usuario",
        ],
        "quick_access_example": f"{base_url}/internal-docs/",
    }


# ===========================================================================
#           --- Endpoint para simular un error inesperado. ---
# ===========================================================================


@router.get("/test/internal-error")
async def get_internal_error():
    """
    Este endpoint simula un error inesperado.
    Será capturado por el `generic_exception_handler`.
    """
    print(1 / 0)  # Esto lanzará un ZeroDivisionError
    return {"message": "Esto nunca se verá"}


# ===========================================================================
#       --- Endpoint para probar el envío de correos electrónicos. ---
# ===========================================================================


@router.post(
    "/test-email",
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")


# ================================================================================
#  --- Endpoint para probar el servicio de variables dinámicas del sistema. ---
# ================================================================================


@router.get("/test/setting")
async def get_example_with_dynamic_setting(
    settings_service: SettingsService = Depends(get_settings_service),
):
    """
    Endpoint para probar el servicio de variables dinámicas configurables.
    Usamos el servicio para obtener un ajuste dinámico
    """

    items_per_page = await settings_service.aget("ITEMS_PER_PAGE", default=25)
    maintenance_mode = await settings_service.aget("MAINTENANCE_MODE", default=False)

    if maintenance_mode:
        return {"message": "El sistema está en modo mantenimiento."}

    return {"message": f"Mostrando {items_per_page} items por página."}


# ===========================================================================
#           --- Endpoint para limpiar la CACHÉ del sistema ---
# ===========================================================================


@router.post("/clear-cache")
async def clear_cache():
    """
    Limpia toda la caché de la aplicación.

    Elimina todas las claves de Redis que empiezan con 'fastapi-cache:'
    (usadas por el decorador @cache) sin afectar otros datos en Redis.
    """
    from app.services.redis import RedisService

    redis = RedisService.get_async()
    if not redis:
        return {"detail": "Redis no está disponible", "keys_deleted": 0}

    try:
        # Buscar todas las claves que empiezan con 'fastapi-cache:'
        pattern = "fastapi-cache:*"
        keys = []

        # Usar scan para obtener las claves (más eficiente que keys())
        cursor = 0
        while True:
            cursor, partial_keys = await redis.scan(cursor, match=pattern, count=100)
            keys.extend(partial_keys)
            if cursor == 0:
                break

        # Eliminar las claves encontradas
        deleted_count = 0
        if keys:
            deleted_count = await redis.delete(*keys)

        return {
            "detail": "Cache cleared successfully",
            "pattern": pattern,
            "keys_deleted": deleted_count,
        }

    except Exception as e:
        return {"detail": f"Error clearing cache: {str(e)}", "keys_deleted": 0}
