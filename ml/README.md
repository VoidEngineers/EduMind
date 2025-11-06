# EduMind ML - Machine Learning Models

This directory contains the machine learning models and training pipelines for the EduMind platform.

## Setup

### 1. Create Virtual Environment

```bash
cd ml
python3 -m venv venv
```

### 2. Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## VS Code Integration

The project is configured to use the ML virtual environment automatically. VS Code settings are in `.vscode/settings.json`.

### Select Python Interpreter

1. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "Python: Select Interpreter"
3. Choose `./ml/venv/bin/python`

## Project Structure

```
ml/
├── venv/                      # Virtual environment (not in git)
├── requirements.txt           # Python dependencies
├── models/                    # ML model training scripts
│   ├── engagement_predictor/
│   │   └── train.py          # Train engagement prediction model
│   ├── learning_style_recognizer/
│   │   └── train.py          # Train learning style model
│   └── xai_predictor/
│       ├── train.py          # Train XAI prediction model
│       └── CSV/
│           └── student_data.csv  # Training data
└── pipelines/
    └── train_pipeline.py     # Training pipeline orchestration
```

## Models

### 1. XAI Predictor (`xai_predictor/train.py`)

Predicts student outcomes (Dropout, Enrolled, Graduate) using:
- **Algorithm**: Logistic Regression
- **Features**: Age, Scholarship, Tuition status, Grades
- **XAI**: SHAP and LIME for interpretability
- **Output**: `student_model.joblib`, `scaler.joblib`, `label_encoder.joblib`

**To train:**
```bash
cd models/xai_predictor
python train.py
```

### 2. Engagement Predictor

Predicts student engagement levels.

### 3. Learning Style Recognizer

Identifies student learning styles (Visual, Auditory, Kinesthetic).

## Dependencies

Key packages installed:
- **Data Processing**: pandas, numpy
- **ML**: scikit-learn, scipy
- **XAI**: SHAP, LIME
- **Visualization**: matplotlib, seaborn
- **Versioning**: DVC
- **Notebooks**: jupyter, ipykernel

See `requirements.txt` for full list.

## Training Workflow

### 1. Prepare Data

Ensure your dataset is in the correct location:
```
models/xai_predictor/CSV/student_data.csv
```

### 2. Train Model

```bash
cd models/xai_predictor
python train.py
```

### 3. Model Outputs

Trained models are saved as `.joblib` files:
- `student_model.joblib` - Trained model
- `scaler.joblib` - Feature scaler
- `label_encoder.joblib` - Label encoder
- `model_features.joblib` - Feature names

### 4. Use in API

Load the model in your FastAPI service:

```python
import joblib

model = joblib.load('student_model.joblib')
scaler = joblib.load('scaler.joblib')
le = joblib.load('label_encoder.joblib')

# Scale new data
scaled_data = scaler.transform(new_data)

# Predict
prediction = model.predict(scaled_data)
prediction_label = le.inverse_transform(prediction)
```

## Data Versioning with DVC

### Initialize DVC

```bash
dvc init
```

### Track Large Files

```bash
dvc add models/xai_predictor/CSV/student_data.csv
git add models/xai_predictor/CSV/student_data.csv.dvc .gitignore
git commit -m "Add training data with DVC"
```

### Configure Remote Storage

```bash
# Google Cloud Storage
dvc remote add -d storage gs://edumind-ml-data/

# Push data
dvc push
```

## Testing

Run tests for ML models:

```bash
pytest tests/
```

## Jupyter Notebooks

Start Jupyter for experimentation:

```bash
jupyter notebook
```

Or use VS Code's built-in Jupyter support.

## Common Issues

### Issue: "Import 'pandas' could not be resolved"

**Solution**: Make sure VS Code is using the correct Python interpreter:
1. `Cmd+Shift+P` → "Python: Select Interpreter"
2. Choose `./ml/venv/bin/python`

### Issue: Missing packages

**Solution**: Reinstall dependencies:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Model training fails

**Solution**: Check that your data file exists and has the correct format:
```bash
ls -lh models/xai_predictor/CSV/student_data.csv
```

## Next Steps

1. Train all models
2. Integrate models with backend services
3. Set up model versioning with DVC
4. Deploy to Vertex AI
5. Set up monitoring

## Resources

- [Scikit-learn Documentation](https://scikit-learn.org/)
- [SHAP Documentation](https://shap.readthedocs.io/)
- [LIME Documentation](https://lime-ml.readthedocs.io/)
- [DVC Documentation](https://dvc.org/doc)
