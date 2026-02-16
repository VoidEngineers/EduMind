from backend.shared.config import BaseServiceSettings
from typing import Optional

class Settings(BaseServiceSettings):
    """User Service Settings"""
    SERVICE_NAME: str = "user-service"
    
    # Backward compatibility
    @property
    def API_V1_STR(self) -> str:
        return self.API_PREFIX

    # Database
    DATABASE_URL: Optional[str] = None

    # Security
    SECRET_KEY: str = "dev-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
