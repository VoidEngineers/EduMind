"""API routes for student struggles"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.dependencies import get_db
from app.schemas import (
    StudentStruggleCreate,
    StudentStruggleResponse,
    StudentStruggleList
)
from app.models import StudentStruggle
from app.services.struggle_detection_service import StruggleDetectionService

router = APIRouter(prefix="/struggles", tags=["Struggles"])


@router.post("/", response_model=StudentStruggleResponse, status_code=status.HTTP_201_CREATED)
def create_struggle(
    struggle: StudentStruggleCreate,
    db: Session = Depends(get_db)
):
    """Manually create/report a student struggle"""
    db_struggle = StudentStruggle(**struggle.model_dump())
    db.add(db_struggle)
    db.commit()
    db.refresh(db_struggle)
    
    return db_struggle


@router.get("/student/{student_id}", response_model=StudentStruggleList)
def get_student_struggles(
    student_id: str,
    unresolved_only: bool = False,
    topic: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all struggles for a student"""
    service = StruggleDetectionService(db)
    
    if unresolved_only or topic:
        struggles = service.get_unresolved_struggles(student_id, topic)
    else:
        struggles = db.query(StudentStruggle).filter(
            StudentStruggle.student_id == student_id
        ).order_by(StudentStruggle.detected_at.desc()).all()
    
    unresolved = sum(1 for s in struggles if not s.resolved)
    
    return StudentStruggleList(
        struggles=struggles,
        total=len(struggles),
        unresolved=unresolved
    )


@router.get("/{struggle_id}", response_model=StudentStruggleResponse)
def get_struggle(
    struggle_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific struggle by ID"""
    struggle = db.query(StudentStruggle).filter(
        StudentStruggle.struggle_id == struggle_id
    ).first()
    
    if not struggle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Struggle {struggle_id} not found"
        )
    
    return struggle


@router.post("/{struggle_id}/resolve")
def resolve_struggle(
    struggle_id: int,
    resolution_method: str,
    db: Session = Depends(get_db)
):
    """Mark a struggle as resolved"""
    service = StruggleDetectionService(db)
    
    try:
        struggle = service.mark_struggle_resolved(struggle_id, resolution_method)
        return {"message": "Struggle resolved", "struggle_id": struggle_id}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )











