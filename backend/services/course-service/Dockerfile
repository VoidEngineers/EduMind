FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY packages/backend-common /packages/backend-common
COPY backend/services/course-service/requirements.txt .
RUN sed -i 's|../../../packages/backend-common|/packages/backend-common|g' requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/services/course-service/app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
