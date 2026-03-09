@echo off
REM AI Failure Analyzer - Quick Start Script for Windows

echo ================================
echo AI Failure Analyzer Service
echo Quick Start for Windows
echo ================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo [INFO] Creating .env from .env.example...
    copy .env.example .env
    echo [SUCCESS] Created .env file
    echo.
    echo [IMPORTANT] Please edit .env and add your credentials:
    echo    - OPENAI_API_KEY (from https://platform.openai.com/api-keys)
    echo    - GITHUB_TOKEN (from https://github.com/settings/tokens)
    echo    - GITHUB_ORG (your GitHub username for personal repos)
    echo.
    pause
)

REM Check if virtual environment exists
if not exist venv (
    echo [INFO] Creating virtual environment...
    python -m venv venv
    echo [SUCCESS] Virtual environment created
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo [INFO] Installing dependencies...
pip install -r requirements.txt

echo.
echo [SUCCESS] Setup complete!
echo.
echo [INFO] To start the service:
echo    python -m app.main
echo.
echo [INFO] Or with uvicorn:
echo    uvicorn app.main:app --reload
echo.
echo [INFO] Or with Docker:
echo    docker-compose up --build
echo.
pause
