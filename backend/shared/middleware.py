import logging
import time
import uuid
from typing import Callable, Optional

from fastapi import Request, status
from fastapi.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import os
import socket

logger = logging.getLogger(__name__)

# Service Instance ID for observability
INSTANCE_ID = os.getenv("HOSTNAME", socket.gethostname())


async def error_handler_middleware(request: Request, call_next: Callable):
    """Global error handling middleware"""
    try:
        return await call_next(request)
    except StarletteHTTPException:
        raise
    except RequestValidationError:
        raise
    except ValueError as exc:
        logger.error(f"Validation error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "detail": "Invalid request",
                "error": str(exc),
                "request_id": getattr(request.state, "request_id", None),
            },
        )
    except Exception as exc:
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "error": "An unexpected error occurred",
                "request_id": getattr(request.state, "request_id", None),
            },
        )


async def logging_middleware(request: Request, call_next: Callable):
    """Request/response logging middleware with Correlation ID"""
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    
    start_time = time.time()

    logger.info(f"[{request_id}] Request: {request.method} {request.url.path} (Instance: {INSTANCE_ID})")

    response = await call_next(request)
    
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Instance-ID"] = INSTANCE_ID

    process_time = time.time() - start_time
    logger.info(f"[{request_id}] Response: {response.status_code} - Duration: {process_time:.3f}s (Instance: {INSTANCE_ID})")

    return response


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": exc.errors()},
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
