
class BaseUserRepository:

    def validate_email_unique(self, existing_user):
        if existing_user:
            raise ValueError("El email ya está registrado.")

    def prepare_password(self, password: str) -> str:
        from app.core.security import get_password_hash

        return get_password_hash(password)

    def _set_active_status(self, user, is_active: bool):
        """Helper para establecer el estado is_active de un usuario."""
        user.is_active = is_active

