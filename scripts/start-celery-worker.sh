#!/bin/bash
# Script para iniciar worker de Celery

echo "🚀 Iniciando Celery worker..."

cd /app

# Iniciar worker con logging
celery -A app.celery_app worker \
    --loglevel=info \
    --concurrency=4 \
    --max-tasks-per-child=1000 \
    --time-limit=1800 \
    --soft-time-limit=1500

