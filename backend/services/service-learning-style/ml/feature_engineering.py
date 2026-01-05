"""
Feature Engineering for Learning Style Classification

This module transforms raw behavioral data into meaningful features
for machine learning classification.

ACADEMIC CONCEPTS:
- Feature Scaling: Normalize features to 0-1 range
- Ratio Features: Relative preferences (more informative than absolute counts)
- Aggregation: Summarize behavior over time windows
- Domain Knowledge: VARK model guides feature design

Author: Subasinghe S A V R (IT22325846)
"""

import pandas as pd
import numpy as np
from typing import Dict, List
from datetime import datetime, timedelta


class LearningStyleFeatureEngineer:
    """
    Transforms raw student behavior data into ML-ready features.
    
    THEORY:
    Learning styles are identified by RELATIVE preferences, not absolute amounts.
    A student who watches 100 hours of video but reads 200 hours is likely
    a Reading learner, not a Visual learner.
    
    Therefore, we calculate RATIOS and PROPORTIONS instead of raw counts.
    """
    
    def __init__(self):
        """Initialize feature engineer with feature names."""
        self.feature_names = []
        
    def aggregate_behavior_data(self, behavior_records: List[Dict]) -> pd.DataFrame:
        """
        Aggregate behavior data per student over a time window.
        
        EXPLANATION:
        - Input: List of daily behavior records from database
        - Output: One row per student with aggregated metrics
        - Time Window: Last 14 days (configurable)
        
        Args:
            behavior_records: List of dicts from student_behavior_tracking table
            
        Returns:
            DataFrame with aggregated features per student
        """
        if not behavior_records:
            return pd.DataFrame()
        
        # Convert to DataFrame
        df = pd.DataFrame(behavior_records)
        
        # Aggregate by student_id
        agg_dict = {
            'video_watch_time': 'sum',
            'video_completion_rate': 'mean',
            'video_interactions': 'sum',
            'text_read_time': 'sum',
            'articles_read': 'sum',
            'note_taking_count': 'sum',
            'audio_playback_time': 'sum',
            'podcast_completions': 'sum',
            'simulation_time': 'sum',
            'interactive_exercises': 'sum',
            'hands_on_activities': 'sum',
            'forum_posts': 'sum',
            'discussion_participation': 'sum',
            'peer_interactions': 'sum',
            'diagram_views': 'sum',
            'image_interactions': 'sum',
            'visual_aid_usage': 'sum',
            'total_session_time': 'sum',
            'login_count': 'sum',
            'tracking_date': 'count'  # Number of days tracked
        }
        
        aggregated = df.groupby('student_id').agg(agg_dict).reset_index()
        aggregated.rename(columns={'tracking_date': 'days_tracked'}, inplace=True)
        
        return aggregated
    
    def engineer_features(self, aggregated_df: pd.DataFrame) -> pd.DataFrame:
        """
        Create engineered features from aggregated data.
        
        FEATURE ENGINEERING THEORY:
        
        1. TIME RATIOS (Most Important!)
           - What percentage of time is spent on each modality?
           - Example: visual_time_ratio = video_time / total_time
           - Range: 0.0 to 1.0
           
        2. INTERACTION SCORES
           - How engaged is the student with each modality?
           - Example: visual_interaction_score = (video_clicks + diagram_views) / total_interactions
           
        3. ENGAGEMENT DEPTH
           - Quality of engagement, not just quantity
           - Example: video_engagement_depth = completion_rate * time_ratio
           
        4. PREFERENCE INDICATORS
           - Behavioral patterns that indicate learning style
           - Example: note_taking_intensity = notes / articles_read
        
        Args:
            aggregated_df: DataFrame with aggregated behavior per student
            
        Returns:
            DataFrame with engineered features added
        """
        df = aggregated_df.copy()
        
        # Avoid division by zero
        df['total_session_time'] = df['total_session_time'].replace(0, 1)
        
        # ============================================================
        # CATEGORY 1: TIME RATIO FEATURES
        # ============================================================
        # These show what % of time is spent on each learning modality
        
        print("\n[Feature Engineering] Calculating time ratios...")
        
        # Visual time ratio (videos + visual aids)
        df['visual_time_ratio'] = (
            df['video_watch_time'] / df['total_session_time']
        )
        
        # Reading time ratio (text reading)
        df['reading_time_ratio'] = (
            df['text_read_time'] / df['total_session_time']
        )
        
        # Auditory time ratio (audio + podcasts)
        df['audio_time_ratio'] = (
            df['audio_playback_time'] / df['total_session_time']
        )
        
        # Kinesthetic time ratio (simulations + hands-on)
        df['kinesthetic_time_ratio'] = (
            df['simulation_time'] / df['total_session_time']
        )
        
        # ============================================================
        # CATEGORY 2: INTERACTION SCORES
        # ============================================================
        # These show engagement level with each modality
        
        print("[Feature Engineering] Calculating interaction scores...")
        
        # Total interactions (for normalization)
        df['total_interactions'] = (
            df['video_interactions'] + 
            df['diagram_views'] + 
            df['image_interactions'] +
            df['forum_posts'] +
            df['discussion_participation'] +
            df['interactive_exercises']
        )
        df['total_interactions'] = df['total_interactions'].replace(0, 1)
        
        # Visual interaction score
        df['visual_interaction_score'] = (
            (df['video_interactions'] + df['diagram_views'] + 
             df['image_interactions'] + df['visual_aid_usage']) / 
            df['total_interactions']
        )
        
        # Social/Auditory interaction score (discussions are often auditory)
        df['social_interaction_score'] = (
            (df['forum_posts'] + df['discussion_participation'] + 
             df['peer_interactions']) / 
            df['total_interactions']
        )
        
        # Kinesthetic interaction score
        df['kinesthetic_interaction_score'] = (
            (df['interactive_exercises'] + df['hands_on_activities']) / 
            df['total_interactions']
        )
        
        # ============================================================
        # CATEGORY 3: ENGAGEMENT DEPTH FEATURES
        # ============================================================
        # These combine time and quality metrics
        
        print("[Feature Engineering] Calculating engagement depth...")
        
        # Video engagement depth (completion rate * time ratio)
        # High value = watches videos AND completes them
        df['video_engagement_depth'] = (
            (df['video_completion_rate'] / 100.0) * df['visual_time_ratio']
        )
        
        # Reading engagement depth (articles read * time ratio)
        df['reading_engagement_depth'] = (
            (df['articles_read'] / (df['articles_read'].max() + 1)) * 
            df['reading_time_ratio']
        )
        
        # Audio engagement depth (podcast completions * time ratio)
        df['audio_engagement_depth'] = (
            (df['podcast_completions'] / (df['podcast_completions'].max() + 1)) * 
            df['audio_time_ratio']
        )
        
        # ============================================================
        # CATEGORY 4: PREFERENCE INDICATORS
        # ============================================================
        # Behavioral patterns that strongly indicate learning style
        
        print("[Feature Engineering] Calculating preference indicators...")
        
        # Note-taking intensity (notes per article)
        # High value = Reading/Writing learner
        df['note_taking_intensity'] = (
            df['note_taking_count'] / (df['articles_read'] + 1)
        )
        
        # Visual preference score
        # Combines multiple visual indicators
        df['visual_preference_score'] = (
            df['visual_time_ratio'] * 0.4 +
            df['visual_interaction_score'] * 0.3 +
            df['video_engagement_depth'] * 0.3
        )
        
        # Reading preference score
        df['reading_preference_score'] = (
            df['reading_time_ratio'] * 0.4 +
            df['note_taking_intensity'] * 0.3 +
            df['reading_engagement_depth'] * 0.3
        )
        
        # Auditory preference score
        df['auditory_preference_score'] = (
            df['audio_time_ratio'] * 0.4 +
            df['social_interaction_score'] * 0.3 +
            df['audio_engagement_depth'] * 0.3
        )
        
        # Kinesthetic preference score
        df['kinesthetic_preference_score'] = (
            df['kinesthetic_time_ratio'] * 0.4 +
            df['kinesthetic_interaction_score'] * 0.3 +
            (df['hands_on_activities'] / (df['hands_on_activities'].max() + 1)) * 0.3
        )
        
        # ============================================================
        # CATEGORY 5: DIVERSITY METRICS
        # ============================================================
        # Measure how balanced the student's learning approach is
        
        print("[Feature Engineering] Calculating diversity metrics...")
        
        # Activity diversity (standard deviation of time ratios)
        # High value = Mixed learner (uses all modalities)
        # Low value = Specialized learner (prefers one modality)
        time_ratios = df[[
            'visual_time_ratio', 
            'reading_time_ratio', 
            'audio_time_ratio', 
            'kinesthetic_time_ratio'
        ]]
        df['activity_diversity'] = time_ratios.std(axis=1)
        
        # Engagement balance (how evenly distributed is engagement?)
        preference_scores = df[[
            'visual_preference_score',
            'reading_preference_score',
            'auditory_preference_score',
            'kinesthetic_preference_score'
        ]]
        df['engagement_balance'] = preference_scores.std(axis=1)
        
        # ============================================================
        # CATEGORY 6: BEHAVIORAL PATTERNS
        # ============================================================
        # Additional patterns that indicate learning style
        
        print("[Feature Engineering] Calculating behavioral patterns...")
        
        # Video vs Text ratio (Visual vs Reading preference)
        df['video_vs_text_ratio'] = (
            df['video_watch_time'] / (df['text_read_time'] + 1)
        )
        
        # Active vs Passive ratio (Kinesthetic vs Visual/Auditory)
        df['active_vs_passive_ratio'] = (
            (df['simulation_time'] + df['interactive_exercises'] * 300) / 
            (df['video_watch_time'] + df['audio_playback_time'] + 1)
        )
        
        # Social learning indicator (Auditory learners often social)
        df['social_learning_score'] = (
            (df['forum_posts'] + df['discussion_participation'] * 2 + 
             df['peer_interactions']) / (df['days_tracked'] + 1)
        )
        
        # Visual aid dependency
        df['visual_aid_dependency'] = (
            (df['diagram_views'] + df['image_interactions'] + 
             df['visual_aid_usage']) / (df['days_tracked'] + 1)
        )
        
        # ============================================================
        # HANDLE MISSING VALUES & OUTLIERS
        # ============================================================
        
        print("[Feature Engineering] Handling missing values...")
        
        # Replace any NaN with 0
        df = df.fillna(0)
        
        # Replace infinity with 0
        df = df.replace([np.inf, -np.inf], 0)
        
        # Clip ratios to 0-1 range
        ratio_columns = [col for col in df.columns if 'ratio' in col or 'score' in col]
        for col in ratio_columns:
            df[col] = df[col].clip(0, 1)
        
        print(f"[Feature Engineering] Created {len(df.columns)} total features")
        
        return df
    
    def get_feature_columns(self) -> List[str]:
        """
        Get list of feature column names for ML model.
        
        Returns:
            List of feature names (excludes student_id, days_tracked, etc.)
        """
        # These are the features we'll use for ML
        feature_cols = [
            # Time ratios
            'visual_time_ratio',
            'reading_time_ratio',
            'audio_time_ratio',
            'kinesthetic_time_ratio',
            
            # Interaction scores
            'visual_interaction_score',
            'social_interaction_score',
            'kinesthetic_interaction_score',
            
            # Engagement depth
            'video_engagement_depth',
            'reading_engagement_depth',
            'audio_engagement_depth',
            
            # Preference indicators
            'note_taking_intensity',
            'visual_preference_score',
            'reading_preference_score',
            'auditory_preference_score',
            'kinesthetic_preference_score',
            
            # Diversity metrics
            'activity_diversity',
            'engagement_balance',
            
            # Behavioral patterns
            'video_vs_text_ratio',
            'active_vs_passive_ratio',
            'social_learning_score',
            'visual_aid_dependency',
            
            # Raw aggregates (normalized)
            'video_completion_rate',
            'login_count',
        ]
        
        return feature_cols
    
    def prepare_training_data(self, df: pd.DataFrame, target_column: str = 'learning_style'):
        """
        Prepare data for ML model training.
        
        EXPLANATION:
        - Separates features (X) from target (y)
        - Selects only relevant feature columns
        - Returns data ready for train_test_split
        
        Args:
            df: DataFrame with engineered features and target
            target_column: Name of the column containing learning style labels
            
        Returns:
            X (features), y (target labels)
        """
        feature_cols = self.get_feature_columns()
        
        # Check if all features exist
        missing_features = [col for col in feature_cols if col not in df.columns]
        if missing_features:
            raise ValueError(f"Missing features: {missing_features}")
        
        # Separate features and target
        X = df[feature_cols].copy()
        y = df[target_column].copy() if target_column in df.columns else None
        
        print(f"\n[Data Preparation]")
        print(f"  Features (X): {X.shape}")
        print(f"  Target (y): {y.shape if y is not None else 'N/A'}")
        print(f"  Feature columns: {len(feature_cols)}")
        
        return X, y


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def print_feature_summary(df: pd.DataFrame):
    """
    Print summary statistics of engineered features.
    
    Useful for understanding feature distributions and debugging.
    """
    print("\n" + "="*70)
    print("FEATURE SUMMARY STATISTICS")
    print("="*70)
    
    feature_groups = {
        'Time Ratios': ['visual_time_ratio', 'reading_time_ratio', 
                       'audio_time_ratio', 'kinesthetic_time_ratio'],
        'Preference Scores': ['visual_preference_score', 'reading_preference_score',
                             'auditory_preference_score', 'kinesthetic_preference_score'],
        'Engagement Depth': ['video_engagement_depth', 'reading_engagement_depth',
                            'audio_engagement_depth'],
        'Diversity': ['activity_diversity', 'engagement_balance']
    }
    
    for group_name, features in feature_groups.items():
        print(f"\n{group_name}:")
        existing_features = [f for f in features if f in df.columns]
        if existing_features:
            print(df[existing_features].describe().round(3))


def validate_feature_quality(df: pd.DataFrame) -> Dict[str, any]:
    """
    Validate quality of engineered features.
    
    Checks:
    - No NaN values
    - No infinite values
    - Ratios in valid range (0-1)
    - Sufficient variance (not all zeros)
    
    Returns:
        Dictionary with validation results
    """
    results = {
        'valid': True,
        'issues': []
    }
    
    # Check for NaN
    nan_cols = df.columns[df.isna().any()].tolist()
    if nan_cols:
        results['valid'] = False
        results['issues'].append(f"NaN values in: {nan_cols}")
    
    # Check for infinity
    inf_cols = df.columns[df.isin([np.inf, -np.inf]).any()].tolist()
    if inf_cols:
        results['valid'] = False
        results['issues'].append(f"Infinite values in: {inf_cols}")
    
    # Check ratio ranges
    ratio_cols = [col for col in df.columns if 'ratio' in col or 'score' in col]
    for col in ratio_cols:
        if col in df.columns:
            if df[col].min() < 0 or df[col].max() > 1.1:  # Allow slight overflow
                results['issues'].append(f"{col} outside 0-1 range: [{df[col].min():.2f}, {df[col].max():.2f}]")
    
    # Check for zero variance
    zero_var_cols = df.columns[df.std() == 0].tolist()
    if zero_var_cols:
        results['issues'].append(f"Zero variance (all same value): {zero_var_cols}")
    
    return results


# ============================================================
# EXAMPLE USAGE
# ============================================================

if __name__ == "__main__":
    """
    Example usage of feature engineering module.
    
    This demonstrates how to:
    1. Load behavior data from database
    2. Aggregate it per student
    3. Engineer features
    4. Prepare for ML training
    """
    
    print("="*70)
    print("FEATURE ENGINEERING MODULE - EXAMPLE USAGE")
    print("="*70)
    
    # Example behavior records (would come from database)
    sample_records = [
        {
            'student_id': 'STU001',
            'tracking_date': '2025-12-01',
            'video_watch_time': 3600,
            'video_completion_rate': 85.0,
            'video_interactions': 15,
            'text_read_time': 1200,
            'articles_read': 3,
            'note_taking_count': 5,
            'audio_playback_time': 600,
            'podcast_completions': 1,
            'simulation_time': 300,
            'interactive_exercises': 2,
            'hands_on_activities': 1,
            'forum_posts': 2,
            'discussion_participation': 3,
            'peer_interactions': 5,
            'diagram_views': 10,
            'image_interactions': 8,
            'visual_aid_usage': 12,
            'total_session_time': 7200,
            'login_count': 3
        }
    ]
    
    # Initialize feature engineer
    engineer = LearningStyleFeatureEngineer()
    
    # Aggregate data
    print("\n1. Aggregating behavior data...")
    aggregated = engineer.aggregate_behavior_data(sample_records)
    print(f"   Aggregated {len(aggregated)} students")
    
    # Engineer features
    print("\n2. Engineering features...")
    features_df = engineer.engineer_features(aggregated)
    print(f"   Created {len(features_df.columns)} features")
    
    # Print summary
    print_feature_summary(features_df)
    
    # Validate
    print("\n3. Validating feature quality...")
    validation = validate_feature_quality(features_df)
    if validation['valid']:
        print("   All features valid!")
    else:
        print("   Issues found:")
        for issue in validation['issues']:
            print(f"   - {issue}")
    
    print("\n" + "="*70)
    print("Feature engineering complete!")
    print("="*70)






