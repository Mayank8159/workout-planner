import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/workout_db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SKIP_TFLITE: bool = os.getenv("SKIP_TFLITE", "false").lower() == "true"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
