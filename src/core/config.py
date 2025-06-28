"""
Configuration settings for the application
"""
import os
from typing import Optional

class Settings:
    # JWT Configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # App Configuration
    APP_NAME: str = "Supreme AI Deployment Hub"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database Configuration (in-memory for now)
    DATABASE_URL: Optional[str] = None

settings = Settings()