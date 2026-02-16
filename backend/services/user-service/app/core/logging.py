from backend.shared.logging import get_logger as shared_get_logger
from backend.shared.logging import setup_logging as shared_setup_logging
import logging

def setup_logging(log_level: str = "INFO") -> None:
    """Configure application logging using shared utility"""
    shared_setup_logging(
        service_name="user-service",
        log_level=log_level
    )

# Alias for backward compatibility
configure_logging = setup_logging

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance using shared utility"""
    return shared_get_logger("user-service", name)
