import os
import sys
from pathlib import Path

# Add the project root to sys.path for shared module imports
script_dir = Path(__file__).resolve().parent
project_root = script_dir.parent.parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Also add the service directory to path for local imports
service_dir = script_dir.parent
if str(service_dir) not in sys.path:
    sys.path.insert(0, str(service_dir))

from app.api import routes
from app.core.config import settings
from app.core.logging import configure_logging, get_logger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.shared.messaging import get_broker

# Configure logging
configure_logging(log_level=settings.LOG_LEVEL)
logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to RabbitMQ
    broker = get_broker(settings.RABBITMQ_URL)
    try:
        await broker.connect(client_name=settings.SERVICE_NAME)
        logger.info(f"Connected to RabbitMQ as {settings.SERVICE_NAME}")
    except Exception as e:
        logger.error(f"Could not connect to RabbitMQ: {e}")
    
    yield
    
    # Shutdown: Close RabbitMQ connection
    await broker.close()
    logger.info("Closed RabbitMQ connection")

app = FastAPI(
    title=settings.SERVICE_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, use settings.ALLOWED_ORIGINS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(routes.router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health_check():
    health = {"status": "healthy", "service": settings.SERVICE_NAME, "components": {}}
    
    # Check RabbitMQ
    broker = get_broker(settings.RABBITMQ_URL)
    if broker.connection and not broker.connection.is_closed:
        health["components"]["rabbitmq"] = "connected"
    else:
        health["components"]["rabbitmq"] = "disconnected"
        health["status"] = "degraded"
        
    return health
