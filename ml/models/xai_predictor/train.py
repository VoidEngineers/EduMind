import pandas as pd
import numpy as np
import joblib
import warnings
from pathlib import Path
from datetime import datetime
warnings.filterwarnings('ignore')

# Traditional ML
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder, RobustScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from imblearn.over_sampling import SMOTE, ADASYN, BorderlineSMOTE
from imblearn.combine import SMOTETomek
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
import lightgbm as lgb
from catboost import CatBoostClassifier

# Neural Networks (Epoch-based training)
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
    from tensorflow.keras.optimizers import AdamW
    from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
    from tensorflow.keras import regularizers
    TENSORFLOW_AVAILABLE = True
    print("TensorFlow available - Neural network training enabled")
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("TensorFlow not available - Using tree-based models only")

# Set random seeds
np.random.seed(42)
if TENSORFLOW_AVAILABLE:
    tf.random.set_seed(42)

print("="*70)
print("HYBRID ADVANCED TRAINING - NEURAL NETWORKS + TREE-BASED MODELS")
print("="*70)

# --- NEURAL NETWORK FUNCTIONS ---
def build_neural_network(input_dim, num_classes):
    """Build deep neural network for epoch-based training"""
    if not TENSORFLOW_AVAILABLE:
        return None
    
    print("\nBuilding Neural Network with Epoch Training...")
    
    model = Sequential([
        Dense(512, activation='relu', input_shape=(input_dim,), kernel_regularizer=regularizers.l2(0.001)),
        BatchNormalization(),
        Dropout(0.3),
        
        Dense(384, activation='relu', kernel_regularizer=regularizers.l2(0.001)),
        BatchNormalization(),
        Dropout(0.3),
        
        Dense(256, activation='relu', kernel_regularizer=regularizers.l2(0.001)),
        BatchNormalization(),
        Dropout(0.3),
        
        Dense(128, activation='relu', kernel_regularizer=regularizers.l2(0.001)),
        BatchNormalization(),
        Dropout(0.2),
        
        Dense(64, activation='relu', kernel_regularizer=regularizers.l2(0.001)),
        BatchNormalization(),
        Dropout(0.2),
        
        Dense(num_classes, activation='softmax')
    ])
    
    optimizer = AdamW(learning_rate=0.001, weight_decay=0.0001)
    model.compile(
        optimizer=optimizer,
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    total_params = model.count_params()
    print(f"Neural Network built: {total_params:,} parameters")
    print(f"   Architecture: 512 → 384 → 256 → 128 → 64 → {num_classes}")
    
    return model


def train_neural_network(model, X_train, y_train, X_val, y_val, epochs=150):
    """Train neural network with epochs and callbacks"""
    if not TENSORFLOW_AVAILABLE or model is None:
        return None, None
    
    print("\n" + "="*70)
    print("TRAINING NEURAL NETWORK (EPOCH-BASED)")
    print("="*70)
    print(f"Max Epochs: {epochs} | Batch Size: 64 | Optimizer: AdamW")
    print(f"Training Samples: {len(X_train):,} | Validation Samples: {len(X_val):,}")
    print("="*70)
    
    # Create directory for models
    Path("models/neural_network").mkdir(parents=True, exist_ok=True)
    
    # Setup callbacks
    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=20,
            restore_best_weights=True,
            verbose=1
        ),
        ModelCheckpoint(
            'models/neural_network/best_epoch_model.keras',
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=10,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    start_time = datetime.now()
    
    # Train with epochs
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=64,
        callbacks=callbacks,
        verbose=1,
        shuffle=True
    )
    
    training_duration = (datetime.now() - start_time).total_seconds()
    
    print("\n" + "="*70)
    print("NEURAL NETWORK TRAINING COMPLETE!")
    print("="*70)
    print(f"Total training time: {training_duration / 60:.2f} minutes")
    print(f"Epochs completed: {len(history.history['loss'])}")
    print(f"Best val accuracy: {max(history.history['val_accuracy']) * 100:.2f}%")
    print(f"Final val loss: {history.history['val_loss'][-1]:.4f}")
    print("="*70)
    
    return model, history


# --- 1. Load OULAD Dataset (Open University Learning Analytics) ---
import glob
import os

print("\n" + "="*70)
print("LOADING OULAD DATASET (32,595+ STUDENTS)")
print("="*70)

base_path = Path("CSV/student_data")

# Load main tables
print("\nLoading main tables...")
df_students = pd.read_csv(base_path / "studentInfo.csv")
print(f"Students: {len(df_students):,} records")

df_courses = pd.read_csv(base_path / "courses.csv")
print(f"Courses: {len(df_courses):,} records")

df_assessments = pd.read_csv(base_path / "assessments.csv")
print(f"Assessments: {len(df_assessments):,} records")

df_student_assessments = pd.read_csv(base_path / "studentAssessment.csv")
print(f"Student assessments: {len(df_student_assessments):,} records")

df_registration = pd.read_csv(base_path / "studentRegistration.csv")
print(f"Registration: {len(df_registration):,} records")

# Try loading VLE data (large file)
print("\nLoading VLE engagement data (large file, may take 30-60 seconds)...")
try:
    df_vle = pd.read_csv(base_path / "studentVle.csv")
    print(f"VLE interactions: {len(df_vle):,} records ({df_vle.memory_usage(deep=True).sum() / 1024**2:.1f} MB)")
    vle_loaded = True
except Exception as e:
    print(f"VLE data skipped: {e}")
    df_vle = None
    vle_loaded = False

# Merge tables to create rich feature set
print("\n🔗 Merging tables to create rich dataset...")

# Start with students
df = df_students.copy()

# Merge with courses
df = df.merge(df_courses, on=['code_module', 'code_presentation'], how='left')
print(f"✓ Merged courses: {df.shape}")

# Merge with registration
df = df.merge(df_registration, on=['code_module', 'code_presentation', 'id_student'], how='left')
print(f"✓ Merged registration: {df.shape}")

# Aggregate assessment scores per student
print("\n📊 Aggregating assessment performance...")
assessment_agg = df_student_assessments.groupby('id_student').agg({
    'score': ['mean', 'std', 'min', 'max', 'count'],
    'date_submitted': ['min', 'max']
}).reset_index()
assessment_agg.columns = ['id_student', 'score_mean', 'score_std', 'score_min', 
                          'score_max', 'num_assessments', 'first_submission', 'last_submission']
df = df.merge(assessment_agg, on='id_student', how='left')
print(f"✓ Added assessment aggregates: {df.shape}")

# Aggregate assessment type performance
print("Calculating assessment type performance...")
assessment_with_type = df_student_assessments.merge(
    df_assessments[['id_assessment', 'assessment_type']],
    on='id_assessment',
    how='left'
)

# TMA (Tutor Marked Assessment) performance
tma_scores = assessment_with_type[assessment_with_type['assessment_type'] == 'TMA'].groupby('id_student')['score'].mean()
df = df.merge(tma_scores.rename('tma_avg_score'), on='id_student', how='left')

# CMA (Computer Marked Assessment) performance
cma_scores = assessment_with_type[assessment_with_type['assessment_type'] == 'CMA'].groupby('id_student')['score'].mean()
df = df.merge(cma_scores.rename('cma_avg_score'), on='id_student', how='left')

# Exam performance
exam_scores = assessment_with_type[assessment_with_type['assessment_type'] == 'Exam'].groupby('id_student')['score'].mean()
df = df.merge(exam_scores.rename('exam_avg_score'), on='id_student', how='left')
print(f"✓ Added assessment type scores: {df.shape}")

# VLE engagement features (if available)
if vle_loaded and df_vle is not None:
    print("\nAggregating VLE engagement features (this may take 1-2 minutes)...")
    vle_agg = df_vle.groupby(['code_module', 'code_presentation', 'id_student']).agg({
        'sum_click': ['sum', 'mean', 'std', 'max'],
        'date': ['min', 'max', 'nunique']
    }).reset_index()
    vle_agg.columns = [
        'code_module', 'code_presentation', 'id_student',
        'total_clicks', 'avg_clicks_per_day', 'std_clicks', 'max_clicks_day',
        'first_access', 'last_access', 'days_active'
    ]
    df = df.merge(vle_agg, on=['code_module', 'code_presentation', 'id_student'], how='left')
    print(f"Added VLE engagement features: {df.shape}")
else:
    print("Skipping VLE features (data not loaded)")

print("\n" + "="*70)
print(f"OULAD DATASET LOADED: {df.shape[0]:,} students × {df.shape[1]} columns")
print("="*70)

# Set target column
df['target'] = df['final_result']

print(f"\nTarget Distribution:")
print(df['target'].value_counts())
print(f"\nPercentages:")
print(df['target'].value_counts(normalize=True) * 100)

# --- 2. Advanced Feature Engineering (OULAD-Specific) ---
print("\n" + "="*70)
print("OULAD FEATURE ENGINEERING")
print("="*70)

# --- Temporal/Registration Features ---
df['registration_early'] = (df['date_registration'] < -100).astype(int)
df['registration_late'] = (df['date_registration'] > -30).astype(int)
df['registration_timing'] = df['date_registration'].fillna(0)
df['has_unregistered'] = (~df['date_unregistration'].isna()).astype(int)
df['days_until_unregister'] = df['date_unregistration'].fillna(999)
df['study_duration'] = df['days_until_unregister'] - df['registration_timing']

# --- Academic Performance Features ---
df['score_consistency'] = 1 / (df['score_std'].fillna(15) + 1)  # Lower std = more consistent
df['assessment_completion_rate'] = df['num_assessments'].fillna(0) / 10  # Normalize
df['score_range'] = df['score_max'].fillna(0) - df['score_min'].fillna(0)
df['is_high_achiever'] = (df['score_mean'] > 80).astype(int)
df['is_struggling'] = (df['score_mean'] < 50).astype(int)
df['submission_consistency'] = df['last_submission'] - df['first_submission']

# --- Assessment Type Performance Ratios ---
df['tma_to_overall_ratio'] = df['tma_avg_score'].fillna(0) / (df['score_mean'].fillna(1) + 1)
df['exam_to_tma_ratio'] = df['exam_avg_score'].fillna(0) / (df['tma_avg_score'].fillna(1) + 1)
df['cma_performance'] = df['cma_avg_score'].fillna(df['score_mean'].fillna(50))
df['tma_exam_gap'] = df['tma_avg_score'].fillna(0) - df['exam_avg_score'].fillna(0)

# --- VLE Engagement Features (if available) ---
if vle_loaded and 'total_clicks' in df.columns:
    print("📱 Creating VLE engagement features...")
    df['engagement_intensity'] = df['total_clicks'] / (df['days_active'] + 1)
    df['engagement_consistency'] = 1 / (df['std_clicks'].fillna(10) + 1)
    df['late_engagement'] = (df['first_access'] > 30).astype(int)
    df['early_engagement'] = (df['first_access'] < 0).astype(int)
    df['sustained_engagement'] = ((df['last_access'] - df['first_access']) > 200).astype(int)
    df['click_efficiency'] = df['score_mean'].fillna(0) / (np.log1p(df['total_clicks'].fillna(1)))
    df['clicks_per_assessment'] = df['total_clicks'] / (df['num_assessments'] + 1)
    df['high_engagement'] = (df['total_clicks'] > df['total_clicks'].quantile(0.75)).astype(int)
    df['low_vle_activity'] = (df['total_clicks'] < df['total_clicks'].quantile(0.25)).astype(int)
    print("✓ Added 9 VLE engagement features")
else:
    print("⏭️  Skipping VLE features")

# --- Student Profile Features ---
df['is_repeat_student'] = (df['num_of_prev_attempts'] > 0).astype(int)
df['multiple_attempts'] = (df['num_of_prev_attempts'] > 1).astype(int)
df['high_credit_load'] = (df['studied_credits'] > 120).astype(int)
df['low_credit_load'] = (df['studied_credits'] < 60).astype(int)
df['has_disability'] = (df['disability'] == 'Y').astype(int)
df['is_male'] = (df['gender'] == 'M').astype(int)
df['is_female'] = (df['gender'] == 'F').astype(int)

# --- Course Features ---
df['course_duration_long'] = (df['module_presentation_length'] > 250).astype(int)
df['course_duration_short'] = (df['module_presentation_length'] < 240).astype(int)

# --- IMD Band (Socioeconomic Indicator) ---
def extract_imd_numeric(imd_str):
    if pd.isna(imd_str) or imd_str == '':
        return 50  # Default to middle
    try:
        if '-' in str(imd_str):
            parts = str(imd_str).replace('%', '').split('-')
            return (float(parts[0]) + float(parts[1])) / 2
        else:
            return float(str(imd_str).replace('%', ''))
    except:
        return 50

df['imd_numeric'] = df['imd_band'].apply(extract_imd_numeric)
df['is_disadvantaged'] = (df['imd_numeric'] < 30).astype(int)
df['is_affluent'] = (df['imd_numeric'] > 70).astype(int)

# --- Age Band Features ---
age_mapping = {'0-35': 25, '35-55': 45, '55<=': 60}
df['age_numeric'] = df['age_band'].map(age_mapping).fillna(25)
df['is_young_student'] = (df['age_numeric'] <= 35).astype(int)
df['is_mature_student'] = (df['age_numeric'] >= 45).astype(int)
df['is_senior_student'] = (df['age_numeric'] >= 55).astype(int)

# --- Risk Indicators ---
df['dropout_risk_score'] = (
    df['is_struggling'].fillna(0) * 3 +
    df['has_unregistered'].fillna(0) * 2.5 +
    df['registration_late'].fillna(0) * 1.5 +
    (1 - df['assessment_completion_rate'].fillna(0)) * 2 +
    df['is_repeat_student'].fillna(0) * 1
)

if vle_loaded and 'low_vle_activity' in df.columns:
    df['dropout_risk_score'] += df['low_vle_activity'].fillna(0) * 1.5

# --- Academic Success Indicators ---
df['success_indicators'] = (
    df['is_high_achiever'].fillna(0) * 3 +
    df['score_consistency'].fillna(0) * 2 +
    df['assessment_completion_rate'].fillna(0) * 2
)

if vle_loaded and 'high_engagement' in df.columns:
    df['success_indicators'] += df['high_engagement'].fillna(0) * 1.5

# Fill remaining NaN values
numeric_cols = df.select_dtypes(include=[np.number]).columns
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

feature_count = len([c for c in df.columns if c not in ['id_student', 'code_module', 'code_presentation', 'final_result', 'target']])
print(f"\nCreated {feature_count} total features (including {len(assessment_agg.columns)-1} assessment features)")
if vle_loaded:
    print("Included rich VLE engagement features for maximum accuracy")

# --- 3. Select Features (OULAD-Specific) ---
print("\n" + "="*70)
print("FEATURE SELECTION")
print("="*70)

# Exclude non-predictive columns
exclude_cols = [
    'target', 'final_result', 'id_student', 'code_module', 'code_presentation',
    'gender', 'region', 'highest_education', 'imd_band', 'age_band', 'disability'
]

# Get all numeric features
features = [col for col in df.columns 
           if col not in exclude_cols and df[col].dtype in [np.float64, np.int64, np.float32, np.int32]]

target = 'target'

df_model = df[features + [target]].copy()
df_model = df_model.fillna(0)

print(f"✓ Using {len(features)} total features from OULAD dataset")
print(f"  • Assessment features: score_mean, score_std, num_assessments, TMA/CMA/Exam scores")
print(f"  • Registration features: timing, early/late, unregistration status")
print(f"  • Performance features: consistency, completion rate, achievement levels")
if vle_loaded and 'total_clicks' in features:
    print(f"  • VLE engagement: clicks, activity patterns, engagement intensity")
print(f"  • Student profile: age, disability, previous attempts, credit load")
print(f"  • Risk indicators: dropout risk score, success indicators")

# --- 4. Clean and Encode Target ---
# Convert all target values to strings first (handles mixed types from different datasets)
df_model[target] = df_model[target].astype(str).str.strip()

# Standardize target values (handle case variations)
df_model[target] = df_model[target].str.title()

# Show unique values before encoding
print(f"\nUnique target values: {df_model[target].unique()}")

le = LabelEncoder()
df_model[target] = le.fit_transform(df_model[target])
print(f"✓ Target classes encoded: {list(le.classes_)}")

# --- 5. Split Data (Train/Validation/Test) ---
X = df_model[features]
y = df_model[target]

# First split: 80% train+val, 20% test
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Second split: 75% train, 25% validation (of the temp set)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25, random_state=42, stratify=y_temp
)

print(f"\n✓ Data split: {len(X_train)} training, {len(X_val)} validation, {len(X_test)} testing")

# --- 6. Advanced Class Balancing ---
print("\n" + "="*70)
print("ADVANCED CLASS BALANCING (SMOTE + TOMEK)")
print("="*70)

print("Before balancing:")
print(pd.Series(y_train).value_counts())
print(f"Class imbalance ratio: {pd.Series(y_train).value_counts().max() / pd.Series(y_train).value_counts().min():.2f}:1")

# Use SMOTETomek - combines SMOTE oversampling with Tomek links undersampling
# This creates synthetic samples AND removes noisy borderline samples
from imblearn.over_sampling import SMOTE
smt = SMOTETomek(random_state=42, smote=SMOTE(random_state=42, k_neighbors=5))
X_train_balanced, y_train_balanced = smt.fit_resample(X_train, y_train)

print("\nAfter SMOTETomek:")
class_counts = pd.Series(y_train_balanced).value_counts()
print(class_counts)
print(f"✓ Balanced dataset: {len(X_train_balanced)} samples")

# Check if classes are already balanced
max_count = class_counts.max()
min_count = class_counts.min()
imbalance_ratio = max_count / min_count

if imbalance_ratio > 1.2:  # Only apply ADASYN if still imbalanced
    print(f"\nClasses still imbalanced (ratio {imbalance_ratio:.2f}:1), applying ADASYN...")
    adasyn = ADASYN(random_state=42, n_neighbors=5)
    X_train_balanced, y_train_balanced = adasyn.fit_resample(X_train_balanced, y_train_balanced)
    
    print("After ADASYN:")
    print(pd.Series(y_train_balanced).value_counts())
    print(f"✓ Final balanced dataset: {len(X_train_balanced)} samples")
else:
    print(f"✓ Classes already well balanced (ratio {imbalance_ratio:.2f}:1), skipping ADASYN")

# --- 7. Advanced Feature Scaling ---
print("\n" + "="*70)
print("ROBUST FEATURE SCALING")
print("="*70)

# Use RobustScaler - more resistant to outliers than StandardScaler
scaler = RobustScaler()
X_train_scaled = scaler.fit_transform(X_train_balanced)
X_val_scaled = scaler.transform(X_val)
X_test_scaled = scaler.transform(X_test)

print("✓ Features scaled using RobustScaler (outlier-resistant)")
print(f"✓ Scaled: {len(X_train_scaled)} train, {len(X_val_scaled)} validation, {len(X_test_scaled)} test samples")

# --- 7.5. Feature Selection (Remove Low Importance Features) ---
print("\n" + "="*70)
print("FEATURE SELECTION")
print("="*70)

from sklearn.ensemble import ExtraTreesClassifier
from sklearn.feature_selection import SelectFromModel

# Use ExtraTreesClassifier for feature importance
feat_selector = ExtraTreesClassifier(n_estimators=200, random_state=42, n_jobs=-1)
feat_selector.fit(X_train_scaled, y_train_balanced)

# Select features with importance above median
selector = SelectFromModel(feat_selector, threshold='median', prefit=True)
X_train_selected = selector.transform(X_train_scaled)
X_val_selected = selector.transform(X_val_scaled)
X_test_selected = selector.transform(X_test_scaled)

selected_features_mask = selector.get_support()
selected_features = [f for f, selected in zip(features, selected_features_mask) if selected]

print(f"Selected {len(selected_features)} out of {len(features)} features")
print(f"Removed {len(features) - len(selected_features)} low-importance features")

# Use selected features for training
X_train_scaled_final = X_train_selected
X_val_scaled_final = X_val_selected
X_test_scaled_final = X_test_selected
features_final = selected_features

# --- 7.6. Train Neural Network with Epochs (if TensorFlow available) ---
neural_network_model = None
neural_network_accuracy = 0
neural_network_f1 = 0

if TENSORFLOW_AVAILABLE:
    print("\n" + "="*70)
    print("NEURAL NETWORK TRAINING (EPOCH-BASED)")
    print("="*70)
    
    # Build and train neural network
    num_classes = len(le.classes_)
    neural_network_model = build_neural_network(X_train_scaled_final.shape[1], num_classes)
    
    if neural_network_model is not None:
        neural_network_model, history = train_neural_network(
            neural_network_model,
            X_train_scaled_final,
            y_train_balanced,
            X_val_scaled_final,
            y_val,
            epochs=150  # Maximum epochs (early stopping will prevent overfitting)
        )
        
        # Evaluate neural network
        print("\nEvaluating Neural Network...")
        y_pred_nn_proba = neural_network_model.predict(X_test_scaled_final, verbose=0)
        y_pred_nn = np.argmax(y_pred_nn_proba, axis=1)
        neural_network_accuracy = accuracy_score(y_test, y_pred_nn)
        neural_network_f1 = f1_score(y_test, y_pred_nn, average='weighted')
        
        print(f"Neural Network Test Accuracy: {neural_network_accuracy * 100:.2f}%")
        print(f"Neural Network F1 Score: {neural_network_f1 * 100:.2f}%")
        
        # Save neural network
        neural_network_model.save('models/neural_network/student_outcome_nn.keras')
        print("Neural network model saved: models/neural_network/student_outcome_nn.keras")
else:
    print("\nSkipping neural network training (TensorFlow not installed)")
    print("   Install with: pip install tensorflow")

# --- 8. Train Multiple Advanced Models with Optimized Parameters ---
print("\n" + "="*70)
print("TRAINING TREE-BASED MODELS (OPTIMIZED)")
print("="*70)

models = {
    'XGBoost': XGBClassifier(
        n_estimators=2000,
        max_depth=15,
        learning_rate=0.02,
        subsample=0.8,
        colsample_bytree=0.8,
        colsample_bylevel=0.8,
        gamma=0.1,
        min_child_weight=2,
        reg_alpha=0.1,
        reg_lambda=1.0,
        random_state=42,
        n_jobs=-1,
        eval_metric='mlogloss'
    ),
    'LightGBM': LGBMClassifier(
        n_estimators=2000,
        max_depth=15,
        learning_rate=0.02,
        num_leaves=70,
        min_child_samples=20,
        subsample=0.8,
        subsample_freq=1,
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=1.0,
        random_state=42,
        n_jobs=-1,
        verbose=-1
    ),
    'CatBoost': CatBoostClassifier(
        iterations=2000,
        depth=12,
        learning_rate=0.02,
        l2_leaf_reg=3,
        border_count=128,
        random_strength=1.0,
        bagging_temperature=1.0,
        random_state=42,
        verbose=0,
        early_stopping_rounds=50
    ),
    'Random Forest': RandomForestClassifier(
        n_estimators=1500,
        max_depth=30,
        min_samples_split=2,
        min_samples_leaf=1,
        max_features='sqrt',
        max_samples=0.8,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced_subsample'
    ),
    'Gradient Boosting': GradientBoostingClassifier(
        n_estimators=800,
        max_depth=15,
        learning_rate=0.02,
        subsample=0.8,
        max_features='sqrt',
        random_state=42
    ),
    'Extra Trees': RandomForestClassifier(
        n_estimators=1500,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        max_features='sqrt',
        criterion='gini',
        random_state=42,
        n_jobs=-1,
        bootstrap=False,
        class_weight='balanced_subsample'
    )
}

best_model = None
best_accuracy = 0
best_model_name = ""
model_results = {}

for name, model in models.items():
    print(f"\n--- Training {name} ---")
    
    # Train with early stopping for gradient boosting models
    if name in ['XGBoost', 'LightGBM', 'CatBoost']:
        if name == 'XGBoost':
            model.fit(
                X_train_scaled_final, y_train_balanced,
                eval_set=[(X_val_scaled_final, y_val)],
                verbose=False
            )
        elif name == 'LightGBM':
            model.fit(
                X_train_scaled_final, y_train_balanced,
                eval_set=[(X_val_scaled_final, y_val)],
                callbacks=[lgb.early_stopping(50, verbose=False), lgb.log_evaluation(0)]
            )
        elif name == 'CatBoost':
            model.fit(
                X_train_scaled_final, y_train_balanced,
                eval_set=(X_val_scaled_final, y_val),
                verbose=False
            )
    else:
        # Regular training for other models
        model.fit(X_train_scaled_final, y_train_balanced)
    
    # Predictions
    y_pred = model.predict(X_test_scaled_final)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X_train_scaled_final, y_train_balanced, cv=cv, scoring='accuracy', n_jobs=-1)
    
    print(f"Test Accuracy: {accuracy * 100:.2f}%")
    print(f"F1 Score: {f1 * 100:.2f}%")
    print(f"CV Accuracy: {cv_scores.mean() * 100:.2f}% (±{cv_scores.std() * 100:.2f}%)")
    
    model_results[name] = {
        'model': model,
        'accuracy': accuracy,
        'f1': f1,
        'cv_mean': cv_scores.mean()
    }
    
    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model
        best_model_name = name

# --- 9. Create Stacking Ensemble ---
print("\n" + "="*70)
print("CREATING STACKING ENSEMBLE")
print("="*70)

# Use top 3 models as base estimators
estimators = [
    ('xgb', models['XGBoost']),
    ('lgbm', models['LightGBM']),
    ('cat', models['CatBoost'])
]

stacking_model = StackingClassifier(
    estimators=estimators,
    final_estimator=LogisticRegression(max_iter=1000, random_state=42),
    cv=5,
    n_jobs=-1
)

print("Training stacking ensemble...")
stacking_model.fit(X_train_scaled_final, y_train_balanced)

y_pred_stack = stacking_model.predict(X_test_scaled_final)
stack_accuracy = accuracy_score(y_test, y_pred_stack)
stack_f1 = f1_score(y_test, y_pred_stack, average='weighted')

print(f"Stacking Accuracy: {stack_accuracy * 100:.2f}%")
print(f"Stacking F1 Score: {stack_f1 * 100:.2f}%")

model_results['Stacking Ensemble'] = {
    'model': stacking_model,
    'accuracy': stack_accuracy,
    'f1': stack_f1,
    'cv_mean': stack_accuracy
}

if stack_accuracy > best_accuracy:
    best_accuracy = stack_accuracy
    best_model = stacking_model
    best_model_name = 'Stacking Ensemble'

# --- 10. Create Weighted Voting Ensemble ---
print("\n" + "="*70)
print("CREATING WEIGHTED VOTING ENSEMBLE")
print("="*70)

# Calculate weights based on individual model performance
individual_accuracies = [(name, model_results[name]['accuracy']) 
                         for name in ['XGBoost', 'LightGBM', 'CatBoost', 'Random Forest']]
total_acc = sum(acc for _, acc in individual_accuracies)
weights = [acc / total_acc for _, acc in individual_accuracies]

print(f"Model weights based on performance:")
for (name, acc), weight in zip(individual_accuracies, weights):
    print(f"  {name:20s}: {weight:.4f} (accuracy: {acc*100:.2f}%)")

voting_estimators = [
    ('xgb', models['XGBoost']),
    ('lgbm', models['LightGBM']),
    ('cat', models['CatBoost']),
    ('rf', models['Random Forest']),
    ('et', models['Extra Trees'])
]

# Weighted voting ensemble
voting_model = VotingClassifier(
    estimators=voting_estimators,
    voting='soft',
    weights=weights + [weights[-1]],  # Add same weight for Extra Trees
    n_jobs=-1
)

print("\nTraining weighted voting ensemble...")
voting_model.fit(X_train_scaled_final, y_train_balanced)

y_pred_vote = voting_model.predict(X_test_scaled_final)
vote_accuracy = accuracy_score(y_test, y_pred_vote)
vote_f1 = f1_score(y_test, y_pred_vote, average='weighted')

print(f"Voting Accuracy: {vote_accuracy * 100:.2f}%")
print(f"Voting F1 Score: {vote_f1 * 100:.2f}%")

model_results['Voting Ensemble'] = {
    'model': voting_model,
    'accuracy': vote_accuracy,
    'f1': vote_f1,
    'cv_mean': vote_accuracy
}

if vote_accuracy > best_accuracy:
    best_accuracy = vote_accuracy
    best_model = voting_model
    best_model_name = 'Voting Ensemble'

# --- 10.5. Calibrate Best Models for Better Probabilities ---
print("\n" + "="*70)
print("PROBABILITY CALIBRATION")
print("="*70)

# Calibrate top 3 models
top_3_models = sorted([(k, v['accuracy']) for k, v in model_results.items() 
                       if k not in ['Stacking Ensemble', 'Voting Ensemble']], 
                      key=lambda x: x[1], reverse=True)[:3]

print(f"Calibrating top 3 models for better probability estimates...")
for model_name, acc in top_3_models:
    print(f"\nCalibrating {model_name} (accuracy: {acc*100:.2f}%)...")
    base_model = model_results[model_name]['model']
    
    # Calibrate using Platt scaling (sigmoid)
    calibrated = CalibratedClassifierCV(base_model, method='sigmoid', cv=3)
    calibrated.fit(X_train_scaled_final, y_train_balanced)
    
    y_pred_cal = calibrated.predict(X_test_scaled_final)
    cal_accuracy = accuracy_score(y_test, y_pred_cal)
    cal_f1 = f1_score(y_test, y_pred_cal, average='weighted')
    
    print(f"  Calibrated Accuracy: {cal_accuracy * 100:.2f}%")
    
    model_results[f'Calibrated {model_name}'] = {
        'model': calibrated,
        'accuracy': cal_accuracy,
        'f1': cal_f1,
        'cv_mean': cal_accuracy
    }
    
    if cal_accuracy > best_accuracy:
        best_accuracy = cal_accuracy
        best_model = calibrated
        best_model_name = f'Calibrated {model_name}'
        print(f"New best model!")

# --- 11. Advanced Hyperparameter Tuning for Top Model ---
print("\n" + "="*70)
print("ADVANCED HYPERPARAMETER OPTIMIZATION")
print("="*70)

from sklearn.model_selection import RandomizedSearchCV

# Get the best performing individual model (not ensemble)
individual_models = {k: v for k, v in model_results.items() 
                     if k not in ['Stacking Ensemble', 'Voting Ensemble']}
best_individual = max(individual_models.items(), key=lambda x: x[1]['accuracy'])
best_individual_name = best_individual[0]

print(f"\nOptimizing {best_individual_name}...")

if best_individual_name == 'XGBoost':
    param_dist = {
        'n_estimators': [500, 700, 1000],
        'max_depth': [8, 10, 12, 15],
        'learning_rate': [0.01, 0.03, 0.05],
        'subsample': [0.8, 0.9, 1.0],
        'colsample_bytree': [0.8, 0.9, 1.0],
        'min_child_weight': [1, 3, 5]
    }
    base_model = XGBClassifier(random_state=42, n_jobs=-1, eval_metric='mlogloss')
elif best_individual_name == 'LightGBM':
    param_dist = {
        'n_estimators': [500, 700, 1000],
        'max_depth': [8, 10, 12, 15],
        'learning_rate': [0.01, 0.03, 0.05],
        'num_leaves': [31, 50, 70],
        'min_child_samples': [20, 30, 50]
    }
    base_model = LGBMClassifier(random_state=42, n_jobs=-1, verbose=-1)
elif best_individual_name == 'CatBoost':
    param_dist = {
        'iterations': [500, 700, 1000],
        'depth': [8, 10, 12],
        'learning_rate': [0.01, 0.03, 0.05],
        'l2_leaf_reg': [1, 3, 5, 7]
    }
    base_model = CatBoostClassifier(random_state=42, verbose=0)
else:
    param_dist = {
        'n_estimators': [500, 700, 1000],
        'max_depth': [20, 25, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    base_model = RandomForestClassifier(random_state=42, n_jobs=-1)

random_search = RandomizedSearchCV(
    base_model,
    param_distributions=param_dist,
    n_iter=20,
    cv=3,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42,
    verbose=1
)

print("Running randomized search (this may take a few minutes)...")
random_search.fit(X_train_scaled_final, y_train_balanced)

tuned_model = random_search.best_estimator_
y_pred_tuned = tuned_model.predict(X_test_scaled_final)
tuned_accuracy = accuracy_score(y_test, y_pred_tuned)
tuned_f1 = f1_score(y_test, y_pred_tuned, average='weighted')

print(f"\nBest parameters: {random_search.best_params_}")
print(f"Tuned {best_individual_name} Accuracy: {tuned_accuracy * 100:.2f}%")
print(f"Tuned {best_individual_name} F1 Score: {tuned_f1 * 100:.2f}%")

model_results[f'Tuned {best_individual_name}'] = {
    'model': tuned_model,
    'accuracy': tuned_accuracy,
    'f1': tuned_f1,
    'cv_mean': tuned_accuracy
}

if tuned_accuracy > best_accuracy:
    best_accuracy = tuned_accuracy
    best_model = tuned_model
    best_model_name = f'Tuned {best_individual_name}'
    print(f"New best model: {best_model_name}")

# --- 12. Create Optimized Ensemble with Tuned Model ---
print("\n" + "="*70)
print("CREATING OPTIMIZED ENSEMBLE")
print("="*70)

optimized_voting = VotingClassifier(
    estimators=[
        ('tuned', tuned_model),
        ('xgb', models['XGBoost']),
        ('lgbm', models['LightGBM']),
        ('cat', models['CatBoost'])
    ],
    voting='soft',
    n_jobs=-1
)

print("Training optimized ensemble...")
optimized_voting.fit(X_train_scaled_final, y_train_balanced)

y_pred_opt = optimized_voting.predict(X_test_scaled_final)
opt_accuracy = accuracy_score(y_test, y_pred_opt)
opt_f1 = f1_score(y_test, y_pred_opt, average='weighted')

print(f"Optimized Ensemble Accuracy: {opt_accuracy * 100:.2f}%")
print(f"Optimized Ensemble F1 Score: {opt_f1 * 100:.2f}%")

model_results['Optimized Ensemble'] = {
    'model': optimized_voting,
    'accuracy': opt_accuracy,
    'f1': opt_f1,
    'cv_mean': opt_accuracy
}

if opt_accuracy > best_accuracy:
    best_accuracy = opt_accuracy
    best_model = optimized_voting
    best_model_name = 'Optimized Ensemble'
    print(f"New best model: {best_model_name}")

# --- 13.5 Add Neural Network to results ---
if TENSORFLOW_AVAILABLE and neural_network_accuracy > 0:
    model_results['Neural Network (Epochs)'] = {
        'model': neural_network_model,
        'accuracy': neural_network_accuracy,
        'f1': neural_network_f1,
        'cv_mean': neural_network_accuracy
    }
    
    if neural_network_accuracy > best_accuracy:
        best_accuracy = neural_network_accuracy
        best_model = neural_network_model
        best_model_name = 'Neural Network (Epochs)'
        print(f"\nNeural Network is the new best model!")

# --- 14. Final Results ---
print("\n" + "="*70)
print("FINAL MODEL COMPARISON (ALL MODELS)")
print("="*70)

results_df = pd.DataFrame({
    'Model': model_results.keys(),
    'Accuracy': [r['accuracy'] * 100 for r in model_results.values()],
    'F1 Score': [r['f1'] * 100 for r in model_results.values()]
}).sort_values('Accuracy', ascending=False)

print("\n" + results_df.to_string(index=False))

print("\n" + "="*70)
print(f"BEST MODEL: {best_model_name}")
print(f"ACCURACY: {best_accuracy * 100:.2f}%")
print("="*70)

# --- 15. Detailed Evaluation ---
# Handle predictions differently for neural network vs tree models
is_neural_network = best_model_name == 'Neural Network (Epochs)'

if is_neural_network and TENSORFLOW_AVAILABLE:
    y_pred_best_proba = best_model.predict(X_test_scaled_final, verbose=0)
    y_pred_best = np.argmax(y_pred_best_proba, axis=1)
else:
    y_pred_best = best_model.predict(X_test_scaled_final)

print("\n--- Classification Report ---")
print(classification_report(y_test, y_pred_best, target_names=le.classes_))

print("\n--- Confusion Matrix ---")
cm = confusion_matrix(y_test, y_pred_best)
print(cm)
print("\nFormat: [Actual Class] -> [Predicted Classes]")
for i, class_name in enumerate(le.classes_):
    print(f"{class_name:10s}: {cm[i]}")

# --- 15.5. Cross-Validation Score ---
# Skip CV for neural networks (too computationally expensive)
if not is_neural_network:
    print("\n" + "="*70)
    print("ROBUST CROSS-VALIDATION EVALUATION")
    print("="*70)

    # Perform 10-fold stratified cross-validation on the best model
    cv_folds = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)

    # Combine train and test for full CV evaluation
    X_full = np.vstack([X_train_scaled_final, X_test_scaled_final])
    y_full = np.concatenate([y_train_balanced[:len(X_train_scaled_final)], y_test])

    print(f"Running 10-fold cross-validation on {len(X_full)} samples...")
    cv_scores = cross_val_score(best_model, X_full, y_full, cv=cv_folds, scoring='accuracy', n_jobs=-1)

    print(f"\n✓ Cross-Validation Scores: {[f'{score*100:.2f}%' for score in cv_scores]}")
    print(f"✓ Mean CV Accuracy: {cv_scores.mean() * 100:.2f}%")
    print(f"✓ Std Deviation: ±{cv_scores.std() * 100:.2f}%")
    print(f"✓ Min/Max: {cv_scores.min() * 100:.2f}% / {cv_scores.max() * 100:.2f}%")
    print(f"✓ 95% Confidence Interval: {cv_scores.mean() * 100 - 1.96 * cv_scores.std() * 100:.2f}% - {cv_scores.mean() * 100 + 1.96 * cv_scores.std() * 100:.2f}%")
else:
    print("\nSkipping cross-validation for neural network (already validated during epoch training)")

# --- 16. Feature Importance (if available) ---
if hasattr(best_model, 'feature_importances_'):
    print("\n" + "="*70)
    print("TOP 15 MOST IMPORTANT FEATURES")
    print("="*70)
    
    feature_importance = pd.DataFrame({
        'feature': features_final,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for idx, row in feature_importance.head(15).iterrows():
        bar_length = int(row['importance'] * 100)
        bar = '█' * bar_length
        print(f"{row['feature']:40s}: {bar} {row['importance']:.4f}")
elif best_model_name in ['Stacking Ensemble', 'Voting Ensemble', 'Optimized Ensemble']:
    # For ensemble, show importance from first estimator
    base_model = list(best_model.named_estimators_.values())[0]
    if hasattr(base_model, 'feature_importances_'):
        print("\n" + "="*70)
        print("TOP 15 MOST IMPORTANT FEATURES (from base estimator)")
        print("="*70)
        
        feature_importance = pd.DataFrame({
            'feature': features_final,
            'importance': base_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        for idx, row in feature_importance.head(15).iterrows():
            bar_length = int(row['importance'] * 100)
            bar = '█' * bar_length
            print(f"{row['feature']:40s}: {bar} {row['importance']:.4f}")

# --- 17. Save Best Model ---
print("\n" + "="*70)
print("💾 SAVING BEST MODEL")
print("="*70)

# Check if best model is neural network or tree-based
if is_neural_network and TENSORFLOW_AVAILABLE:
    # Save Keras model
    best_model.save('models/neural_network/student_model_best.keras')
    print(f"Neural Network saved: models/neural_network/student_model_best.keras")
else:
    # Save tree-based model
    joblib.dump(best_model, 'student_model_best.joblib')
    print(f"Tree model saved: student_model_best.joblib")

# Save preprocessing artifacts (common for both)
joblib.dump(scaler, 'scaler_best.joblib')
joblib.dump(le, 'label_encoder_best.joblib')
joblib.dump(features_final, 'model_features_best.joblib')
joblib.dump(selector, 'feature_selector_best.joblib')

# Save model metadata
metadata = {
    'model_name': best_model_name,
    'model_type': 'neural_network' if is_neural_network else 'tree_based',
    'accuracy': best_accuracy,
    'original_features_count': len(features),
    'selected_features_count': len(features_final),
    'training_samples': len(X_train_balanced),
    'test_samples': len(X_test),
    'classes': list(le.classes_),
    'tensorflow_available': TENSORFLOW_AVAILABLE,
    'all_model_accuracies': {k: float(v['accuracy']) for k, v in model_results.items()}
}
joblib.dump(metadata, 'model_metadata_best.joblib')

print(f"\n✓ Model Type: {best_model_name}")
print(f"✓ Training Method: {'Epoch-based Neural Network' if is_neural_network else 'Iteration-based Tree Model'}")
print(f"✓ Final Test Accuracy: {best_accuracy * 100:.2f}%")
print(f"✓ Original Features: {len(features)}")
print(f"✓ Selected Features: {len(features_final)} (removed {len(features) - len(features_final)} low-importance)")
print("\nSaved files:")
if is_neural_network:
    print("  • models/neural_network/student_model_best.keras (neural network)")
    print("  • models/neural_network/best_epoch_model.keras (checkpoint)")
else:
    print("  • student_model_best.joblib (tree model)")
print("  • scaler_best.joblib (feature scaler)")
print("  • label_encoder_best.joblib (target decoder)")
print("  • model_features_best.joblib (feature names)")
print("  • feature_selector_best.joblib (feature selector)")
print("  • model_metadata_best.joblib (model info)")

print("\n" + "="*70)
print("HYBRID TRAINING COMPLETE!")
print("="*70)
print(f"Dataset: OULAD (Open University Learning Analytics)")
print(f"Training samples: {len(X_train_balanced):,} students")
print(f"Test samples: {len(X_test):,} students")
print(f"Features used: {len(features_final)} (selected from {len(features)})")
if vle_loaded:
    print(f"VLE engagement data: INCLUDED")
print()
if TENSORFLOW_AVAILABLE:
    print("Trained with both Neural Networks (epochs) AND Tree-based models")
    print(f"Total models compared: {len(model_results)}")
else:
    print("Trained with Tree-based models only")
    print("Install TensorFlow: pip install tensorflow")
print()
print(f"Best performing model: {best_model_name}")
print(f"Final accuracy: {best_accuracy * 100:.2f}%")
print(f"Training method: {'Epoch-based (Neural Network)' if is_neural_network else 'Iteration-based (Tree Model)'}")
print("="*70)
print("\nModel trained!")
print("="*70)

