import json
import pytest
from unittest.mock import Mock

from app.services.settings import SettingsService, CACHE_KEY_PREFIX
from app.models.app_setting import AppSetting
from app.core import redis

class DummyDBSession:
    def __init__(self, initial: dict[str, object] | None = None):
        self._store = {}
        if initial:
            for k, v in initial.items():
                self._store[k] = AppSetting(key=k, value=v)

    async def get(self, model, key):
        return self._store.get(key)

    def add(self, obj):
        self._store[obj.key] = obj

    async def commit(self):
        pass

    async def refresh(self, obj):
        return obj

class DummyRedisAsync:
    def __init__(self):
        self._store = {}

    async def get(self, key):
        return self._store.get(key)

    async def set(self, key, value, ex=None):
        self._store[key] = value

    async def delete(self, *keys):
        for k in keys:
            self._store.pop(k, None)

    async def keys(self, pattern):
        return list(self._store.keys())

@pytest.fixture
def mock_redis(monkeypatch):
    dummy_redis = DummyRedisAsync()
    monkeypatch.setattr(redis, "redis_client", dummy_redis)
    return dummy_redis

@pytest.mark.asyncio
async def test_get_with_cache_hit(mock_redis):
    db = DummyDBSession({"MY_KEY": {"a": 1}})
    await mock_redis.set(f"{CACHE_KEY_PREFIX}MY_KEY", json.dumps({"a": 1}))

    svc = SettingsService(db)
    val = await svc.get("MY_KEY", default=None)
    assert val == {"a": 1}

@pytest.mark.asyncio
async def test_get_cache_miss_reads_db_and_sets_cache(mock_redis):
    db = DummyDBSession({"MY_KEY2": "string-value"})
    svc = SettingsService(db)
    val = await svc.get("MY_KEY2", default=None)
    assert val == "string-value"
    assert await mock_redis.get(f"{CACHE_KEY_PREFIX}MY_KEY2") == json.dumps("string-value")

@pytest.mark.asyncio
async def test_update_creates_and_updates_cache(mock_redis):
    db = DummyDBSession()
    svc = SettingsService(db)
    created = await svc.update("NEW_KEY", {"x": True}, description="desc")
    assert created.key == "NEW_KEY"
    assert created.value == {"x": True}
    assert await mock_redis.get(f"{CACHE_KEY_PREFIX}NEW_KEY") == json.dumps({"x": True})
