"""API routes for learning resources"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.dependencies import get_db
from app.schemas import (
    LearningResourceCreate,
    LearningResourceUpdate,
    LearningResourceResponse,
    LearningResourceList,
    ResourceEffectiveness
)
from app.models import LearningResource, ResourceRecommendation

router = APIRouter(prefix="/resources", tags=["Resources"])


@router.post("/", response_model=LearningResourceResponse, status_code=status.HTTP_201_CREATED)
def create_resource(
    resource: LearningResourceCreate,
    db: Session = Depends(get_db)
):
    """Create a new learning resource"""
    db_resource = LearningResource(**resource.model_dump())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    
    return db_resource


@router.get("/{resource_id}", response_model=LearningResourceResponse)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific learning resource by ID"""
    resource = db.query(LearningResource).filter(
        LearningResource.resource_id == resource_id
    ).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource {resource_id} not found"
        )
    
    return resource


@router.put("/{resource_id}", response_model=LearningResourceResponse)
def update_resource(
    resource_id: int,
    updates: LearningResourceUpdate,
    db: Session = Depends(get_db)
):
    """Update a learning resource"""
    resource = db.query(LearningResource).filter(
        LearningResource.resource_id == resource_id
    ).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource {resource_id} not found"
        )
    
    # Update fields
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resource, field, value)
    
    db.commit()
    db.refresh(resource)
    
    return resource


@router.get("/", response_model=LearningResourceList)
def list_resources(
    skip: int = 0,
    limit: int = 50,
    topic: Optional[str] = None,
    resource_type: Optional[str] = None,
    difficulty: Optional[str] = None,
    learning_style: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """List all learning resources with optional filtering"""
    query = db.query(LearningResource)
    
    if active_only:
        query = query.filter(LearningResource.is_active == True)
    
    if topic:
        query = query.filter(LearningResource.topic.ilike(f"%{topic}%"))
    
    if resource_type:
        query = query.filter(LearningResource.resource_type == resource_type)
    
    if difficulty:
        query = query.filter(LearningResource.difficulty_level == difficulty)
    
    if learning_style:
        query = query.filter(LearningResource.learning_styles.contains([learning_style]))
    
    total = query.count()
    resources = query.offset(skip).limit(limit).all()
    
    return LearningResourceList(
        resources=resources,
        total=total,
        page=skip // limit + 1,
        page_size=limit
    )


@router.get("/{resource_id}/effectiveness", response_model=ResourceEffectiveness)
def get_resource_effectiveness(
    resource_id: int,
    db: Session = Depends(get_db)
):
    """Get effectiveness metrics for a resource"""
    resource = db.query(LearningResource).filter(
        LearningResource.resource_id == resource_id
    ).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource {resource_id} not found"
        )
    
    # Get recommendation stats
    recommendations = db.query(ResourceRecommendation).filter(
        ResourceRecommendation.resource_id == resource_id
    ).all()
    
    total_recs = len(recommendations)
    viewed = sum(1 for r in recommendations if r.viewed)
    completed = sum(1 for r in recommendations if r.completed)
    
    view_rate = (viewed / total_recs * 100) if total_recs > 0 else 0.0
    completion_rate = (completed / viewed * 100) if viewed > 0 else 0.0
    
    # Average time spent
    time_spent_values = [r.time_spent for r in recommendations if r.time_spent > 0]
    avg_time = sum(time_spent_values) / len(time_spent_values) if time_spent_values else 0
    
    # Calculate effectiveness score (0-100)
    effectiveness_score = (
        resource.effectiveness_rating * 10 +  # 0-50 points
        completion_rate * 0.3 +  # 0-30 points
        view_rate * 0.2  # 0-20 points
    )
    
    return ResourceEffectiveness(
        resource_id=resource_id,
        title=resource.title,
        resource_type=resource.resource_type,
        topic=resource.topic,
        total_recommendations=total_recs,
        view_rate=round(view_rate, 1),
        completion_rate=round(completion_rate, 1),
        avg_time_spent=int(avg_time),
        avg_helpfulness_rating=resource.avg_helpfulness_rating,
        effectiveness_score=round(effectiveness_score, 1)
    )


@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    hard_delete: bool = False,
    db: Session = Depends(get_db)
):
    """Delete or deactivate a learning resource"""
    resource = db.query(LearningResource).filter(
        LearningResource.resource_id == resource_id
    ).first()
    
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource {resource_id} not found"
        )
    
    if hard_delete:
        db.delete(resource)
    else:
        resource.is_active = False
    
    db.commit()
    
    return {"message": "Resource deleted successfully" if hard_delete else "Resource deactivated"}











