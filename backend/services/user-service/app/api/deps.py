from typing import Generator
from backend_common.db.base import get_db_session
from app.core.config import settings

SessionLocal = get_db_session(settings.DATABASE_URL)

def get_db() -> Generator:
    """Dependency for getting DB session"""
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
