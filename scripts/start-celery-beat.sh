#!/bin/bash
# Script para iniciar Celery Beat (scheduler de tareas periódicas)

echo "⏰ Iniciando Celery Beat..."

cd /app

# Iniciar beat con logging
celery -A app.celery_app beat \
    --loglevel=info \
    --pidfile=/tmp/celerybeat.pid \
    --schedule=/tmp/celerybeat-schedule

