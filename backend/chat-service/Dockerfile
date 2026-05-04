FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY chat-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY chat-service/ /app/backend/chat-service/
COPY shared/ /app/backend/shared/

ENV PYTHONPATH=/app

EXPOSE 8004

CMD ["uvicorn", "backend.chat_service.main:app", "--host", "0.0.0.0", "--port", "8004"]