from fastapi import APIRouter

from app.api.v1.routes import utils

# ========================================================================
#           --- ROUTER PRINCIPAL PARA LA API RESTful V1 ---
# ========================================================================
api_router = APIRouter()

# Incluir cada router
api_router.include_router(utils.router)  # Root
