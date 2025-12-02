FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy shared packages
COPY packages/backend-common /packages/backend-common

# Install dependencies
COPY backend/services/user-service/requirements.txt .
# Fix the path in requirements.txt for Docker
RUN sed -i 's|../../../packages/backend-common|/packages/backend-common|g' requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/services/user-service/app ./app

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
