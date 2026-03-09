#!/bin/bash

# AI Failure Analyzer - Quick Start Script

echo "AI Failure Analyzer Service - Quick Start"
echo "=============================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "WARNING: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "[DONE] Created .env file"
    echo ""
    echo "IMPORTANT: Please edit .env and add your credentials:"
    echo "   - OPENAI_API_KEY (from https://platform.openai.com/api-keys)"
    echo "   - GITHUB_TOKEN (from https://github.com/settings/tokens)"
    echo "   - GITHUB_ORG (your GitHub username for personal repos)"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3.11 -m venv venv
    echo "[DONE] Virtual environment created"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "[DONE] Setup complete!"
echo ""
echo "To start the service:"
echo "   python -m app.main"
echo ""
echo "Or with uvicorn:"
echo "   uvicorn app.main:app --reload"
echo ""
echo "Or with Docker:"
echo "   docker-compose up --build"
echo ""
