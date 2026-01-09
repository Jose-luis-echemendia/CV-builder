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
    User,
    AppSetting,
)
from app.core.security import get_password_hash
from app.repositories.user import UserRepositoryAsync
from app.models.user import UserCreate
from app.enums import UserRole

# Importar datos
from .data_settings import settings_data
from .data_users import production_users, development_users


logger = logging.getLogger(__name__)


# ==============================================================================
# FIRST SUPERUSER
# ==============================================================================
async def create_first_superuser(session: AsyncSession) -> Optional[User]:
    """
    Crear el primer superusuario desde variables de entorno

    Este usuario se crea SIEMPRE en todos los entornos (producción y desarrollo)
    y es el administrador principal del sistema.
    """
    from app.core.config import settings

    logger.info("🌱 Creando FIRST_SUPERUSER...")

    # Verificar si ya existe
    existing = (
        await session.exec(select(User).where(User.email == settings.FIRST_SUPERUSER))
    ).first()

    if existing:
        logger.info(
            f"  ℹ️  FIRST_SUPERUSER '{settings.FIRST_SUPERUSER}' ya existe, omitiendo..."
        )
        return existing

    # Crear el primer superusuario
    user_in = UserCreate(
        email=settings.FIRST_SUPERUSER,
        password=settings.FIRST_SUPERUSER_PASSWORD,
        role=UserRole.DEVELOPER,
    )

    user_repo = UserRepositoryAsync(session)
    user = await user_repo.create(user_in)

    logger.info(f"  ✅ FIRST_SUPERUSER creado: {settings.FIRST_SUPERUSER}")
    return user


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


# ==============================================================================
# USERS - PRODUCTION
# ==============================================================================
async def seed_production_users(session: AsyncSession) -> dict[str, User]:
    """Crear usuarios de producción (sin contraseña predeterminada)"""

    logger.info("🌱 Sembrando usuarios de producción...")

    users = {}

    for email, role in production_users:
        # Verificar si ya existe
        existing = (await session.exec(select(User).where(User.email == email))).first()

        if existing:
            logger.info(f"  ℹ️  Usuario '{email}' ya existe, omitiendo...")
            users[email] = existing
            continue

        # Crear usuario (la contraseña se establecerá por email)
        user_in = UserCreate(
            email=email,
            password="ChangeMe123!",  # Contraseña temporal
            role=role,
        )

        user_repo = UserRepositoryAsync(session)
        user = await user_repo.create(user_in)
        users[email] = user
        logger.info(f"  ✅ Creado usuario: {email} ({role.value})")

    await session.commit()
    logger.info(f"✅ Usuarios de producción sembrados: {len(users)} usuarios")

    return users


# ==============================================================================
# USERS - DEVELOPMENT
# ==============================================================================
async def seed_development_users(session: AsyncSession) -> dict[str, User]:
    """Crear usuarios de desarrollo/testing con contraseñas conocidas"""

    logger.info("🌱 Sembrando usuarios de desarrollo...")

    users = {}

    # Obtener admin para asignar como created_by
    admin = (
        await session.exec(select(User).where(User.email == "admin@example.com"))
    ).first()

    for email, password, role, is_superuser in development_users:
        # Verificar si ya existe
        existing = (await session.exec(select(User).where(User.email == email))).first()

        if existing:
            logger.info(f"  ℹ️  Usuario '{email}' ya existe, omitiendo...")
            users[email] = existing
            continue

        # Crear usuario con contraseña conocida
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            is_superuser=is_superuser,
            is_active=True,
            role=role,
            created_by_id=admin.id if admin and not is_superuser else None,
        )
        session.add(user)
        await session.flush()
        users[email] = user
        logger.info(f"  ✅ Creado usuario: {email} ({role.value}) - pwd: {password}")

    await session.commit()
    logger.info(f"✅ Usuarios de desarrollo sembrados: {len(users)} usuarios")

    return users


# ==============================================================================
# HELPER FUNCTION
# ==============================================================================
async def get_admin_user(session: AsyncSession) -> Optional[User]:
    """Obtener el primer usuario admin disponible"""

    # Intentar obtener admin de desarrollo
    admin = (
        await session.exec(select(User).where(User.email == "admin@example.com"))
    ).first()

    if admin:
        return admin

    # Obtener cualquier superuser
    admin = (await session.exec(select(User).where(User.is_superuser == True))).first()

    if admin:
        return admin

    # Obtener cualquier admin
    admin = (
        await session.exec(select(User).where(User.role == UserRole.ADMIN))
    ).first()

    return admin
