# 🎓 EduMind - Learning Style Recognition Service

**Adaptive Resource Recommendation System**  
*Automatically recommends alternative resources, micro-lessons, or practice problems when students struggle*

---

## 📋 Overview

This microservice implements an intelligent recommendation system that:
- Detects when students struggle with content (7 detection rules)
- Analyzes student learning styles (VARK model: Visual, Auditory, Reading, Kinesthetic)
- Recommends personalized resources using a 6-factor scoring algorithm
- Tracks engagement and effectiveness

---

## 🏗️ Architecture

```
service-learning-style/
├── app/
│   ├── api/                    # FastAPI routes (20 endpoints)
│   ├── core/                   # Configuration & database
│   ├── models/                 # SQLAlchemy models (5 tables)
│   ├── schemas/                # Pydantic schemas (25+ schemas)
│   └── services/               # Business logic
│       ├── recommendation_service.py    # 6-factor algorithm
│       └── struggle_detection_service.py # 7 detection rules
├── scripts/                    # Setup scripts
└── ml/                         # Machine learning (future)
```

---

## 🗄️ Database Schema

### **5 Core Tables:**
1. **student_learning_profiles** - Student learning styles & preferences
2. **learning_resources** - Repository of educational materials
3. **student_struggles** - Detected difficulties & struggles
4. **resource_recommendations** - Generated recommendations
5. **student_behavior_tracking** - Behavioral data for ML classification

---

## 🔬 Core Algorithms

### **6-Factor Recommendation Scoring:**
1. **Learning Style Match** (30%) - Matches resource type to student's learning style
2. **Topic Relevance** (25%) - How relevant is the resource to the struggle topic
3. **Difficulty Alignment** (20%) - Matches difficulty to student's preference
4. **Resource Effectiveness** (15%) - Historical performance of the resource
5. **Recency & Freshness** (5%) - Prefers newer resources
6. **Diversity Bonus** (5%) - Encourages variety in recommendations

### **7 Struggle Detection Rules:**
1. **Quiz Failure** - Score < threshold (40%/60%/70% for High/Medium/Low)
2. **Low Engagement** - Session time < 30 min/day or logins < 3/week
3. **Excessive Time** - Time spent > 2.5x expected duration
4. **Repeated Access** - Same content accessed 3+ times without completion
5. **Help Request** - Explicit help requests (forum, chat, instructor)
6. **Multiple Attempts** - 3+ attempts with < 50% success rate
7. **Confusion Indicators** - Erratic behavior patterns

---

## 🚀 Quick Start

### **Step 1: Setup**
```powershell
cd C:\Users\bdils\OneDrive\Desktop\research4\EduMind\backend\services\service-learning-style

# Install dependencies
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Create database
# In pgAdmin: CREATE DATABASE edumind_learning_style;

# Configure .env
echo "DATABASE_URL=postgresql+psycopg://postgres:admin@localhost:5432/edumind_learning_style" > .env

# Initialize database
python scripts/init_db.py create

# Generate sample data
python scripts/generate_sample_data.py
```

### **Step 2: Run Server**
```powershell
uvicorn app.main:app --reload --port 8005
```

### **Step 3: Test**
Open: http://localhost:8005/docs

---

## 📡 API Endpoints (20 Total)

### **System**
- `GET /api/v1/system/health` - Health check
- `GET /api/v1/system/stats` - System statistics

### **Students**
- `POST /api/v1/students` - Create student profile
- `GET /api/v1/students/{student_id}` - Get profile
- `PUT /api/v1/students/{student_id}` - Update profile
- `GET /api/v1/students/{student_id}/analytics` - Get analytics
- `GET /api/v1/students` - List students

### **Resources**
- `POST /api/v1/resources` - Create resource
- `GET /api/v1/resources/{resource_id}` - Get resource
- `PUT /api/v1/resources/{resource_id}` - Update resource
- `GET /api/v1/resources` - List resources
- `GET /api/v1/resources/{resource_id}/effectiveness` - Get metrics
- `DELETE /api/v1/resources/{resource_id}` - Delete resource

### **Struggles**
- `POST /api/v1/struggles` - Create struggle
- `GET /api/v1/struggles/student/{student_id}` - Get student struggles
- `GET /api/v1/struggles/{struggle_id}` - Get struggle
- `POST /api/v1/struggles/{struggle_id}/resolve` - Mark resolved

### **Recommendations** ⭐
- `POST /api/v1/recommendations/generate` - **Generate recommendations**
- `GET /api/v1/recommendations/student/{student_id}` - Get student recs
- `GET /api/v1/recommendations/{recommendation_id}` - Get specific rec
- `POST /api/v1/recommendations/{recommendation_id}/engagement` - Track engagement
- `POST /api/v1/recommendations/{recommendation_id}/feedback` - Submit feedback

---

## 🎯 Example Usage

### **Generate Recommendations**
```bash
POST http://localhost:8005/api/v1/recommendations/generate
Content-Type: application/json

{
  "student_id": "STU0001",
  "topic": "Python Loops",
  "max_recommendations": 5
}
```

**Response:**
```json
[
  {
    "recommendation_id": 151,
    "resource": {
      "title": "Python Loops - Interactive Tutorial",
      "resource_type": "interactive",
      "difficulty_level": "Medium"
    },
    "relevance_score": 0.857,
    "score_breakdown": {
      "learning_style_match": 0.95,
      "topic_relevance": 1.0,
      "difficulty_alignment": 1.0,
      "resource_effectiveness": 0.78,
      "recency_freshness": 0.8,
      "diversity_bonus": 0.7
    },
    "reason": "Matches your Visual learning style • Highly relevant to Python Loops • Medium difficulty level",
    "priority": "High",
    "rank_position": 1
  }
]
```

---

## 📊 Sample Data

After running `generate_sample_data.py`:
- **30 students** (STU0001-STU0030)
- **50 learning resources** (videos, articles, interactive)
- **60 student struggles** (various topics & severities)
- **150 recommendations** (with engagement tracking)
- **420 behavior records** (14 days × 30 students)

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | FastAPI 0.121.0 |
| **Database** | PostgreSQL 15+ |
| **ORM** | SQLAlchemy 2.0.45 |
| **Validation** | Pydantic 2.12.3 |
| **ML** | scikit-learn 1.8.0 |
| **Data** | pandas 2.3.3, numpy 2.4.0 |

---

## 📚 Documentation

- **[DESIGN_DOC.md](DESIGN_DOC.md)** - High-level system design
- **[DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql)** - SQL schema definitions
- **[RECOMMENDATION_LOGIC.md](RECOMMENDATION_LOGIC.md)** - Scoring algorithm details
- **[STRUGGLE_DETECTION.md](STRUGGLE_DETECTION.md)** - Detection rules
- **[API_SPEC.md](API_SPEC.md)** - API specifications
- **[STEP2_SETUP_GUIDE.md](STEP2_SETUP_GUIDE.md)** - Database setup guide
- **[STEP3_COMPLETE.md](STEP3_COMPLETE.md)** - API development summary
- **[RUN_API.md](RUN_API.md)** - Quick start guide

---

## ✅ Current Status

### **Completed:**
- ✅ Step 1: Design & Architecture (9 design docs)
- ✅ Step 2: Database Setup & Models (5 tables, sample data)
- ✅ Step 3: API Development (20 endpoints, 2 services)

### **Pending:**
- ⏳ Step 4: ML Learning Style Classifier
- ⏳ Step 5: Frontend Integration
- ⏳ Step 6: Testing & Deployment

---

## 🧪 Testing

### **Manual Testing**
```powershell
# Start server
uvicorn app.main:app --reload --port 8005

# Open Swagger UI
start http://localhost:8005/docs
```

### **Automated Testing** (Future)
```powershell
pytest tests/
```

---

## ⚙️ Configuration

Edit `app/core/config.py` or create `.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:admin@localhost:5432/edumind_learning_style
MAX_RECOMMENDATIONS_PER_DAY=5
MIN_HOURS_BETWEEN_RECOMMENDATIONS=2
RECOMMENDATION_THRESHOLD=0.50
QUIZ_FAILURE_HIGH_THRESHOLD=40
QUIZ_FAILURE_MEDIUM_THRESHOLD=60
```

---

## 🤝 Integration

### **With Other EduMind Services:**
- **Engagement Tracker** - Provides student activity data
- **User Service** - Student authentication & profiles
- **Course Service** - Course content & structure

### **External LMS:**
- Moodle, Canvas, Blackboard integration (future)

---

## 📈 Metrics & Analytics

Track:
- Recommendation effectiveness
- Student engagement improvements
- Resource completion rates
- Learning style distribution
- Struggle resolution rates

---

## 🔒 Security

- CORS configured for allowed origins
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy ORM
- Environment-based configuration

---

## 🐛 Troubleshooting

See `STEP2_SETUP_GUIDE.md` and `STEP3_COMPLETE.md` for common issues and solutions.

---

## 📝 License

Part of EduMind University Project

---

## 👥 Team

**Learning Style Recognition Team**  
EduMind Project - 2025

---

## 🎉 Quick Links

| Resource | URL |
|----------|-----|
| **API Docs** | http://localhost:8005/docs |
| **ReDoc** | http://localhost:8005/redoc |
| **Health** | http://localhost:8005/api/v1/system/health |
| **Stats** | http://localhost:8005/api/v1/system/stats |

---

**Status**: ✅ **READY FOR TESTING**  
**Version**: 1.0.0  
**Last Updated**: December 23, 2025











