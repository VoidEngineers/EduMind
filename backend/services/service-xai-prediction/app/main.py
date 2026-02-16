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

from contextlib import asynccontextmanager

from app.api import routes
from app.core.config import settings
from app.core.logging import get_logger, setup_logging
from app.core.middleware import (
    error_handler_middleware,
    http_exception_handler,
    logging_middleware,
    validation_exception_handler,
)
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

# Setup logging
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {settings.SERVICE_NAME} v{settings.VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"API Prefix: {settings.API_PREFIX}")

    # Connect to RabbitMQ
    from backend.shared.messaging import get_broker
    broker = get_broker(settings.RABBITMQ_URL)
    try:
        await broker.connect(client_name=settings.SERVICE_NAME)
        logger.info(f"Connected to RabbitMQ as {settings.SERVICE_NAME}")
    except Exception as e:
        logger.error(f"Could not connect to RabbitMQ: {e}")

    # Verify model loading
    try:
        from app.services.ml_service import ml_service

        if ml_service.model is None:
            logger.error(" ML model failed to load!")
            raise RuntimeError("ML model not loaded")
        logger.info("ML models loaded successfully")
    except Exception as e:
        logger.error(f"Startup failed: {str(e)}")
        raise

    logger.info("Service ready!")

    yield

    # Shutdown: Close RabbitMQ connection
    from backend.shared.messaging import get_broker
    broker = get_broker(settings.RABBITMQ_URL)
    await broker.close()
    logger.info(f"Shutting down {settings.SERVICE_NAME}")


# Create FastAPI app
app = FastAPI(
    title=settings.SERVICE_NAME,
    version=settings.VERSION,
    description="XAI-powered student outcome prediction service with explainable AI",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    lifespan=lifespan,
)

# Configure CORS - MUST be first middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Add custom middleware (after CORS)
app.middleware("http")(logging_middleware)
app.middleware("http")(error_handler_middleware)

# Add exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)

# Include routers
app.include_router(routes.router, prefix=settings.API_PREFIX)

from app.api import academic_risk_routes
app.include_router(academic_risk_routes.router, prefix=settings.API_PREFIX)

# Health Check (without prefix for Docker/Infrastructure)
@app.get("/health", tags=["health"])
async def health_check():
    from app.services.ml_service import ml_service
    from backend.shared.messaging import get_broker

    health = {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "model_loaded": ml_service.model is not None,
        "components": {},
    }

    # Check RabbitMQ
    try:
        broker = get_broker(settings.RABBITMQ_URL)
        if broker.connection and not broker.connection.is_closed:
            health["components"]["rabbitmq"] = "connected"
        else:
            health["components"]["rabbitmq"] = "disconnected"
            health["status"] = "degraded"
    except Exception:
        health["components"]["rabbitmq"] = "error"
        health["status"] = "degraded"

    return health


@app.get("/")
async def root():
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": f"{settings.API_PREFIX}/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG
    )
