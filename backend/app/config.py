"""LifeSphere AI-X Backend Configuration Module.

Loads environment variables, handles typed settings validation,
and configures CORS and Firebase credentials safely.
"""

from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application runtime settings loaded from environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Core Server Settings
    environment: str = Field(default="development", description="Runtime environment (development, test, production)")
    port: int = Field(default=8000, description="Listening port for FastAPI server")
    host: str = Field(default="0.0.0.0", description="Host address for FastAPI server")
    debug: bool = Field(default=False, description="Debug mode flag")

    # CORS Settings
    allowed_origins_raw: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173",
        alias="ALLOWED_ORIGINS",
        description="Comma-separated list of allowed frontend origin URLs",
    )

    # Firebase Admin Configuration
    firebase_service_account_key_path: str = Field(
        default="",
        alias="FIREBASE_SERVICE_ACCOUNT_KEY_PATH",
        description="Path to Firebase Service Account JSON credentials",
    )
    firebase_service_account_json: str = Field(
        default="",
        alias="FIREBASE_SERVICE_ACCOUNT_JSON",
        description="Inline JSON string of Firebase credentials",
    )
    firebase_project_id: str = Field(
        default="lifesphere-ai-production",
        alias="FIREBASE_PROJECT_ID",
        description="Target Firebase project ID",
    )
    firebase_mock_auth_for_dev: bool = Field(
        default=False,
        alias="FIREBASE_MOCK_AUTH_FOR_DEV",
        description="Enable simulated token verification for offline testing without network GCP access",
    )

    @property
    def allowed_origins(self) -> List[str]:
        """Parse comma-separated origin strings into a clean list."""
        if not self.allowed_origins_raw:
            return ["*"]
        return [origin.strip() for origin in self.allowed_origins_raw.split(",") if origin.strip()]


# Global cached settings instance
settings = Settings()
