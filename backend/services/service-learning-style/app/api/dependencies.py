"""FastAPI dependencies"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal


def get_db():
    """
    Dependency for getting database sessions
    
    Usage:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()











