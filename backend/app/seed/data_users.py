"""
Datos de usuarios del sistema
Incluye usuarios de producción y de desarrollo/testing
"""

from app.enums import UserRole

# ============================================================================
# USUARIOS DE PRODUCCIÓN (se crean siempre)
# ============================================================================
# Estructura: (email, role, is_superuser)
production_users = [
    ("echemendiajoseluis@gmail.com", UserRole.DEVELOPER, True),
]

# ============================================================================
# USUARIOS DE DESARROLLO/TESTING (solo en entorno local/development)
# ============================================================================
# Estructura: (email, password, role, is_superuser)
development_users = [
    ("admin@developer.com", "admin123", UserRole.DEVELOPER, True),
]
