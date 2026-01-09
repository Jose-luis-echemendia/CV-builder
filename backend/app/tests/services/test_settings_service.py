import json
from unittest.mock import Mock

from app.services.settings import SettingsService, CACHE_KEY_PREFIX
from app.models.app_setting import AppSetting
from app.services.redis import RedisService


class DummyDBSession:
    def __init__(self, initial: dict[str, object] | None = None):
        # store AppSetting-like objects by key
        self._store = {}
        if initial:
            for k, v in initial.items():
                self._store[k] = AppSetting(key=k, value=v)

    def get(self, model, key):
        return self._store.get(key)

    def add(self, obj):
        # simple store by key attribute
        self._store[obj.key] = obj

    def commit(self):
        pass

    def refresh(self, obj):
        # noop for tests
        return obj


class DummyRedis:
    def __init__(self):
        self._store = {}

    def get(self, key):
        return self._store.get(key)

    def set(self, key, value, ex=None):
        self._store[key] = value

    def delete(self, *keys):
        for k in keys:
            self._store.pop(k, None)

    def keys(self, pattern):
        # naive implementation: ignore pattern
        return list(self._store.keys())


def test_get_with_cache_hit(monkeypatch):
    # Redis returns serialized JSON -> SettingsService.get should return decoded value
    db = DummyDBSession({"MY_KEY": {"a": 1}})
    dummy_redis = DummyRedis()
    dummy_redis.set(f"{CACHE_KEY_PREFIX}MY_KEY", json.dumps({"a": 1}))

    monkeypatch.setattr(RedisService, "get_sync", classmethod(lambda cls: dummy_redis))

    svc = SettingsService(db)
    val = svc.get("MY_KEY", default=None)
    assert val == {"a": 1}


def test_get_cache_miss_reads_db_and_sets_cache(monkeypatch):
    # Redis returns None, DB has setting, service should set redis.set
    db = DummyDBSession({"MY_KEY2": "string-value"})
    dummy_redis = DummyRedis()
    monkeypatch.setattr(RedisService, "get_sync", classmethod(lambda cls: dummy_redis))

    svc = SettingsService(db)
    val = svc.get("MY_KEY2", default=None)
    assert val == "string-value"
    # check cache set
    assert dummy_redis.get(f"{CACHE_KEY_PREFIX}MY_KEY2") == json.dumps("string-value")


def test_update_creates_and_updates_cache(monkeypatch):
    db = DummyDBSession()
    dummy_redis = DummyRedis()
    monkeypatch.setattr(RedisService, "get_sync", classmethod(lambda cls: dummy_redis))

    svc = SettingsService(db)
    created = svc.update("NEW_KEY", {"x": True}, description="desc")
    assert created.key == "NEW_KEY"
    assert created.value == {"x": True}
    assert dummy_redis.get(f"{CACHE_KEY_PREFIX}NEW_KEY") == json.dumps({"x": True})
