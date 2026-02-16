from backend.shared.logging import get_logger as shared_get_logger
from backend.shared.logging import setup_logging as shared_setup_logging
from app.core.config import settings
import logging

def setup_logging() -> None:
    """Configure application logging using shared utility"""
    shared_setup_logging(
        service_name="engagement-tracker",
        log_level=settings.LOG_LEVEL
    )

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance using shared utility"""
    return shared_get_logger("engagement-tracker", name)
