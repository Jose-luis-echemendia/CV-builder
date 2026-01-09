from enum import Enum


class UserRole(str, Enum):
    """
    Enums para definir los roles del usuario
    """

    DEVELOPER = "developer"
    ADMIN = "admin"
    USER = "user"
    