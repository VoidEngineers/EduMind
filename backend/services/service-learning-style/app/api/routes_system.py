"""API routes for system stats and health"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.dependencies import get_db
from app.schemas import SystemStats
from app.models import (
    StudentLearningProfile,
    LearningResource,
    ResourceRecommendation,
    StudentStruggle
)

router = APIRouter(prefix="/system", tags=["System"])


@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "learning-style-service"}


@router.get("/stats", response_model=SystemStats)
def get_system_stats(db: Session = Depends(get_db)):
    """Get overall system statistics"""
    # Count totals
    total_students = db.query(func.count(StudentLearningProfile.student_id)).scalar()
    total_resources = db.query(func.count(LearningResource.resource_id)).scalar()
    total_recommendations = db.query(func.count(ResourceRecommendation.recommendation_id)).scalar()
    total_struggles = db.query(func.count(StudentStruggle.struggle_id)).scalar()
    
    # Unresolved struggles
    unresolved_struggles = db.query(func.count(StudentStruggle.struggle_id)).filter(
        StudentStruggle.resolved == False
    ).scalar()
    
    # Learning style distribution
    style_distribution = {}
    styles = db.query(
        StudentLearningProfile.learning_style,
        func.count(StudentLearningProfile.student_id)
    ).group_by(StudentLearningProfile.learning_style).all()
    
    for style, count in styles:
        style_distribution[style] = count
    
    # Most common struggle topics
    struggle_topics = db.query(
        StudentStruggle.topic,
        func.count(StudentStruggle.struggle_id).label('count')
    ).group_by(StudentStruggle.topic).order_by(
        func.count(StudentStruggle.struggle_id).desc()
    ).limit(5).all()
    
    most_common_struggles = [
        {"topic": topic, "count": count}
        for topic, count in struggle_topics
    ]
    
    # Top resources
    top_resources = db.query(
        LearningResource.resource_id,
        LearningResource.title,
        LearningResource.effectiveness_rating
    ).order_by(
        LearningResource.effectiveness_rating.desc(),
        LearningResource.total_completions.desc()
    ).limit(5).all()
    
    top_resource_list = [
        {"resource_id": rid, "title": title, "rating": rating}
        for rid, title, rating in top_resources
    ]
    
    # Average recommendation relevance
    avg_relevance = db.query(func.avg(ResourceRecommendation.relevance_score)).scalar() or 0.0
    
    # Recommendation completion rate
    total_recs = db.query(func.count(ResourceRecommendation.recommendation_id)).scalar()
    completed_recs = db.query(func.count(ResourceRecommendation.recommendation_id)).filter(
        ResourceRecommendation.completed == True
    ).scalar()
    
    completion_rate = (completed_recs / total_recs * 100) if total_recs > 0 else 0.0
    
    return SystemStats(
        total_students=total_students,
        total_resources=total_resources,
        total_recommendations=total_recommendations,
        total_struggles=total_struggles,
        unresolved_struggles=unresolved_struggles,
        learning_style_distribution=style_distribution,
        most_common_struggle_topics=most_common_struggles,
        top_resources=top_resource_list,
        avg_recommendation_relevance=round(avg_relevance, 3),
        recommendation_completion_rate=round(completion_rate, 1)
    )











