## System Architecture

```mermaid
graph TD
  WEB[Web App (React/TS)]
  AS[Assessment Service]
  CS[Course Service]
  US[User Service]
  ET[Engagement Tracker]
  LS[Learning Style Service]
  XAI[XAI Prediction Service]
  SH[Shared Python/TS Libraries]
  ML_PIPE[ML Pipelines (Airflow)]
  MODELS[ML Models]
  DB[(Database(s))]
  STORAGE[(Cloud Storage)]
  K8S[Kubernetes Cluster)]
  CI[CI/CD (Jenkins)]

  WEB -->|REST/gRPC| AS
  WEB -->|REST/gRPC| CS
  WEB -->|REST/gRPC| US
  WEB -->|REST/gRPC| ET
  WEB -->|REST/gRPC| LS
  WEB -->|REST/gRPC| XAI

  AS --> SH
  CS --> SH
  US --> SH
  ET --> SH
  LS --> SH
  XAI --> SH

  AS --> DB
  CS --> DB
  US --> DB
  ET --> DB
  LS --> DB
  XAI --> DB

  ML_PIPE --> MODELS
  MODELS --> XAI
  ML_PIPE --> STORAGE
  MODELS --> STORAGE

  K8S --> AS
  K8S --> CS
  K8S --> US
  K8S --> ET
  K8S --> LS
  K8S --> XAI
  K8S --> WEB

  CI --> K8S
```
# EduMind

AI-powered educational platform with explainable predictions for student academic risk.

## Project Structure

```
/EduMind
├── /apps
│   └── /web                  # Frontend (React/Vite)
├── /backend
│   ├── /services             # FastAPI microservices
│   │   ├── /assessment-service
│   │   ├── /course-service
│   │   ├── /service-engagement-tracker
│   │   ├── /service-learning-style
│   │   ├── /service-xai-prediction
│   │   └── /user-service
│   └── /shared               # Shared backend utilities
├── /ml
│   └── /models               # ML training and models
│       └── /xai_predictor
├── /packages                 # Shared packages
│   ├── /backend-common
│   ├── /tsconfig
│   └── /utils
├── /platform                 # Infrastructure configs
│   ├── /infrastructure
│   └── /kubernetes
└── /data                     # Datasets
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- pnpm (recommended)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Start all services with Docker
docker-compose up -d

# Or start individual service
cd services/service-xai-prediction
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

### Frontend Setup

```bash
# Navigate to frontend
cd apps/web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### ML Models

```bash
# Navigate to ML directory
cd ml/models/xai_predictor

# Install dependencies
pip install -r requirements.txt

# Train model
python save_model.py
```

## 🧪 Testing

### Backend Tests

```bash
cd backend/services/service-xai-prediction
pytest
```

### Frontend Tests

```bash
cd apps/web
pnpm test
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| `user-service` | 8001 | User authentication & profiles |
| `course-service` | 8002 | Course management |
| `service-xai-prediction` | 8003 | AI risk prediction |
| `assessment-service` | 8004 | Assessments & quizzes |
| `service-engagement-tracker` | 8005 | Student engagement tracking |
| `service-learning-style` | 8006 | Learning style recognition |

## ML Models

- **Academic Risk Predictor**: XGBoost model trained on OULAD dataset
  - Predicts student pass/fail probability
  - Provides explainable risk factors
  - Generates personalized recommendations

## 👥 Team

- 4 members (VoidEngineers)

## License

MIT
