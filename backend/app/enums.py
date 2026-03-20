from enum import Enum, StrEnum


class Environment(StrEnum):
    DEVELOPMENT = "development"
    STAGING     = "staging"
    PRODUCTION  = "production"