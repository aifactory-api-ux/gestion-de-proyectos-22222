import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "gestion_proyectos"
    POSTGRES_USER: str = "gp_admin"
    POSTGRES_PASSWORD: str = "supersecret"

    AUTH_JWT_SECRET: str = "change_this_secret"
    AUTH_JWT_EXPIRE_MINUTES: int = 60

    FRONTEND_API_URL: str = "http://localhost:8001"
    PROJECT_API_URL: str = "http://localhost:8002"
    NOTIFICATION_API_URL: str = "http://localhost:8003"
    CHAT_API_URL: str = "http://localhost:8004"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()