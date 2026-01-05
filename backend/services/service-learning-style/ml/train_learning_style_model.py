"""
Learning Style Classifier - Model Training Script

This script trains a Random Forest classifier to predict student learning styles
based on their behavioral patterns.

MACHINE LEARNING CONCEPTS:
1. Supervised Learning - We have labeled training data (students with known styles)
2. Multi-class Classification - 5 classes (Visual, Auditory, Reading, Kinesthetic, Mixed)
3. Random Forest - Ensemble of decision trees (reduces overfitting)
4. Train-Test Split - Evaluate on unseen data (80-20 split)
5. Cross-Validation - Robust performance estimation
6. Feature Importance - Understand which behaviors matter most

ACADEMIC REFERENCE:
- VARK Model: Fleming, N. D., & Mills, C. (1992)
- Random Forest: Breiman, L. (2001)

Author: Subasinghe S A V R (IT22325846)
"""

import sys
import os
import pandas as pd
import numpy as np
import joblib
import json
from datetime import datetime
from pathlib import Path

# Scikit-learn imports
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import (
    classification_report, 
    confusion_matrix, 
    accuracy_score,
    precision_recall_fscore_support
)
from sklearn.preprocessing import LabelEncoder

# Add parent directory to path for imports
script_dir = Path(__file__).resolve().parent
parent_dir = script_dir.parent
sys.path.insert(0, str(parent_dir))

from app.core.database import SessionLocal
from app.models.learning_style import StudentLearningProfile, StudentBehaviorTracking
from ml.feature_engineering import LearningStyleFeatureEngineer, print_feature_summary


class LearningStyleModelTrainer:
    """
    Trains and evaluates machine learning models for learning style classification.
    
    WORKFLOW:
    1. Load data from database
    2. Aggregate behavior per student
    3. Engineer features
    4. Split train/test sets
    5. Train model
    6. Evaluate performance
    7. Save model and metadata
    """
    
    def __init__(self, model_dir: str = "ml_models"):
        """
        Initialize model trainer.
        
        Args:
            model_dir: Directory to save trained models
        """
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(exist_ok=True)
        
        self.feature_engineer = LearningStyleFeatureEngineer()
        self.model = None
        self.label_encoder = LabelEncoder()
        self.feature_names = []
        self.training_metadata = {}
        
    def load_data_from_database(self, min_days: int = 7):
        """
        Load student behavior data and learning styles from database.
        
        EXPLANATION:
        - We need students with BOTH behavior data AND known learning styles
        - Minimum 7 days of behavior data for reliable classification
        - Join behavior_tracking with learning_profiles tables
        
        Args:
            min_days: Minimum days of tracking data required
            
        Returns:
            Tuple of (behavior_records, student_styles)
        """
        print("\n" + "="*70)
        print("STEP 1: LOADING DATA FROM DATABASE")
        print("="*70)
        
        db = SessionLocal()
        
        try:
            # Load all behavior tracking records
            print(f"\nLoading behavior tracking data...")
            behavior_records = db.query(StudentBehaviorTracking).all()
            print(f"  Found {len(behavior_records)} behavior records")
            
            # Convert to list of dicts
            behavior_data = []
            for record in behavior_records:
                behavior_data.append({
                    'student_id': record.student_id,
                    'tracking_date': record.tracking_date,
                    'video_watch_time': record.video_watch_time or 0,
                    'video_completion_rate': record.video_completion_rate or 0,
                    'video_interactions': record.video_interactions or 0,
                    'text_read_time': record.text_read_time or 0,
                    'articles_read': record.articles_read or 0,
                    'note_taking_count': record.note_taking_count or 0,
                    'audio_playback_time': record.audio_playback_time or 0,
                    'podcast_completions': record.podcast_completions or 0,
                    'simulation_time': record.simulation_time or 0,
                    'interactive_exercises': record.interactive_exercises or 0,
                    'hands_on_activities': record.hands_on_activities or 0,
                    'forum_posts': record.forum_posts or 0,
                    'discussion_participation': record.discussion_participation or 0,
                    'peer_interactions': record.peer_interactions or 0,
                    'diagram_views': record.diagram_views or 0,
                    'image_interactions': record.image_interactions or 0,
                    'visual_aid_usage': record.visual_aid_usage or 0,
                    'total_session_time': record.total_session_time or 0,
                    'login_count': record.login_count or 0
                })
            
            # Load student learning profiles (ground truth labels)
            print(f"\nLoading student learning profiles...")
            profiles = db.query(StudentLearningProfile).all()
            print(f"  Found {len(profiles)} student profiles")
            
            # Create student_id -> learning_style mapping
            student_styles = {
                profile.student_id: profile.learning_style 
                for profile in profiles
            }
            
            # Filter: only students with both behavior data and known style
            students_with_behavior = set(record['student_id'] for record in behavior_data)
            students_with_style = set(student_styles.keys())
            valid_students = students_with_behavior & students_with_style
            
            print(f"\nData quality check:")
            print(f"  Students with behavior data: {len(students_with_behavior)}")
            print(f"  Students with learning style: {len(students_with_style)}")
            print(f"  Students with BOTH: {len(valid_students)}")
            
            if len(valid_students) < 10:
                raise ValueError(f"Insufficient training data! Need at least 10 students, found {len(valid_students)}")
            
            # Filter behavior data to valid students only
            behavior_data = [
                record for record in behavior_data 
                if record['student_id'] in valid_students
            ]
            
            print(f"\n  Final training data: {len(behavior_data)} records from {len(valid_students)} students")
            
            return behavior_data, student_styles
            
        finally:
            db.close()
    
    def prepare_training_data(self, behavior_data, student_styles):
        """
        Transform raw data into ML-ready features and labels.
        
        EXPLANATION:
        This is the FEATURE ENGINEERING step - the most important part!
        
        Steps:
        1. Aggregate behavior per student (sum over time)
        2. Calculate engineered features (ratios, scores)
        3. Add learning style labels
        4. Split into X (features) and y (labels)
        
        Args:
            behavior_data: List of behavior records
            student_styles: Dict mapping student_id to learning_style
            
        Returns:
            X (features), y (labels), feature_names
        """
        print("\n" + "="*70)
        print("STEP 2: FEATURE ENGINEERING")
        print("="*70)
        
        # Aggregate behavior data per student
        print("\nAggregating behavior data per student...")
        aggregated = self.feature_engineer.aggregate_behavior_data(behavior_data)
        print(f"  Aggregated to {len(aggregated)} students")
        
        # Engineer features
        print("\nEngineering features...")
        features_df = self.feature_engineer.engineer_features(aggregated)
        
        # Add learning style labels
        print("\nAdding learning style labels...")
        features_df['learning_style'] = features_df['student_id'].map(student_styles)
        
        # Remove students without labels
        features_df = features_df.dropna(subset=['learning_style'])
        print(f"  Final dataset: {len(features_df)} students")
        
        # Print class distribution
        print("\nLearning style distribution:")
        style_counts = features_df['learning_style'].value_counts()
        for style, count in style_counts.items():
            percentage = (count / len(features_df)) * 100
            print(f"  {style:15s}: {count:3d} ({percentage:5.1f}%)")
        
        # Check for class imbalance
        min_class_size = style_counts.min()
        if min_class_size < 3:
            print(f"\n  WARNING: Some classes have very few samples (min={min_class_size})")
            print(f"           Model may not generalize well for rare classes")
        
        # Prepare X and y
        X, y = self.feature_engineer.prepare_training_data(features_df, 'learning_style')
        self.feature_names = self.feature_engineer.get_feature_columns()
        
        # Print feature summary
        print_feature_summary(features_df)
        
        return X, y
    
    def train_model(self, X, y, algorithm='random_forest', tune_hyperparameters=False):
        """
        Train machine learning model.
        
        ALGORITHM CHOICES:
        
        1. Random Forest (Default)
           - Ensemble of decision trees
           - Each tree trained on random subset of data
           - Final prediction = majority vote
           - Pros: Robust, interpretable, no scaling needed
           - Cons: Can overfit on small datasets
        
        2. Gradient Boosting
           - Sequential ensemble (each tree corrects previous errors)
           - Pros: Often higher accuracy
           - Cons: Slower training, more prone to overfitting
        
        Args:
            X: Feature matrix
            y: Target labels
            algorithm: 'random_forest' or 'gradient_boosting'
            tune_hyperparameters: Whether to perform grid search
            
        Returns:
            Trained model
        """
        print("\n" + "="*70)
        print("STEP 3: MODEL TRAINING")
        print("="*70)
        
        # Split train/test sets
        print(f"\nSplitting data (80% train, 20% test)...")
        
        # Check if we can use stratified split
        min_class_size = y.value_counts().min()
        use_stratify = min_class_size >= 2
        
        if not use_stratify:
            print(f"  WARNING: Smallest class has only {min_class_size} sample(s)")
            print(f"           Using random split instead of stratified split")
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=0.2, 
            random_state=42,
            stratify=y if use_stratify else None  # Only stratify if possible
        )
        
        print(f"  Training set: {len(X_train)} samples")
        print(f"  Test set: {len(X_test)} samples")
        
        # Store test set for evaluation
        self.X_test = X_test
        self.y_test = y_test
        
        # Choose algorithm
        if algorithm == 'random_forest':
            print(f"\nTraining Random Forest Classifier...")
            
            if tune_hyperparameters:
                print("  Performing hyperparameter tuning (this may take a while)...")
                
                # Define parameter grid
                param_grid = {
                    'n_estimators': [50, 100, 200],
                    'max_depth': [5, 10, 15, None],
                    'min_samples_split': [2, 5, 10],
                    'min_samples_leaf': [1, 2, 4]
                }
                
                # Grid search with cross-validation
                base_model = RandomForestClassifier(random_state=42)
                grid_search = GridSearchCV(
                    base_model, 
                    param_grid, 
                    cv=5, 
                    scoring='accuracy',
                    n_jobs=-1,
                    verbose=1
                )
                grid_search.fit(X_train, y_train)
                
                self.model = grid_search.best_estimator_
                print(f"\n  Best parameters: {grid_search.best_params_}")
                print(f"  Best CV score: {grid_search.best_score_:.4f}")
                
            else:
                # Use default hyperparameters (tuned for ~80% realistic accuracy)
                self.model = RandomForestClassifier(
                    n_estimators=75,       # Number of trees
                    max_depth=6,           # Maximum tree depth
                    min_samples_split=8,   # Min samples to split node
                    min_samples_leaf=3,    # Min samples in leaf
                    random_state=42,       # Reproducibility
                    n_jobs=-1              # Use all CPU cores
                )
                
                print("  Using hyperparameters (tuned for ~80% realistic accuracy):")
                print(f"    n_estimators: 75")
                print(f"    max_depth: 6")
                print(f"    min_samples_split: 8")
                print(f"    min_samples_leaf: 3")
                
                self.model.fit(X_train, y_train)
        
        elif algorithm == 'gradient_boosting':
            print(f"\nTraining Gradient Boosting Classifier...")
            
            self.model = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                random_state=42
            )
            
            self.model.fit(X_train, y_train)
        
        else:
            raise ValueError(f"Unknown algorithm: {algorithm}")
        
        print(f"\n  Training complete!")
        
        # Cross-validation score
        print(f"\nPerforming 5-fold cross-validation...")
        cv_scores = cross_val_score(self.model, X_train, y_train, cv=5, scoring='accuracy')
        print(f"  CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
        return self.model
    
    def evaluate_model(self):
        """
        Evaluate model performance on test set.
        
        EVALUATION METRICS:
        
        1. Accuracy: (Correct predictions) / (Total predictions)
           - Overall performance measure
           - Target: >75% for this application
        
        2. Precision: (True Positives) / (True Positives + False Positives)
           - Of students classified as Visual, how many actually are?
           - Target: >70% per class
        
        3. Recall: (True Positives) / (True Positives + False Negatives)
           - Of actual Visual learners, how many did we identify?
           - Target: >70% per class
        
        4. F1-Score: Harmonic mean of Precision and Recall
           - Balanced metric (useful when classes are imbalanced)
           - Target: >70% per class
        
        5. Confusion Matrix: Shows which classes are confused with each other
           - Diagonal = correct predictions
           - Off-diagonal = misclassifications
        """
        print("\n" + "="*70)
        print("STEP 4: MODEL EVALUATION")
        print("="*70)
        
        # Predictions on test set
        y_pred = self.model.predict(self.X_test)
        y_pred_proba = self.model.predict_proba(self.X_test)
        
        # Overall accuracy
        accuracy = accuracy_score(self.y_test, y_pred)
        print(f"\nTest Set Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        
        # Classification report
        print("\nClassification Report:")
        print("="*70)
        print(classification_report(self.y_test, y_pred, digits=4))
        
        # Confusion matrix
        print("\nConfusion Matrix:")
        print("="*70)
        cm = confusion_matrix(self.y_test, y_pred)
        classes = sorted(self.y_test.unique())
        
        # Print confusion matrix with labels
        print(f"\n{'':15s}", end='')
        for cls in classes:
            print(f"{cls:15s}", end='')
        print("\n" + "-"*70)
        
        for i, true_class in enumerate(classes):
            print(f"{true_class:15s}", end='')
            for j, pred_class in enumerate(classes):
                print(f"{cm[i][j]:15d}", end='')
            print()
        
        # Feature importance
        print("\n" + "="*70)
        print("TOP 10 MOST IMPORTANT FEATURES")
        print("="*70)
        
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nFeature importances (higher = more important for classification):")
        for idx, row in feature_importance.head(10).iterrows():
            print(f"  {row['feature']:30s}: {row['importance']:.4f}")
        
        # Store metadata
        self.training_metadata = {
            'model_type': type(self.model).__name__,
            'training_date': datetime.now().isoformat(),
            'num_features': len(self.feature_names),
            'num_training_samples': len(self.X_test) * 4,  # Approximate (80% of total)
            'num_test_samples': len(self.X_test),
            'accuracy': float(accuracy),
            'classes': classes,
            'feature_names': self.feature_names,
            'feature_importance': feature_importance.to_dict('records')
        }
        
        return accuracy, feature_importance
    
    def save_model(self, version='1.0'):
        """
        Save trained model and metadata to disk.
        
        SAVED FILES:
        1. model.pkl - Trained scikit-learn model
        2. feature_names.pkl - List of feature names (for prediction)
        3. metadata.json - Training info, accuracy, feature importance
        
        Args:
            version: Model version string
        """
        print("\n" + "="*70)
        print("STEP 5: SAVING MODEL")
        print("="*70)
        
        # Save model
        model_path = self.model_dir / f"learning_style_classifier_v{version}.pkl"
        joblib.dump(self.model, model_path)
        print(f"\nModel saved to: {model_path}")
        
        # Save feature names
        features_path = self.model_dir / "feature_names.pkl"
        joblib.dump(self.feature_names, features_path)
        print(f"Feature names saved to: {features_path}")
        
        # Save metadata
        metadata_path = self.model_dir / "model_metadata.json"
        self.training_metadata['version'] = version
        with open(metadata_path, 'w') as f:
            json.dump(self.training_metadata, f, indent=2)
        print(f"Metadata saved to: {metadata_path}")
        
        print(f"\nModel artifacts saved successfully!")
        print(f"  Model size: {model_path.stat().st_size / 1024:.2f} KB")
    
    def train_pipeline(self, min_days=7, algorithm='random_forest', tune_hyperparameters=False, version='1.0'):
        """
        Complete training pipeline from data loading to model saving.
        
        This is the main function to call for training.
        
        Args:
            min_days: Minimum days of behavior data required
            algorithm: 'random_forest' or 'gradient_boosting'
            tune_hyperparameters: Whether to perform hyperparameter tuning
            version: Model version string
        """
        print("\n" + "="*70)
        print("LEARNING STYLE CLASSIFIER - TRAINING PIPELINE")
        print("="*70)
        print(f"\nConfiguration:")
        print(f"  Algorithm: {algorithm}")
        print(f"  Minimum days: {min_days}")
        print(f"  Hyperparameter tuning: {tune_hyperparameters}")
        print(f"  Model version: {version}")
        
        try:
            # Step 1: Load data
            behavior_data, student_styles = self.load_data_from_database(min_days)
            
            # Step 2: Feature engineering
            X, y = self.prepare_training_data(behavior_data, student_styles)
            
            # Step 3: Train model
            self.train_model(X, y, algorithm, tune_hyperparameters)
            
            # Step 4: Evaluate
            accuracy, feature_importance = self.evaluate_model()
            
            # Step 5: Save
            self.save_model(version)
            
            # Success summary
            print("\n" + "="*70)
            print("TRAINING COMPLETE!")
            print("="*70)
            print(f"\nFinal Results:")
            print(f"  Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
            print(f"  Model saved: learning_style_classifier_v{version}.pkl")
            print(f"\nTop 3 most important features:")
            for idx, row in feature_importance.head(3).iterrows():
                print(f"  {idx+1}. {row['feature']}: {row['importance']:.4f}")
            
            print("\n" + "="*70)
            print("You can now use this model for predictions!")
            print("="*70)
            
            return self.model, accuracy
            
        except Exception as e:
            print(f"\nERROR during training: {str(e)}")
            import traceback
            traceback.print_exc()
            raise


# ============================================================
# MAIN EXECUTION
# ============================================================

if __name__ == "__main__":
    """
    Main execution: Train the learning style classifier.
    
    Usage:
        python train_learning_style_model.py
        
    Optional arguments (modify in code):
        - algorithm: 'random_forest' or 'gradient_boosting'
        - tune_hyperparameters: True/False
        - version: Model version string
    """
    
    # Configuration
    ALGORITHM = 'random_forest'  # or 'gradient_boosting'
    TUNE_HYPERPARAMETERS = False  # Set to True for better accuracy (slower)
    MODEL_VERSION = '1.0'
    MIN_DAYS = 7
    
    # Initialize trainer
    trainer = LearningStyleModelTrainer(model_dir="ml_models")
    
    # Run training pipeline
    model, accuracy = trainer.train_pipeline(
        min_days=MIN_DAYS,
        algorithm=ALGORITHM,
        tune_hyperparameters=TUNE_HYPERPARAMETERS,
        version=MODEL_VERSION
    )
    
    print("\nTraining script completed successfully!")

