"""Configuration settings for Learning Style Service"""
from backend.shared.config import BaseServiceSettings
from functools import lru_cache

class Settings(BaseServiceSettings):
    """Application settings"""
    
    # App Info
    SERVICE_NAME: str = "learning-style-service"
    
    @property
    def APP_NAME(self) -> str:
        return self.SERVICE_NAME
    
    @property
    def APP_VERSION(self) -> str:
        return self.VERSION
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg://postgres:admin@localhost:5432/edumind_learning_style_venath"
    
    # API Settings
    @property
    def API_V1_PREFIX(self) -> str:
        return self.API_PREFIX
    
    # CORS
    @property
    def CORS_ORIGINS(self) -> list:
        return self.ALLOWED_ORIGINS
    
    # Recommendation Settings
    MAX_RECOMMENDATIONS_PER_DAY: int = 5
    MIN_HOURS_BETWEEN_RECOMMENDATIONS: int = 2
    RECOMMENDATION_THRESHOLD: float = 0.50
    HIGH_PRIORITY_THRESHOLD: float = 0.80
    MEDIUM_PRIORITY_THRESHOLD: float = 0.65
    
    # Learning Style Settings
    MIN_DAYS_FOR_CLASSIFICATION: int = 7
    LEARNING_STYLE_UPDATE_FREQUENCY_DAYS: int = 7
    LEARNING_STYLES: list = ["Visual", "Auditory", "Reading", "Kinesthetic", "Mixed"]
    
    # Struggle Detection Settings
    QUIZ_FAILURE_HIGH_THRESHOLD: int = 40  # < 40% = High severity
    QUIZ_FAILURE_MEDIUM_THRESHOLD: int = 60  # < 60% = Medium severity
    QUIZ_FAILURE_LOW_THRESHOLD: int = 70  # < 70% = Low severity
    
    # ML Model Settings
    MODEL_PATH: str = "./ml_models"
    MODEL_VERSION: str = "1.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()













