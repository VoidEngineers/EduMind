@echo off
echo ============================================================
echo LEARNING STYLE SERVICE - SETUP
echo ============================================================
echo.

REM Check if we're in the right directory
if not exist "app\core\config.py" (
    echo [ERROR] Please run this script from the service-learning-style folder
    pause
    exit /b 1
)

echo Step 1: Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo [OK] Virtual environment created
) else (
    echo [OK] Virtual environment already exists
)

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Step 3: Installing dependencies...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo Step 4: Checking database configuration...
echo.
echo Current database settings:
echo   Database: edumind_learning_style
echo   User: postgres
echo   Password: (check app\core\config.py)
echo.

set /p UPDATE_PASSWORD="Do you want to update the password? (y/n): "
if /i "%UPDATE_PASSWORD%"=="y" (
    set /p DB_PASSWORD="Enter PostgreSQL password: "
    if not "%DB_PASSWORD%"=="" (
        echo Updating config file...
        powershell -Command "(Get-Content 'app\core\config.py') -replace 'postgres:admin@', 'postgres:%DB_PASSWORD%@' | Set-Content 'app\core\config.py'"
        echo [OK] Password updated
    )
)

echo.
echo Step 5: Initializing database...
python scripts\init_db.py create
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database initialization failed
    echo Check your PostgreSQL password and database name
    pause
    exit /b 1
)

echo.
echo Step 6: Generating sample data (optional)...
set /p GENERATE_DATA="Generate sample data? (y/n): "
if /i "%GENERATE_DATA%"=="y" (
    python scripts\generate_sample_data.py
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] Sample data generation failed
    ) else (
        echo [OK] Sample data generated
    )
)

echo.
echo ============================================================
echo SETUP COMPLETE!
echo ============================================================
echo.
echo To start the service, run:
echo   venv\Scripts\activate
echo   python -m uvicorn app.main:app --reload --port 8003
echo.
echo Then open in browser: http://localhost:8003/app/index.html
echo.
pause