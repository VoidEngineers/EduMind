"""
XAI Predictor ML Pipeline DAG (TaskFlow API)
===========================================
Apache Airflow DAG for orchestrating the ML training pipeline using @task decorators.
1. ETL: Process OULAD data
2. Train: Train XGBoost model
3. Validate: Branching based on performance
4. Deploy: Move artifacts to production

Author: EduMind Team
"""

from datetime import datetime, timedelta
from pathlib import Path
import json
import shutil

from airflow.decorators import dag, task
from airflow.operators.empty import EmptyOperator
from airflow.utils.trigger_rule import TriggerRule

# ============================================================
# CONFIGURATION
# ============================================================
ML_BASE_PATH = Path("/opt/airflow/ml")
MODEL_PATH = ML_BASE_PATH / "models" / "xai_predictor"
DATA_PATH = MODEL_PATH / "data"
SAVED_MODELS_PATH = MODEL_PATH / "saved_models"
MIN_ACCURACY_THRESHOLD = 0.80

default_args = {
    "owner": "edumind-ml",
    "depends_on_past": False,
    "email_on_failure": True,
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
    "execution_timeout": timedelta(hours=1),
}

@dag(
    dag_id="xai_predictor_training_pipeline_v2",
    description="ML Pipeline for XAI Academic Risk Predictor",
    default_args=default_args,
    schedule="@weekly",
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["ml", "xai", "training", "edumind"],
    doc_md=__doc__,
)
def xai_predictor_training_pipeline():

    # ============================================================
    # TASK 1: ETL
    # ============================================================
    @task
    def etl_process():
        import pandas as pd
        import numpy as np
        
        print("=" * 60)
        print("STEP 1: ETL PROCESSING")
        print("=" * 60)
        
        student_info = pd.read_csv(DATA_PATH / "raw" / "OULAD" / "studentInfo.csv")
        student_assessment = pd.read_csv(DATA_PATH / "raw" / "OULAD" / "studentAssessment.csv")
        assessments = pd.read_csv(DATA_PATH / "raw" / "OULAD" / "assessments.csv")
        
        assessment_data = student_assessment.merge(
            student_info[["id_student", "code_module", "code_presentation"]],
            on="id_student", how="left"
        ).merge(
            assessments[["id_assessment", "assessment_type", "weight"]],
            on="id_assessment", how="left"
        )
        
        student_metrics = (
            assessment_data.groupby(["id_student", "code_module", "code_presentation"])
            .agg({"score": ["mean", "std", "count", "min", "max"]})
            .reset_index()
        )
        student_metrics.columns = [
            "id_student", "code_module", "code_presentation",
            "avg_score", "score_std", "num_assessments", "min_score", "max_score"
        ]
        
        df = student_info.merge(student_metrics, on=["id_student", "code_module", "code_presentation"], how="left")
        
        max_assessments = float(df["num_assessments"].max())
        df["avg_grade"] = df["avg_score"].fillna(0)
        df["grade_consistency"] = 100 - df["score_std"].fillna(0)
        df["grade_range"] = (df["max_score"] - df["min_score"]).fillna(0)
        df["assessment_completion_rate"] = df["num_assessments"].fillna(0) / max_assessments
        df["low_performance"] = (df["avg_grade"] < 40).astype(int)
        
        df["is_at_risk"] = df["final_result"].apply(lambda x: 1 if x in ["Fail", "Withdrawn"] else 0)
        
        processed_dir = DATA_PATH / "processed"
        processed_dir.mkdir(parents=True, exist_ok=True)
        output_path = processed_dir / "oulad_processed.csv"
        df.to_csv(output_path, index=False)
        
        # Return data for the next task (automatically becomes XCom)
        return {
            "output_path": str(output_path),
            "max_assessments": max_assessments,
            "sample_count": len(df)
        }

    # ============================================================
    # TASK 2: TRAINING
    # ============================================================
    @task
    def train_model(etl_metadata: dict):
        import pandas as pd
        import numpy as np
        import xgboost as xgb
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        
        print("=" * 60)
        print("STEP 2: MODEL TRAINING")
        print("=" * 60)
        
        df = pd.read_csv(etl_metadata["output_path"])
        
        feature_cols = [
            "avg_grade", "grade_consistency", "grade_range", 
            "assessment_completion_rate", "studied_credits", "num_of_prev_attempts",
            "low_performance"
        ]
        
        X = df[feature_cols].fillna(0)
        y = df["is_at_risk"]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)
        
        model = xgb.XGBClassifier(n_estimators=100, objective="binary:logistic", random_state=42)
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        metrics = {
            "accuracy": float(accuracy_score(y_test, y_pred)),
            "f1": float(f1_score(y_test, y_pred))
        }
        
        # Save Artifacts
        SAVED_MODELS_PATH.mkdir(parents=True, exist_ok=True)
        model.save_model(str(SAVED_MODELS_PATH / "academic_risk_model.json"))
        
        metadata = {
            "metrics": metrics,
            "max_assessments": etl_metadata["max_assessments"],
            "trained_at": datetime.now().isoformat()
        }
        
        with open(SAVED_MODELS_PATH / "model_metadata.json", "w") as f:
            json.dump(metadata, f)
            
        return metrics

    # ============================================================
    # TASK 3: VALIDATION (BRANCHING)
    # ============================================================
    @task.branch
    def validate_model(metrics: dict):
        print("=" * 60)
        print("STEP 3: MODEL VALIDATION")
        print("=" * 60)
        
        accuracy = metrics["accuracy"]
        if accuracy >= MIN_ACCURACY_THRESHOLD:
            print(f"True: {accuracy} >= {MIN_ACCURACY_THRESHOLD}. Deploying...")
            return "deploy_model"
        else:
            print(f"False: {accuracy} < {MIN_ACCURACY_THRESHOLD}. Failing...")
            return "validation_failed"

    # ============================================================
    # TASK 4: DEPLOYMENT
    # ============================================================
    @task
    def deploy_model():
        print("=" * 60)
        print("STEP 4: MODEL DEPLOYMENT")
        print("=" * 60)
        
        dest_dir = ML_BASE_PATH.parent / "backend" / "services" / "service-xai-prediction" / "app" / "model"
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        for file_name in ["academic_risk_model.json", "model_metadata.json"]:
            shutil.copy2(SAVED_MODELS_PATH / file_name, dest_dir / file_name)
            print(f"Deployed: {file_name}")

    @task
    def validation_failed(metrics: dict):
        print(f"Alert: Model accuracy {metrics['accuracy']} failed threshold.")

    # ============================================================
    # PIPELINE DEFINITION
    # ============================================================
    
    start = EmptyOperator(task_id="start")
    end = EmptyOperator(task_id="end", trigger_rule=TriggerRule.ONE_SUCCESS)

    # Calling tasks and defining dependencies
    etl_data = etl_process()
    metrics = train_model(etl_data)
    
    # Branching logic
    branch = validate_model(metrics)
    deploy = deploy_model()
    fail = validation_failed(metrics)
    
    # Structure
    start >> etl_data
    branch >> [deploy, fail]
    [deploy, fail] >> end

# Instantiate the DAG
xai_predictor_training_pipeline()