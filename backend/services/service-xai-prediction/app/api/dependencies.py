"""FastAPI dependencies for the XAI service."""

from app.core.database import get_db, get_temp_students_db

__all__ = ["get_db", "get_temp_students_db"]
