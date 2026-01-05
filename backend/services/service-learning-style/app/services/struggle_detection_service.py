"""Struggle Detection Service - 7 Detection Rules"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc
from datetime import datetime, timedelta

from app.models import StudentStruggle, StudentBehaviorTracking
from app.core.config import settings


class StruggleDetectionService:
    """
    Implements 7 struggle detection rules to identify student difficulties
    
    Rules:
    1. Quiz Failure Detection
    2. Low Engagement Detection
    3. Excessive Time Spent
    4. Repeated Content Access
    5. Help Request Detection
    6. Multiple Failed Attempts
    7. Confusion Indicators
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def detect_quiz_failure(
        self,
        student_id: str,
        quiz_id: str,
        score: float,
        topic: str,
        max_score: float = 100.0
    ) -> Optional[StudentStruggle]:
        """
        Rule 1: Quiz Failure Detection
        
        Triggers when quiz score < threshold
        - High severity: < 40%
        - Medium severity: 40-60%
        - Low severity: 60-70%
        """
        percentage = (score / max_score) * 100
        
        severity = None
        confidence = 0.0
        
        if percentage < settings.QUIZ_FAILURE_HIGH_THRESHOLD:
            severity = "High"
            confidence = 0.95
        elif percentage < settings.QUIZ_FAILURE_MEDIUM_THRESHOLD:
            severity = "Medium"
            confidence = 0.85
        elif percentage < settings.QUIZ_FAILURE_LOW_THRESHOLD:
            severity = "Low"
            confidence = 0.70
        else:
            return None  # No struggle detected
        
        struggle = StudentStruggle(
            student_id=student_id,
            topic=topic,
            concept=f"Quiz: {quiz_id}",
            struggle_type="quiz_failure",
            severity=severity,
            confidence_score=confidence,
            context={
                "quiz_id": quiz_id,
                "score": score,
                "max_score": max_score,
                "percentage": round(percentage, 1)
            },
            detected_at=datetime.now(),
            detection_method="quiz_score_threshold"
        )
        
        self.db.add(struggle)
        self.db.commit()
        return struggle
    
    def detect_low_engagement(
        self,
        student_id: str,
        topic: str,
        days_to_check: int = 7
    ) -> Optional[StudentStruggle]:
        """
        Rule 2: Low Engagement Detection
        
        Triggers when:
        - Total session time < 30 min/day (avg over 7 days)
        - Login count < 3 times/week
        - No content completion in 5 days
        """
        cutoff_date = datetime.now() - timedelta(days=days_to_check)
        
        behavior_records = self.db.query(StudentBehaviorTracking).filter(
            and_(
                StudentBehaviorTracking.student_id == student_id,
                StudentBehaviorTracking.tracking_date >= cutoff_date
            )
        ).all()
        
        if not behavior_records:
            return None
        
        # Calculate metrics
        total_time = sum(b.total_session_time for b in behavior_records)
        total_logins = sum(b.login_count for b in behavior_records)
        avg_time_per_day = total_time / days_to_check / 60  # minutes
        
        # Determine severity
        if avg_time_per_day < 15 and total_logins < 2:
            severity = "High"
            confidence = 0.85
        elif avg_time_per_day < 30 or total_logins < 3:
            severity = "Medium"
            confidence = 0.75
        else:
            return None
        
        struggle = StudentStruggle(
            student_id=student_id,
            topic=topic,
            concept="General engagement",
            struggle_type="low_engagement",
            severity=severity,
            confidence_score=confidence,
            context={
                "days_checked": days_to_check,
                "avg_time_per_day_min": round(avg_time_per_day, 1),
                "total_logins": total_logins,
                "total_time_min": round(total_time / 60, 1)
            },
            detected_at=datetime.now(),
            detection_method="engagement_metrics"
        )
        
        self.db.add(struggle)
        self.db.commit()
        return struggle
    
    def detect_excessive_time(
        self,
        student_id: str,
        resource_id: int,
        time_spent: int,
        topic: str,
        expected_duration: int
    ) -> Optional[StudentStruggle]:
        """
        Rule 3: Excessive Time Spent
        
        Triggers when time spent > 2.5x expected duration
        """
        if time_spent <= expected_duration * 2.5:
            return None
        
        time_ratio = time_spent / expected_duration
        
        if time_ratio > 4.0:
            severity = "High"
            confidence = 0.90
        elif time_ratio > 3.0:
            severity = "Medium"
            confidence = 0.80
        else:
            severity = "Low"
            confidence = 0.70
        
        struggle = StudentStruggle(
            student_id=student_id,
            topic=topic,
            concept=f"Resource {resource_id}",
            struggle_type="time_spent_high",
            severity=severity,
            confidence_score=confidence,
            context={
                "resource_id": resource_id,
                "time_spent_min": round(time_spent / 60, 1),
                "expected_duration_min": round(expected_duration / 60, 1),
                "time_ratio": round(time_ratio, 2)
            },
            detected_at=datetime.now(),
            detection_method="time_threshold"
        )
        
        self.db.add(struggle)
        self.db.commit()
        return struggle
    
    def detect_repeated_access(
        self,
        student_id: str,
        resource_id: int,
        access_count: int,
        topic: str,
        days_window: int = 7
    ) -> Optional[StudentStruggle]:
        """
        Rule 4: Repeated Content Access
        
        Triggers when same content accessed > 3 times without completion
        """
        if access_count < 3:
            return None
        
        if access_count >= 5:
            severity = "High"
            confidence = 0.85
        elif access_count >= 4:
            severity = "Medium"
            confidence = 0.75
        else:
            severity = "Low"
            confidence = 0.65
        
        struggle = StudentStruggle(
            student_id=student_id,
            topic=topic,
            concept=f"Resource {resource_id}",
            struggle_type="repeated_access",
            severity=severity,
            confidence_score=confidence,
            context={
                "resource_id": resource_id,
                "access_count": access_count,
                "days_window": days_window
            },
            detected_at=datetime.now(),
            detection_method="access_pattern"
        )
        
        self.db.add(struggle)
        self.db.commit()
        return struggle
    
    def detect_help_request(
        self,
        student_id: str,
        topic: str,
        help_type: str,
        context_data: Dict[str, Any]
    ) -> StudentStruggle:
        """
        Rule 5: Help Request Detection
        
        Triggers on explicit help requests (forum, chat, instructor)
        """
        # Determine severity based on help type
        severity_map = {
            "instructor_message": "High",
            "forum_post": "Medium",
            "help_button": "Low"
        }
        
        severity = severity_map.get(help_type, "Medium")
        confidence = 0.95  # High confidence - explicit signal
        
        struggle = StudentStruggle(
            student_id=student_id,
            topic=topic,
            concept=context_data.get("concept", "General"),
            struggle_type="help_request",
            severity=severity,
            confidence_score=confidence,
            context={
                "help_type": help_type,
                **context_data
            },
            detected_at=datetime.now(),
            detection_method="explicit_help_request"
        )
        
        self.db.add(struggle)
        self.db.commit()
        return struggle
    
    def detect_multiple_attempts(
        self,
        student_id: str,
        activity_id: str,
        attempt_count: int,
        topic: str,
        success_rate: float
    ) -> Optional[StudentStruggle]:
        """
        Rule 6: Multiple Failed Attempts
        
        Triggers when attempts > 3 and success rate < 50%
        """
        if attempt_count < 3 or success_rate >= 0.5:
            return None
        
        if attempt_count >= 5 and success_rate < 0.3:
            severity = "High"
            confidence = 0.90
        elif attempt_count >= 4 or success_rate < 0.4:
            severity = "Medium"
            confidence = 0.80
        else:
            severity = "Low"
            confidence = 0.70
        
        struggle = StudentStruggle(
            student_id=student_id,
            topic=topic,
            concept=f"Activity: {activity_id}",
            struggle_type="multiple_attempts",
            severity=severity,
            confidence_score=confidence,
            context={
                "activity_id": activity_id,
                "attempt_count": attempt_count,
                "success_rate": round(success_rate * 100, 1)
            },
            detected_at=datetime.now(),
            detection_method="attempt_pattern"
        )
        
        self.db.add(struggle)
        self.db.commit()
        return struggle
    
    def detect_confusion_indicators(
        self,
        student_id: str,
        topic: str,
        indicators: Dict[str, Any]
    ) -> Optional[StudentStruggle]:
        """
        Rule 7: Confusion Indicators
        
        Triggers on behavioral patterns:
        - Rapid clicking (>10 clicks/min)
        - Short session times (<2 min) with high frequency
        - Erratic navigation patterns
        """
        confusion_score = 0.0
        detected_patterns = []
        
        # Check rapid clicking
        if indicators.get("clicks_per_minute", 0) > 10:
            confusion_score += 0.4
            detected_patterns.append("rapid_clicking")
        
        # Check short sessions
        if indicators.get("avg_session_duration", 300) < 120:
            confusion_score += 0.3
            detected_patterns.append("short_sessions")
        
        # Check navigation patterns
        if indicators.get("navigation_changes", 0) > 15:
            confusion_score += 0.3
            detected_patterns.append("erratic_navigation")
        
        if confusion_score < 0.5:
            return None
        
        if confusion_score >= 0.8:
            severity = "High"
            confidence = 0.80
        elif confusion_score >= 0.6:
            severity = "Medium"
            confidence = 0.70
        else:
            severity = "Low"
            confidence = 0.60
        
        struggle = StudentStruggle(
            student_id=student_id,
            topic=topic,
            concept="Behavioral patterns",
            struggle_type="confusion_indicator",
            severity=severity,
            confidence_score=confidence,
            context={
                "confusion_score": round(confusion_score, 2),
                "detected_patterns": detected_patterns,
                **indicators
            },
            detected_at=datetime.now(),
            detection_method="behavioral_analysis"
        )
        
        self.db.add(struggle)
        self.db.commit()
        return struggle
    
    def get_unresolved_struggles(
        self,
        student_id: str,
        topic: Optional[str] = None
    ) -> List[StudentStruggle]:
        """Get all unresolved struggles for a student"""
        query = self.db.query(StudentStruggle).filter(
            and_(
                StudentStruggle.student_id == student_id,
                StudentStruggle.resolved == False
            )
        )
        
        if topic:
            query = query.filter(StudentStruggle.topic.ilike(f"%{topic}%"))
        
        return query.order_by(
            desc(StudentStruggle.severity),
            desc(StudentStruggle.detected_at)
        ).all()
    
    def mark_struggle_resolved(
        self,
        struggle_id: int,
        resolution_method: str
    ) -> StudentStruggle:
        """Mark a struggle as resolved"""
        struggle = self.db.query(StudentStruggle).filter(
            StudentStruggle.struggle_id == struggle_id
        ).first()
        
        if not struggle:
            raise ValueError(f"Struggle {struggle_id} not found")
        
        struggle.resolved = True
        struggle.resolved_at = datetime.now()
        struggle.resolution_method = resolution_method
        
        self.db.commit()
        return struggle











