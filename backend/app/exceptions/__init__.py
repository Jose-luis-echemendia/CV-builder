"""
Excepciones de la aplicación.

Este módulo centraliza todas las excepciones personalizadas de la aplicación,
tanto las genéricas como las específicas del dominio de Feature Models.
"""

from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException

from .exceptions import (
    NotFoundException,
    BusinessLogicException,
    UnprocessableEntityException,
    ConflictException,
    ForbiddenException,
    UnauthorizedException,
    validation_exception_handler,
    http_exception_handler,
    generic_exception_handler,
)

from .users import (
    UserException,
    UserNotFound,
    UserAlreadyExists,
    InvalidPassword,
    PermissionDenied,
    UserInactive,
    UserActive,
)

__all__ = [
    # FastAPI exceptions
    "RequestValidationError",
    "HTTPException",
    # Exception handlers
    "validation_exception_handler",
    "http_exception_handler",
    "generic_exception_handler",
    # Generic exceptions
    "NotFoundException",
    "BusinessLogicException",
    "UnprocessableEntityException",
    "ConflictException",
    "ForbiddenException",
    "UnauthorizedException",
    # User exceptions
    "UserException",
    "UserNotFound",
    "UserAlreadyExists",
    "InvalidPassword",
    "PermissionDenied",
    "UserInactive",
    "UserActive",
]
