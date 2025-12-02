from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend_common.logging.logger import configure_logging, get_logger
from backend_common.core.config import BaseServiceSettings

class Settings(BaseServiceSettings):
    SERVICE_NAME: str = "xai-prediction-service"
    class Config:
        env_file = ".env"

settings = Settings()
configure_logging(log_level=settings.LOG_LEVEL)
logger = get_logger(__name__)

app = FastAPI(title=settings.SERVICE_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.SERVICE_NAME}
