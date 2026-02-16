from typing import List
from pydantic_settings import BaseSettings


class BaseServiceSettings(BaseSettings):
    """Base configuration settings shared by all services"""
    
    # Service identification
    SERVICE_NAME: str
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # RabbitMQ
    RABBITMQ_HOST: str = "rabbitmq-node1"
    RABBITMQ_PORT: int = 5672
    RABBITMQ_USER: str = "edumind_admin"
    RABBITMQ_PASS: str = "EduM1nd_Adm!n_2024"
    RABBITMQ_VHOST: str = "edumind"

    @property
    def RABBITMQ_URL(self) -> str:
        return (
            f"amqp://{self.RABBITMQ_USER}:{self.RABBITMQ_PASS}"
            f"@{self.RABBITMQ_HOST}:{self.RABBITMQ_PORT}/{self.RABBITMQ_VHOST}"
        )
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"
