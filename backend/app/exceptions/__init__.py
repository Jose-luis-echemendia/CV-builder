"""
Excepciones de la aplicación.

Este módulo centraliza todas las excepciones personalizadas de la aplicación,
tanto las genéricas como las específicas del dominio de.
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
]
