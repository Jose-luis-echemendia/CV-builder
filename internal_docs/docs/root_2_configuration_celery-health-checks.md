# 🏥 Health Checks de Celery

## 📋 Resumen

Se han agregado health checks a los servicios de Celery Worker y Celery Beat para mejorar la confiabilidad y observabilidad del sistema.

---

## ✅ Health Checks Implementados

### 1. Celery Worker

**Comando de verificación**:

```bash
celery -A app.tasks.celery_app inspect ping -d celery@$HOSTNAME
```

**Configuración**:

```yaml
healthcheck:
  test:
    [
      "CMD-SHELL",
      "celery -A app.tasks.celery_app inspect ping -d celery@$$HOSTNAME || exit 1",
    ]
  interval: 30s # Verifica cada 30 segundos
  timeout: 10s # Timeout de 10 segundos
  start_period: 40s # Espera 40s antes de empezar (tiempo de inicio)
  retries: 3 # 3 reintentos antes de marcar como unhealthy
```

**¿Qué verifica?**

- ✅ Worker está respondiendo a comandos de control
- ✅ Conexión con Redis funciona
- ✅ Worker puede procesar tareas

**Estados posibles**:

- `healthy`: Worker está operativo y respondiendo
- `starting`: Worker está iniciando (primeros 40s)
- `unhealthy`: Worker no responde después de 3 intentos

### 2. Celery Beat

**Comando de verificación**:

```bash
pgrep -f 'celery.*beat'
```

**Configuración**:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pgrep -f 'celery.*beat' || exit 1"]
  interval: 30s # Verifica cada 30 segundos
  timeout: 10s # Timeout de 10 segundos
  start_period: 30s # Espera 30s antes de empezar
  retries: 3 # 3 reintentos antes de marcar como unhealthy
```

**¿Qué verifica?**

- ✅ Proceso de Celery Beat está corriendo
- ✅ Scheduler está activo

**Estados posibles**:

- `healthy`: Beat está corriendo
- `starting`: Beat está iniciando (primeros 30s)
- `unhealthy`: Proceso no existe o está colgado

---

## 🚀 Cómo Usar

### Ver Estado de Health Checks

#### Opción 1: Script Automático (Recomendado)

```bash
# Desarrollo
./check-health.sh dev

# Producción
./check-health.sh prod
```

**Output ejemplo**:

```
🏥 Verificando estado de salud de servicios (dev)

📊 Estado de los contenedores:
...

🔍 Health checks detallados:

  ✅ db: Healthy
  ✅ redis: Running (sin healthcheck)
  ✅ minio: Healthy
  ✅ backend: Healthy
  ✅ celery_worker: Healthy
  ✅ celery_beat: Healthy
  ✅ frontend: Running (sin healthcheck)
  ✅ playwright: Healthy

📝 Resumen:
  ✅ Healthy: 8
  ⏳ Starting: 0
  ❌ Unhealthy: 0
  ⏸️  Stopped: 0

✅ Todos los servicios están saludables!
```

#### Opción 2: Docker Compose

```bash
# Ver estado de todos los servicios
docker compose -f docker-compose.dev.yml ps

# Ver health de un servicio específico
docker inspect <container-id> --format='{{.State.Health.Status}}'
```

#### Opción 3: Docker PS

```bash
# Ver todos los contenedores con su estado de salud
docker ps --format "table {{.Names}}\t{{.Status}}"
```

**Output ejemplo**:

```
NAMES                          STATUS
cv-builder-celery_worker-1     Up 5 minutes (healthy)
cv-builder-celery_beat-1       Up 5 minutes (healthy)
cv-builder-backend-1           Up 5 minutes (healthy)
```

---

## 🔍 Debugging Health Checks

### Ver Logs del Health Check

```bash
# Ver últimos logs del healthcheck
docker inspect <container-id> --format='{{range .State.Health.Log}}{{.Output}}{{end}}'

# Ver log completo del healthcheck
docker inspect <container-id> | jq '.[0].State.Health.Log'
```

### Ejecutar Health Check Manualmente

#### Celery Worker

```bash
# Entrar al contenedor
docker compose -f docker-compose.dev.yml exec celery_worker bash

# Ejecutar el comando de health check manualmente
celery -A app.tasks.celery_app inspect ping

# Verificar workers activos
celery -A app.tasks.celery_app inspect active

# Ver estadísticas
celery -A app.tasks.celery_app inspect stats
```

#### Celery Beat

```bash
# Entrar al contenedor
docker compose -f docker-compose.dev.yml exec celery_beat bash

# Verificar que el proceso está corriendo
pgrep -f 'celery.*beat'

# Ver el proceso completo
ps aux | grep celery

# Ver logs en tiempo real
tail -f /var/log/celery-beat.log  # Si existe
```

---

## 🐛 Troubleshooting

### Celery Worker Unhealthy

**Síntomas**:

```bash
docker ps
# celery_worker-1  Up 2 minutes (unhealthy)
```

**Posibles causas y soluciones**:

1. **Redis no disponible**:

```bash
# Verificar que Redis está corriendo
docker compose -f docker-compose.dev.yml ps redis

# Ver logs de Redis
docker compose -f docker-compose.dev.yml logs redis

# Reiniciar Redis si es necesario
docker compose -f docker-compose.dev.yml restart redis
```

2. **Worker bloqueado procesando tarea**:

```bash
# Ver tareas activas
docker compose -f docker-compose.dev.yml exec celery_worker \
  celery -A app.tasks.celery_app inspect active

# Ver tareas reservadas
docker compose -f docker-compose.dev.yml exec celery_worker \
  celery -A app.tasks.celery_app inspect reserved

# Revocar tareas problemáticas
docker compose -f docker-compose.dev.yml exec celery_worker \
  celery -A app.tasks.celery_app control revoke <task-id>
```

3. **Memoria/CPU insuficiente**:

```bash
# Ver uso de recursos
docker stats celery_worker-1

# Si hay problemas de memoria, reiniciar
docker compose -f docker-compose.dev.yml restart celery_worker
```

4. **Error en el código**:

```bash
# Ver logs del worker
docker compose -f docker-compose.dev.yml logs celery_worker --tail=100

# Si hay errores de importación o configuración, reconstruir
docker compose -f docker-compose.dev.yml build celery_worker
docker compose -f docker-compose.dev.yml up -d celery_worker
```

### Celery Beat Unhealthy

**Síntomas**:

```bash
docker ps
# celery_beat-1  Up 2 minutes (unhealthy)
```

**Posibles causas y soluciones**:

1. **Proceso colgado**:

```bash
# Ver logs
docker compose -f docker-compose.dev.yml logs celery_beat --tail=50

# Reiniciar
docker compose -f docker-compose.dev.yml restart celery_beat
```

2. **Archivo de schedule corrupto**:

```bash
# Entrar al contenedor
docker compose -f docker-compose.dev.yml exec celery_beat bash

# Eliminar schedule file y reiniciar
rm -f celerybeat-schedule.db
exit

# Reiniciar beat
docker compose -f docker-compose.dev.yml restart celery_beat
```

3. **Permisos en directorio**:

```bash
# Verificar permisos
docker compose -f docker-compose.dev.yml exec celery_beat ls -la

# Si hay problemas, corregir permisos y reiniciar
docker compose -f docker-compose.dev.yml restart celery_beat
```

---

## 🔧 Configuración Avanzada

### Ajustar Timeouts

Si tus tareas son pesadas y el worker necesita más tiempo:

```yaml
# docker-compose.dev.yml
celery_worker:
  healthcheck:
    interval: 60s # Verificar cada minuto
    timeout: 30s # Timeout más largo
    start_period: 60s # Más tiempo para iniciar
    retries: 5 # Más reintentos
```

### Deshabilitar Health Check Temporalmente

Durante debugging:

```yaml
celery_worker:
  healthcheck:
    disable: true
```

O desde línea de comandos:

```bash
docker compose -f docker-compose.dev.yml up -d --no-healthcheck
```

### Health Check con Autorestart

Los servicios ya tienen `restart: unless-stopped`, lo que significa que si el health check falla repetidamente, Docker reiniciará el contenedor automáticamente.

Para verificar reintentos:

```bash
# Ver número de reinicios
docker ps --format "table {{.Names}}\t{{.Status}}"

# Si ves "Restarting", hay problemas
# Ver por qué está reiniciando
docker compose -f docker-compose.dev.yml logs celery_worker --tail=100
```

---

## 📊 Monitoreo con Health Checks

### Integración con Monitoring Tools

#### Prometheus

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    # ...
    configs:
      - source: prometheus_config
        target: /etc/prometheus/prometheus.yml
```

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "docker"
    static_configs:
      - targets: ["docker-exporter:9323"]
```

#### Grafana Dashboard

Crear dashboard con métricas:

- Container health status
- Health check failures
- Restart count
- Uptime

### Scripts de Monitoreo

#### Check Periódico con Notificaciones

```bash
#!/bin/bash
# check-health-cron.sh

./check-health.sh dev > /dev/null 2>&1
STATUS=$?

if [ $STATUS -ne 0 ]; then
    # Enviar notificación (ejemplo con curl a Slack)
    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"⚠️ Celery services unhealthy!"}' \
      YOUR_SLACK_WEBHOOK_URL
fi
```

Agregar a crontab:

```bash
# Verificar cada 5 minutos
*/5 * * * * /path/to/check-health-cron.sh
```

---

## 📚 Referencias

- [Docker Health Checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Celery Monitoring](https://docs.celeryproject.org/en/stable/userguide/monitoring.html)
- [Celery Management](https://docs.celeryproject.org/en/stable/userguide/workers.html#management-command-line-utilities-inspect-control)

---

## 🎯 Mejores Prácticas

1. ✅ **Siempre usar health checks** en servicios críticos
2. ✅ **Monitorear logs** regularmente con `./check-health.sh`
3. ✅ **Configurar alertas** para servicios unhealthy en producción
4. ✅ **Ajustar timeouts** según carga de trabajo
5. ✅ **Usar el script** `check-health.sh` antes de deployments
6. ✅ **Verificar health** después de cambios en código
7. ✅ **Documentar** comportamientos anormales

---

## 💡 Comandos Útiles Rápidos

```bash
# Ver estado general
./check-health.sh dev

# Reiniciar solo Celery services
docker compose -f docker-compose.dev.yml restart celery_worker celery_beat

# Ver logs en tiempo real
docker compose -f docker-compose.dev.yml logs -f celery_worker celery_beat

# Verificar tareas activas
docker compose -f docker-compose.dev.yml exec celery_worker \
  celery -A app.tasks.celery_app inspect active

# Ver workers conectados
docker compose -f docker-compose.dev.yml exec celery_worker \
  celery -A app.tasks.celery_app inspect ping

# Limpiar y reiniciar todo
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d
./check-health.sh dev
```
