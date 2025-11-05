@echo off
REM EduMind Monorepo Setup Script for Windows

echo =========================================
echo EduMind Turborepo Monorepo Setup
echo =========================================
echo.

REM Check Node.js version
echo Checking Node.js version...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed
    exit /b 1
)
echo Node.js version: 
node --version
echo.

REM Check if pnpm is installed
echo Checking pnpm installation...
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pnpm not found. Installing pnpm...
    npm install -g pnpm@8.10.0
) else (
    echo pnpm version:
    pnpm --version
)
echo.

REM Check Python version
echo Checking Python version...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Python not found. Backend services require Python ^>= 3.11
) else (
    echo Python version:
    python --version
)
echo.

REM Install dependencies
echo Installing dependencies...
echo This may take a few minutes...
pnpm install
echo.

REM Create .env files if they don't exist
echo Setting up environment files...

if not exist "backend\.env" (
    (
        echo # Backend Environment Variables
        echo NODE_ENV=development
        echo DATABASE_URL=postgresql://localhost:5432/edumind
        echo REDIS_URL=redis://localhost:6379
        echo RABBITMQ_URL=amqp://localhost:5672
        echo.
        echo # JWT Settings
        echo JWT_SECRET=your-secret-key-change-in-production
        echo JWT_ALGORITHM=HS256
        echo ACCESS_TOKEN_EXPIRE_MINUTES=30
        echo.
        echo # Service URLs
        echo USER_SERVICE_URL=http://localhost:8001
        echo COURSE_SERVICE_URL=http://localhost:8002
        echo ASSESSMENT_SERVICE_URL=http://localhost:8003
        echo XAI_PREDICTION_SERVICE_URL=http://localhost:8004
        echo LEARNING_STYLE_SERVICE_URL=http://localhost:8005
        echo ENGAGEMENT_TRACKER_SERVICE_URL=http://localhost:8006
    ) > backend\.env
    echo Created backend\.env
)

if not exist "apps\web\.env" (
    (
        echo # Frontend Environment Variables
        echo VITE_API_URL=http://localhost:8001
        echo VITE_APP_ENV=development
    ) > apps\web\.env
    echo Created apps\web\.env
)

echo.

REM Build packages
echo Building shared packages...
pnpm --filter @edumind/utils build
echo.

echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo Next Steps:
echo.
echo 1. Start all services:
echo    pnpm dev
echo.
echo 2. Start specific services:
echo    pnpm --filter @edumind/web dev          # Frontend only
echo    pnpm --filter @edumind/user-service dev # User service only
echo.
echo 3. Using Docker Compose:
echo    cd backend ^&^& docker-compose up -d
echo.
echo 4. View available commands:
echo    pnpm run --help
echo.
echo For more information, see:
echo - README.md
echo - MONOREPO.md
echo.
echo Happy coding!
pause
