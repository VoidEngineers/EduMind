#!/bin/bash

# EduMind Monorepo Setup Script

set -e

echo "========================================="
echo "EduMind Turborepo Monorepo Setup"
echo "========================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js version must be >= 18.0.0"
    echo "Current version: $(node -v)"
    exit 1
fi
echo "Node.js version: $(node -v) - OK"
echo ""

# Check if pnpm is installed
echo "Checking pnpm installation..."
if ! command -v pnpm &> /dev/null; then
    echo "pnpm not found. Installing pnpm..."
    npm install -g pnpm@8.10.0
else
    echo "pnpm version: $(pnpm -v) - OK"
fi
echo ""

# Check Python version
echo "Checking Python version..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "Python version: $PYTHON_VERSION - OK"
else
    echo "Warning: Python 3 not found. Backend services require Python >= 3.11"
fi
echo ""

# Install dependencies
echo "Installing dependencies..."
echo "This may take a few minutes..."
pnpm install
echo ""

# Create .env files if they don't exist
echo "Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# Backend Environment Variables
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/edumind
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

# JWT Settings
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Service URLs
USER_SERVICE_URL=http://localhost:8001
COURSE_SERVICE_URL=http://localhost:8002
ASSESSMENT_SERVICE_URL=http://localhost:8003
XAI_PREDICTION_SERVICE_URL=http://localhost:8004
LEARNING_STYLE_SERVICE_URL=http://localhost:8005
ENGAGEMENT_TRACKER_SERVICE_URL=http://localhost:8006
EOF
    echo "Created backend/.env"
fi

if [ ! -f "apps/web/.env" ]; then
    cat > apps/web/.env << EOF
# Frontend Environment Variables
VITE_API_URL=http://localhost:8001
VITE_APP_ENV=development
EOF
    echo "Created apps/web/.env"
fi

echo ""

# Build packages
echo "Building shared packages..."
pnpm --filter @edumind/utils build || echo "Note: utils package build skipped (requires dependencies)"
echo ""

# Setup Python virtual environments for backend services
echo "Setting up Python virtual environments for backend services..."
for service in backend/services/*/; do
    if [ -f "$service/requirements.txt" ]; then
        service_name=$(basename "$service")
        echo "Setting up $service_name..."
        
        cd "$service"
        if [ ! -d "venv" ]; then
            python3 -m venv venv
        fi
        
        source venv/bin/activate
        pip install --upgrade pip > /dev/null 2>&1
        pip install -r requirements.txt > /dev/null 2>&1
        deactivate
        
        cd - > /dev/null
        echo "$service_name - OK"
    fi
done
echo ""

echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next Steps:"
echo ""
echo "1. Start all services:"
echo "   pnpm dev"
echo ""
echo "2. Start specific services:"
echo "   pnpm --filter @edumind/web dev          # Frontend only"
echo "   pnpm --filter @edumind/user-service dev # User service only"
echo ""
echo "3. Using Docker Compose:"
echo "   cd backend && docker-compose up -d"
echo ""
echo "4. View available commands:"
echo "   pnpm run --help"
echo ""
echo "For more information, see:"
echo "- README.md"
echo "- MONOREPO.md"
echo ""
echo "Happy coding!"
