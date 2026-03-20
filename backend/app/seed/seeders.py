"""
Funciones de seeding para poblar la base de datos

Este módulo contiene todas las funciones necesarias para crear
datos de prueba en la base de datos de manera idempotente.
"""

import logging
from typing import Optional

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models import (
    AppSetting,
)

# Importar datos
from .data_settings import settings_data


logger = logging.getLogger(__name__)


# ==============================================================================
# SETTINGS
# ==============================================================================
async def seed_settings(session: AsyncSession) -> None:
    """Crear configuraciones de la aplicación"""

    logger.info("🌱 Sembrando configuraciones de aplicación...")

    if (await session.exec(select(AppSetting))).first():
        logger.info("  ℹ️  Configuraciones ya existen, omitiendo...")
        return

    for key, value, description in settings_data:
        setting = AppSetting(key=key, value=str(value), description=description)
        session.add(setting)
        logger.debug(f"  ➕ Agregando setting: {key}={value}")

    await session.commit()
    logger.info(f"✅ Configuraciones sembradas: {len(settings_data)} settings")

