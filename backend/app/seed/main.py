"""
Módulo principal de seeding

Este módulo orquesta el proceso completo de seeding con diferentes modos:
- Producción: Solo datos esenciales (settings, usuarios de producción)
- Desarrollo: Datos completos incluyendo ejemplos y usuarios de prueba
"""

import logging
import os
import asyncio

from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.db import a_engine
from .seeders import (
    create_first_superuser,
    seed_settings,
    seed_production_users,
    seed_development_users,
    get_admin_user,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_production(session: AsyncSession) -> None:
    """
    Seeding para entorno de producción

    Solo crea:
    - Configuraciones de aplicación
    - FIRST_SUPERUSER desde variables de entorno
    - Usuarios de producción (sin contraseñas de prueba)
    """

    logger.info("=" * 70)
    logger.info("🏭 SEEDING DE PRODUCCIÓN")
    logger.info("=" * 70)

    # 1. Settings
    await seed_settings(session)

    # 2. FIRST_SUPERUSER
    await create_first_superuser(session)

    # 3. Usuarios de producción
    await seed_production_users(session)

    logger.info("=" * 70)
    logger.info("✅ SEEDING DE PRODUCCIÓN COMPLETADO")
    logger.info("=" * 70)


async def seed_development(session: AsyncSession) -> None:
    """
    Seeding para entorno de desarrollo/testing

    Crea todos los datos de ejemplo incluyendo:
    - FIRST_SUPERUSER desde variables de entorno
    - Usuarios de desarrollo con contraseñas conocidas
    - Dominios académicos de ejemplo
    - Etiquetas pedagógicas
    - Recursos educativos
    - Planes de estudio y modelos curriculares de ejemplo
    """

    logger.info("=" * 70)
    logger.info("🧪 SEEDING DE DESARROLLO")
    logger.info("=" * 70)

    # 1. FIRST_SUPERUSER
    await create_first_superuser(session)

    # 2. Usuarios de desarrollo
    dev_users = await seed_development_users(session)

    # 3. Obtener admin para crear otros datos
    admin = await get_admin_user(session)
    if not admin:
        logger.error("❌ No se encontró usuario admin, abortando seeding de desarrollo")
        return

    # =================================================================================
    # Datos de desarrollo
    # =================================================================================

    logger.info("=" * 70)
    logger.info("✅ SEEDING DE DESARROLLO COMPLETADO")
    logger.info("=" * 70)
    logger.info("")
    logger.info("📝 CREDENCIALES DE PRUEBA:")
    logger.info("  Admin:               admin@example.com / admin123")
    logger.info("")


async def seed_all(environment: str = "local") -> None:
    """
    Ejecutar seeding completo según el entorno

    Args:
        environment: 'local', 'development', 'staging', 'production'
    """

    logger.info("")
    logger.info("=" * 70)
    logger.info(f"🌱 INICIANDO DATABASE SEEDING - Entorno: {environment.upper()}")
    logger.info("=" * 70)
    logger.info("")

    try:
        async with AsyncSession(a_engine) as session:
            # Siempre crear settings
            await seed_settings(session)

            if environment in ["local", "development"]:
                # Entorno de desarrollo: todo el seeding
                await seed_development(session)
            elif environment in ["staging", "production"]:
                # Entorno de producción: solo lo esencial
                await seed_production(session)
            else:
                logger.warning(
                    f"⚠️  Entorno '{environment}' no reconocido, usando modo desarrollo"
                )
                await seed_development(session)

            logger.info("=" * 70)
            logger.info("✅ DATABASE SEEDING COMPLETADO EXITOSAMENTE")
            logger.info("=" * 70)
            logger.info("")

    except Exception as e:
        logger.error(f"❌ Error durante el seeding: {e}")
        logger.exception("Detalles del error:")
        raise


def main():
    """Función principal para ejecutar desde línea de comandos"""

    # Obtener entorno de variable de entorno
    environment = os.getenv("ENVIRONMENT", "local")

    asyncio.run(seed_all(environment=environment))


if __name__ == "__main__":
    main()
