FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY notification-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY notification-service/ /app/backend/notification_service/
COPY shared/ /app/backend/shared/
COPY __init__.py /app/backend/__init__.py

ENV PYTHONPATH=/app

EXPOSE 8003

CMD ["uvicorn", "backend.notification_service.main:app", "--host", "0.0.0.0", "--port", "8003"]