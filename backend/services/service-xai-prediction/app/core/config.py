from backend.shared.config import BaseServiceSettings
from pathlib import Path
from typing import Optional
import os

SERVICE_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseServiceSettings):
    # Service Overrides
    SERVICE_NAME: str = "XAI Prediction Service"
    
    # Custom ML Paths
    @property
    def BASE_DIR(self) -> Path:
        return Path(__file__).parent.parent.parent

    # Model Directory
    @property
    def ML_MODELS_DIR(self) -> Path:
        """Get ML models directory with fallback logic"""
        # Try environment variable first
        env_path = os.getenv("ML_MODELS_PATH")
        if env_path:
            path = Path(env_path)
            if path.exists():
                return path

        # Development: relative path to ml/models
        dev_path = (
            self.BASE_DIR.parent.parent.parent / "ml" / "models" / "xai_predictor"
        )
        if dev_path.exists():
            return dev_path

        # Docker: models should be in /app/models
        docker_path = Path("/app/models")
        if docker_path.exists():
            return docker_path

        raise RuntimeError(
            f"ML models directory not found. Tried: {dev_path}, {docker_path}"
        )

    # Model File Paths
    @property
    def MODEL_PATH(self) -> Path:
        return self.ML_MODELS_DIR / "student_model_best.joblib"

    @property
    def SCALER_PATH(self) -> Path:
        return self.ML_MODELS_DIR / "scaler_best.joblib"

    @property
    def ENCODER_PATH(self) -> Path:
        return self.ML_MODELS_DIR / "label_encoder_best.joblib"

    @property
    def FEATURES_PATH(self) -> Path:
        return self.ML_MODELS_DIR / "model_features_best.joblib"

    @property
    def METADATA_PATH(self) -> Path:
        return self.ML_MODELS_DIR / "model_metadata_best.joblib"

    # Database & Redis
    # Falls back to a dedicated XAI database when DATABASE_URL is missing/blank.
    DATABASE_URL: str = "postgresql+psycopg://postgres:admin@localhost:5432/xai-prediction"
    TEMP_STUDENTS_DATABASE_URL: Optional[str] = None
    REDIS_URL: Optional[str] = None

    # Predictive bridge upstream services
    ENGAGEMENT_SERVICE_URL: str = "http://localhost:8005"
    LEARNING_STYLE_SERVICE_URL: str = "http://localhost:8006"
    SYNC_TIMEOUT_SECONDS: float = 10.0

    class Config:
        env_file = str(SERVICE_ENV_FILE)
        case_sensitive = True


settings = Settings()
