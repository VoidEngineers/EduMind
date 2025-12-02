from backend_common.core.config import BaseServiceSettings

class Settings(BaseServiceSettings):
    """User Service Settings"""
    SERVICE_NAME: str = "user-service"
    
    # Specific User Service settings can go here
    
    class Config:
        env_file = ".env"

settings = Settings()
