"""
Custom exceptions for User operations.

This module defines user-specific exceptions following the same
conventions and style used in `domain_exceptions.py` so they are
consistent across the codebase and produce uniform HTTP error responses.

Exception Categories:
- User Entity: not found, already exists
- User Operations: invalid password, active/inactive state
- Authorization: permission denied

Each exception maps to an appropriate HTTP status implicitly via the
base exceptions in `app.exceptions` (for example, `NotFoundException` => 404).
"""

from app.exceptions import (
    NotFoundException,
    BusinessLogicException,
    ConflictException,
    UnprocessableEntityException,
    ForbiddenException,
)


# ======================================================================================
#                           User Entity Exceptions
# ======================================================================================


class UserException(BusinessLogicException):
    """Excepción base para errores relacionados con usuarios.

    Hereda de `BusinessLogicException` (HTTP 400) para comportamientos
    generales de negocio si no se especifica otro tipo.
    """


class UserNotFound(NotFoundException):
    """Excepción lanzada cuando un usuario no existe.

    HTTP Status: 404 Not Found

    Uso cuando:
    - El `user_id` solicitado no existe en la base de datos

    Ejemplo:
        raise UserNotFound(user_id="123e4567-e89b-12d3-a456-426614174000")
    """

    def __init__(self, user_id: str | None = None):
        detail = "User not found"
        if user_id:
            detail = f"User with id '{user_id}' not found"
        super().__init__(detail=detail)



class UserAlreadyExists(ConflictException):
    """Excepción lanzada al intentar crear un usuario duplicado.

    HTTP Status: 409 Conflict

    Uso cuando:
    - El email o identificador del usuario ya existe

    Ejemplo:
        raise UserAlreadyExists(detail="Email already registered")
    """

    def __init__(self, detail: str = "User already exists"):
        super().__init__(detail=detail)


# ======================================================================================
#                           User Operation Exceptions
# ======================================================================================


class InvalidPassword(UnprocessableEntityException):
    """Excepción lanzada cuando la contraseña no cumple las validaciones.

    HTTP Status: 422 Unprocessable Entity

    Uso cuando:
    - La contraseña es demasiado corta o no cumple los criterios de seguridad
    - Se intenta cambiar la contraseña y la actual no coincide

    Ejemplo:
        raise InvalidPassword(detail="Password must be at least 8 characters")
    """

    def __init__(self, detail: str = "Invalid password"):
        super().__init__(detail=detail)



class UserActive(BusinessLogicException):
    """Excepción lanzada cuando una operación no es válida porque el usuario está activo.

    HTTP Status: 400 Bad Request (heredado de BusinessLogicException)

    Uso cuando:
    - Se intenta activar de nuevo un usuario ya activo (si aplica)

    Ejemplo:
        raise UserActive(detail="User is already active")
    """

    def __init__(self, detail: str = "User is active"):
        super().__init__(detail=detail)


class UserInactive(BusinessLogicException):
    """Excepción lanzada cuando una operación no es válida porque el usuario está inactivo.

    HTTP Status: 400 Bad Request

    Uso cuando:
    - Se intenta realizar una operación que requiere que el usuario esté activo

    Ejemplo:
        raise UserInactive(detail="User is inactive")
    """

    def __init__(self, detail: str = "User is inactive"):
        super().__init__(detail=detail)


# ======================================================================================
#                           Authorization Exceptions
# ======================================================================================


class PermissionDenied(ForbiddenException):
    """Excepción lanzada cuando la acción está prohibida para el usuario actual.

    HTTP Status: 403 Forbidden

    Uso cuando:
    - Un usuario intenta realizar una acción para la que no tiene permisos

    Ejemplo:
        raise PermissionDenied(detail="Only admins can perform this action")
    """

    def __init__(self, detail: str = "Permission denied"):
        super().__init__(detail=detail)

