from fastapi.testclient import TestClient
from sqlmodel import Session
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import a_engine
from app.repositories.user import UserRepositoryAsync
from app.core.config import settings
from app.models import User, UserCreate, UserUpdate
from app.tests.utils.utils import random_email, random_lower_string


def user_authentication_headers(
    *, client: TestClient, email: str, password: str
) -> dict[str, str]:
    data = {"username": email, "password": password}

    r = client.post(f"{settings.API_V1_STR}/login/access-token", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def create_random_user(db: Session) -> User:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)

    async def _create():
        async with AsyncSession(a_engine) as session:
            repo = UserRepositoryAsync(session=session)
            return await repo.create(user_in)

    user = asyncio.run(_create())
    return user


def authentication_token_from_email(
    *, client: TestClient, email: str, db: Session
) -> dict[str, str]:
    """
    Return a valid token for the user with given email.

    If the user doesn't exist it is created first.
    """
    password = random_lower_string()

    async def _get_or_create():
        async with AsyncSession(a_engine) as session:
            repo = UserRepositoryAsync(session=session)
            user = await repo.get_by_email(email=email)
            if not user:
                user_in_create = UserCreate(email=email, password=password)
                user = await repo.create(user_in_create)
            else:
                user_in_update = UserUpdate(password=password)
                if not user.id:
                    raise Exception("User id not set")
                await repo.update(db_user=user, data=user_in_update)
            return user

    user = asyncio.run(_get_or_create())
    return user_authentication_headers(client=client, email=email, password=password)
