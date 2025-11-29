@echo off
REM Quick script to train the Learning Style ML model
REM For Windows

echo ================================================================
echo   LEARNING STYLE ML MODEL - TRAINING SCRIPT
echo ================================================================
echo.

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo WARNING: Virtual environment not found
    echo Please create one with: python -m venv venv
    echo.
)

REM Check if model directory exists
if not exist ml_models (
    echo Creating ml_models directory...
    mkdir ml_models
)

REM Run training script
echo Starting model training...
echo.
python ml\train_learning_style_model.py

echo.
echo ================================================================
echo   TRAINING COMPLETE!
echo ================================================================
echo.
echo Next steps:
echo   1. Start API server: uvicorn app.main:app --port 8005
echo   2. Test predictions: http://localhost:8005/docs
echo.
pause






