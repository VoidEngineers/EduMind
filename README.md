# EduMind

> **AI-powered educational platform with explainable predictions for student academic risk.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![NX](https://img.shields.io/badge/Nx-Smart_Monorepos-blue)](https://nx.dev)

---

## Overview

**EduMind** is a cloud-native learning analytics platform designed to bridge the gap between "Black Box" AI and actionable educational support. Unlike traditional LMS dashboards that only show past grades, EduMind uses real-time behavioral analysis and Explainable AI (XAI) to predict student outcomes before failure occurs, providing transparent, personalized interventions.

### Key Features

- **Predictive Analytics**: ML assessment of student risk levels.
- **Explainable AI (XAI)**: Transparent reasoning behind every prediction.
- **Learning Style Recognition**: VARK-based personalization.
- **Engagement Tracking**: Real-time monitoring of student activity.
- **Interactive Dashboards**: Rich data visualization for actionable insights.
- **Cloud-Native Architecture**: Scalable microservices on GCP/GKE.

---

## System Architecture

![EduMind GCP Cloud Native Architecture](Docs/edumind_gcp_architecture.png)

### Tech Stack

| Layer              | Technology              | Key Dependencies / Tools                                                                              |
| ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| **Frontend**       | React 19, TypeScript    | `vite`, `@tanstack/react-query`, `chart.js`, `react-chartjs-2`, `lucide-react`, `zod`, `qrcode.react` |
| **Backend**        | Python, FastAPI         | `fastapi`, `uvicorn`, `pydantic`, `sqlalchemy`                                                        |
| **ML & AI**        | Scikit-learn, Python    | `scikit-learn`, `shap`, `lime`, `joblib`, `pandas`, `numpy`                                           |
| **Database**       | PostgreSQL, TimescaleDB | `postgresql`, `timescaledb`                                                                           |
| **Infrastructure** | GCP, Kubernetes         | Docker, GKE, Nginx Ingress, Terraform                                                                 |
| **Observability**  | LGTM Stack              | Grafana, Loki, Tempo, Mimir (Prometheus)                                                              |
| **Orchestration**  | Nx, Airflow             | `nx` (Monorepo), Apache Airflow (ML Pipelines)                                                        |

---

## Project Structure

```bash
/EduMind
├── apps/
│   └── web/                  # Frontend (React + TypeScript + Vite)
├── backend/
│   ├── services/             # Microservices
│   │   ├── user-service/             # Auth & Profiles
│   │   ├── course-service/           # Course Management
│   │   ├── assessment-service/       # Quizzes & Tests
│   │   ├── service-engagement-tracker/ # Activity Logs
│   │   ├── service-learning-style/   # VARK Analysis
│   │   └── service-xai-prediction/   # Risk Engine (SHAP/LIME)
│   └── shared/               # Shared Utilities
├── ml/                       # Machine Learning
│   ├── airflow/              # Pipelines
│   └── models/               # Training Scripts & Artifacts
├── packages/                 # Shared Libraries (Monorepo)
└── platform/                 # Infrastructure (K8s, Terraform)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 8+ (`npm install -g pnpm`)
- **Python** 3.11+
- **Docker** & **Docker Compose**

### 1. clone the Repository

```bash
git clone https://github.com/VoidEngineers/EduMind.git
cd EduMind
```

### 2. Quick Start (Docker Compose)

Run the entire platform locally:

```bash
docker-compose up -d
```

### 3. Development Setup

#### Frontend (Web App)

```bash
cd apps/web
pnpm install
pnpm dev
# App running at http://localhost:5173
```

#### Backend Services

Each service can be run individually. Example for XAI Service:

```bash
cd backend/services/service-xai-prediction
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8003
```

#### Monorepo Commands (Nx)

We use **Nx** for task scheduling:

```bash
pnpm nx run-many --target=dev --all --parallel  # Run all apps in dev mode
pnpm nx run-many --target=build --all          # Build all apps
pnpm nx graph                                  # Visualize project graph
```

---

## Microservices

| Service            | Port | Description            | Documentation |
| ------------------ | ---- | ---------------------- | ------------- |
| **User Service**   | 8001 | Authentication & Users | `/docs`       |
| **Course Service** | 8002 | Course Content         | `/docs`       |
| **XAI Prediction** | 8003 | Risk Analysis Engine   | `/docs`       |
| **Assessment**     | 8004 | Quizzes & Grading      | `/docs`       |
| **Engagement**     | 8005 | Activity Tracking      | `/docs`       |
| **Learning Style** | 8006 | VARK Classification    | `/docs`       |

---

## Testing

Run tests across the entire monorepo:

```bash
# Run all tests
pnpm nx run-many --target=test --all

# Run specific project tests
pnpm nx test web
pnpm nx test service-xai-prediction
```

---

## Observability

Local monitoring stack available at `http://localhost:3000` (Grafana):

- **Logs**: Loki
- **Metrics**: Mimir (Prometheus compatible)
- **Traces**: Tempo

---

## Team

**VoidEngineers**

---

## License

This project is licensed under the **MIT License**.
