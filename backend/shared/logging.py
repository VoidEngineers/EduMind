import logging
import sys
from typing import Optional


def setup_logging(
    service_name: str, 
    log_level: str = "INFO", 
    format_str: Optional[str] = None
) -> None:
    """
    Configure application logging.
    
    Args:
        service_name: Name of the service for logger identification
        log_level: Logging level (e.g., INFO, DEBUG, WARNING)
        format_str: Optional custom log format
    """
    if format_str is None:
        format_str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Creating the formatter
    formatter = logging.Formatter(
        fmt=format_str,
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    # Root logger
    root_logger = logging.getLogger()
    
    # Clear existing handlers to avoid duplicates
    if root_logger.hasHandlers():
        root_logger.handlers.clear()
        
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)
    root_logger.setLevel(numeric_level)
    root_logger.addHandler(console_handler)

    # Set library loggers to warning to reduce noise
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.WARNING)

    # Application logger
    app_logger = logging.getLogger(service_name)
    app_logger.setLevel(numeric_level)


def get_logger(service_name: str, module_name: str) -> logging.Logger:
    """
    Get a logger instance prefixed with service name.
    
    Args:
        service_name: Name of the service
        module_name: Name of the module (usually __name__)
    """
    return logging.getLogger(f"{service_name}.{module_name}")
