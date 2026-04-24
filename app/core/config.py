from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ShareHub Backend"
    port: int = 4000
    frontend_origin: str = "http://localhost:5500"
    google_client_id: str = ""
    database_url: str = "postgresql+asyncpg://postgres:root@localhost:5432/sharehub"
    auth_token_secret: str = "sharehub-dev-secret-change-me"
    auth_token_expire_hours: int = 168

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
