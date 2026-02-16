"""Main FastAPI application for Learning Style Service"""
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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.database import engine, Base
from app.api import (
    routes_recommendations,
    routes_students,
    routes_resources,
    routes_struggles,
    routes_system,
    routes_ml
)
from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from backend.shared.middleware import (
    error_handler_middleware,
    logging_middleware,
    validation_exception_handler,
    http_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
from backend.shared.messaging import get_broker

# Setup logging
setup_logging()
logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to RabbitMQ
    broker = get_broker(settings.RABBITMQ_URL)
    try:
        await broker.connect(client_name=settings.APP_NAME)
        logger.info(f"Connected to RabbitMQ as {settings.APP_NAME}")
    except Exception as e:
        logger.error(f"Could not connect to RabbitMQ: {e}")
    
    yield
    
    # Shutdown: Close RabbitMQ connection
    await broker.close()
    logger.info("Closed RabbitMQ connection")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Adaptive Resource Recommendation System - Automatically recommends resources when students struggle",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Shared middleware
app.middleware("http")(logging_middleware)
app.middleware("http")(error_handler_middleware)

# Shared exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)

# Include routers
app.include_router(routes_system.router, prefix=settings.API_V1_PREFIX)
app.include_router(routes_students.router, prefix=settings.API_V1_PREFIX)
app.include_router(routes_resources.router, prefix=settings.API_V1_PREFIX)
app.include_router(routes_struggles.router, prefix=settings.API_V1_PREFIX)
app.include_router(routes_recommendations.router, prefix=settings.API_V1_PREFIX)
app.include_router(routes_ml.router, prefix=settings.API_V1_PREFIX)


# Global health check for infrastructure (without prefix)
@app.get("/health", tags=["System"])
async def global_health_check():
    """Health check for infrastructure monitoring"""
    from backend.shared.messaging import get_broker
    
    health = {
        "status": "healthy",
        "service": settings.APP_NAME,
        "components": {}
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


# Mount static files for frontend
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/app", StaticFiles(directory=str(frontend_path), html=True), name="frontend")


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    print("=" * 60)
    print(f"  {settings.APP_NAME}")
    print(f"  Version: {settings.APP_VERSION}")
    print("=" * 60)
    print()
    print("API Documentation:")
    print("  - Swagger UI: http://localhost:8005/docs")
    print("  - ReDoc: http://localhost:8005/redoc")
    print()
    print("Status: Running...")
    print("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    print("\nShutting down Learning Style Service...")


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "service": "Learning Style Recognition Service",
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/system/health"
    }