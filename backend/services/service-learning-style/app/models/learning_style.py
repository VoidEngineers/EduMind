"""SQLAlchemy models for Learning Style Recognition System"""
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, 
    TIMESTAMP, Text, ForeignKey, ARRAY, CheckConstraint
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class StudentLearningProfile(Base):
    """Student learning style profile and preferences"""
    __tablename__ = "student_learning_profiles"
    
    # Primary Key
    student_id = Column(String(50), primary_key=True, index=True)
    
    # Learning Style (VARK Model)
    learning_style = Column(
        String(20), 
        nullable=False,
        index=True
    )
    style_confidence = Column(Float, nullable=False)
    style_probabilities = Column(
        JSONB, 
        default={"Visual": 0.0, "Auditory": 0.0, "Reading": 0.0, "Kinesthetic": 0.0}
    )
    
    # Preferences
    preferred_difficulty = Column(String(20), default="Medium")
    preferred_resource_types = Column(JSONB, default=[])
    
    # Performance Metrics
    avg_completion_rate = Column(Float, default=0.0)
    total_resources_completed = Column(Integer, default=0)
    total_recommendations_received = Column(Integer, default=0)
    
    # Struggle History
    struggle_topics = Column(JSONB, default=[])
    struggle_count = Column(Integer, default=0, index=True)
    
    # Tracking
    days_tracked = Column(Integer, default=0)
    last_activity_date = Column(TIMESTAMP)
    model_version = Column(String(20), default="1.0")
    
    # Metadata
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    struggles = relationship("StudentStruggle", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("ResourceRecommendation", back_populates="student", cascade="all, delete-orphan")
    behavior_tracking = relationship("StudentBehaviorTracking", back_populates="student", cascade="all, delete-orphan")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('style_confidence >= 0.0 AND style_confidence <= 1.0', name='chk_style_confidence'),
        CheckConstraint('avg_completion_rate >= 0.0 AND avg_completion_rate <= 100.0', name='chk_completion_rate'),
        CheckConstraint("learning_style IN ('Visual', 'Auditory', 'Reading', 'Kinesthetic', 'Mixed')", name='chk_learning_style'),
        CheckConstraint("preferred_difficulty IN ('Easy', 'Medium', 'Hard')", name='chk_difficulty'),
    )
    
    def __repr__(self):
        return f"<StudentLearningProfile(student_id='{self.student_id}', style='{self.learning_style}')>"


class LearningResource(Base):
    """Repository of learning materials"""
    __tablename__ = "learning_resources"
    
    # Primary Key
    resource_id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Resource Details
    resource_type = Column(String(20), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    
    # Categorization
    topic = Column(String(100), nullable=False, index=True)
    subject = Column(String(50), nullable=False, index=True)
    subtopic = Column(String(100))
    
    # Difficulty & Style
    difficulty_level = Column(String(20), nullable=False, index=True)
    learning_styles = Column(ARRAY(String), default=[])
    
    # Content Location
    url = Column(Text)
    content_path = Column(Text)
    thumbnail_url = Column(Text)
    
    # Metadata
    estimated_duration = Column(Integer)  # in minutes
    tags = Column(JSONB, default=[])
    prerequisites = Column(JSONB, default=[])
    
    # Quality Metrics
    popularity_score = Column(Float, default=0.0)
    effectiveness_rating = Column(Float, default=0.0)
    total_views = Column(Integer, default=0)
    total_completions = Column(Integer, default=0)
    avg_helpfulness_rating = Column(Float, default=0.0)
    
    # Status
    is_active = Column(Boolean, default=True, index=True)
    verified = Column(Boolean, default=False)
    
    # Metadata
    created_by = Column(String(50))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    recommendations = relationship("ResourceRecommendation", back_populates="resource", cascade="all, delete-orphan")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('effectiveness_rating >= 0.0 AND effectiveness_rating <= 5.0', name='chk_effectiveness'),
        CheckConstraint("resource_type IN ('video', 'article', 'interactive', 'practice', 'quiz', 'cheatsheet', 'tutorial')", name='chk_resource_type'),
        CheckConstraint("difficulty_level IN ('Easy', 'Medium', 'Hard')", name='chk_resource_difficulty'),
        CheckConstraint('url IS NOT NULL OR content_path IS NOT NULL', name='chk_url_or_path'),
    )
    
    def __repr__(self):
        return f"<LearningResource(id={self.resource_id}, title='{self.title}')>"


class StudentStruggle(Base):
    """Detected student difficulties and struggles"""
    __tablename__ = "student_struggles"
    
    # Primary Key
    struggle_id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Keys
    student_id = Column(String(50), ForeignKey("student_learning_profiles.student_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Struggle Details
    topic = Column(String(100), nullable=False, index=True)
    concept = Column(String(200))
    struggle_type = Column(String(30), nullable=False, index=True)
    
    # Severity
    severity = Column(String(20), nullable=False, index=True)
    confidence_score = Column(Float, default=0.0)
    
    # Context
    context = Column(JSONB, default={})
    
    # Detection
    detected_at = Column(TIMESTAMP, server_default=func.now(), index=True)
    detection_method = Column(String(50))
    
    # Resolution
    resolved = Column(Boolean, default=False, index=True)
    resolved_at = Column(TIMESTAMP)
    resolution_method = Column(String(50))
    
    # Associated Actions
    recommendations_sent = Column(Integer, default=0)
    interventions_triggered = Column(Integer, default=0)
    
    # Metadata
    notes = Column(Text)
    
    # Relationships
    student = relationship("StudentLearningProfile", back_populates="struggles")
    recommendations = relationship("ResourceRecommendation", back_populates="struggle")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('confidence_score >= 0.0 AND confidence_score <= 1.0', name='chk_struggle_confidence'),
        CheckConstraint("severity IN ('Low', 'Medium', 'High')", name='chk_severity'),
        CheckConstraint("""struggle_type IN (
            'quiz_failure', 'low_engagement', 'time_spent_high', 
            'repeated_access', 'help_request', 'multiple_attempts', 
            'confusion_indicator', 'drop_pattern'
        )""", name='chk_struggle_type'),
    )
    
    def __repr__(self):
        return f"<StudentStruggle(id={self.struggle_id}, student='{self.student_id}', topic='{self.topic}', severity='{self.severity}')>"


class ResourceRecommendation(Base):
    """Tracks recommendations sent to students"""
    __tablename__ = "resource_recommendations"
    
    # Primary Key
    recommendation_id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Keys
    student_id = Column(String(50), ForeignKey("student_learning_profiles.student_id", ondelete="CASCADE"), nullable=False, index=True)
    resource_id = Column(Integer, ForeignKey("learning_resources.resource_id", ondelete="CASCADE"), nullable=False, index=True)
    struggle_id = Column(Integer, ForeignKey("student_struggles.struggle_id", ondelete="SET NULL"), index=True)
    
    # Recommendation Details
    reason = Column(Text, nullable=False)
    relevance_score = Column(Float, nullable=False)
    score_breakdown = Column(JSONB, default={})
    
    # Ranking
    rank_position = Column(Integer)
    
    # Delivery
    recommended_at = Column(TIMESTAMP, server_default=func.now(), index=True)
    delivery_method = Column(String(30), default="in_app")
    priority = Column(String(20), default="Medium")
    
    # Engagement Tracking
    viewed = Column(Boolean, default=False, index=True)
    viewed_at = Column(TIMESTAMP)
    
    started = Column(Boolean, default=False)
    started_at = Column(TIMESTAMP)
    
    completed = Column(Boolean, default=False, index=True)
    completed_at = Column(TIMESTAMP)
    completion_percentage = Column(Float, default=0.0)
    
    # Time spent (seconds)
    time_spent = Column(Integer, default=0)
    
    # Feedback
    helpfulness_rating = Column(Integer)
    feedback_comment = Column(Text)
    feedback_at = Column(TIMESTAMP)
    
    # A/B Testing
    experiment_group = Column(String(20))
    
    # Metadata
    dismissed = Column(Boolean, default=False)
    dismissed_at = Column(TIMESTAMP)
    
    # Relationships
    student = relationship("StudentLearningProfile", back_populates="recommendations")
    resource = relationship("LearningResource", back_populates="recommendations")
    struggle = relationship("StudentStruggle", back_populates="recommendations")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('relevance_score >= 0.0 AND relevance_score <= 1.0', name='chk_relevance_score'),
        CheckConstraint('completion_percentage >= 0.0 AND completion_percentage <= 100.0', name='chk_completion_pct'),
        CheckConstraint('helpfulness_rating >= 1 AND helpfulness_rating <= 5 OR helpfulness_rating IS NULL', name='chk_rating'),
        CheckConstraint("priority IN ('Low', 'Medium', 'High')", name='chk_priority'),
    )
    
    def __repr__(self):
        return f"<ResourceRecommendation(id={self.recommendation_id}, student='{self.student_id}', resource={self.resource_id})>"


class StudentBehaviorTracking(Base):
    """Daily behavioral data for learning style classification"""
    __tablename__ = "student_behavior_tracking"
    
    # Primary Key
    behavior_id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("student_learning_profiles.student_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Time Period
    tracking_date = Column(TIMESTAMP, nullable=False, index=True)
    week_number = Column(Integer)
    
    # Video Engagement
    video_watch_time = Column(Integer, default=0)  # seconds
    video_completion_rate = Column(Float, default=0.0)
    video_interactions = Column(Integer, default=0)
    
    # Reading Engagement
    text_read_time = Column(Integer, default=0)
    articles_read = Column(Integer, default=0)
    note_taking_count = Column(Integer, default=0)
    
    # Audio Engagement
    audio_playback_time = Column(Integer, default=0)
    podcast_completions = Column(Integer, default=0)
    
    # Interactive Engagement
    simulation_time = Column(Integer, default=0)
    interactive_exercises = Column(Integer, default=0)
    hands_on_activities = Column(Integer, default=0)
    
    # Collaboration
    forum_posts = Column(Integer, default=0)
    discussion_participation = Column(Integer, default=0)
    peer_interactions = Column(Integer, default=0)
    
    # Visual Interactions
    diagram_views = Column(Integer, default=0)
    image_interactions = Column(Integer, default=0)
    visual_aid_usage = Column(Integer, default=0)
    
    # Overall Activity
    total_session_time = Column(Integer, default=0)
    login_count = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    student = relationship("StudentLearningProfile", back_populates="behavior_tracking")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('video_completion_rate >= 0.0 AND video_completion_rate <= 100.0', name='chk_video_completion'),
    )
    
    def __repr__(self):
        return f"<StudentBehaviorTracking(student='{self.student_id}', date='{self.tracking_date}')>"













