# 📜 Scripts de Despliegue y Utilidades

Este directorio contiene scripts útiles para el despliegue y mantenimiento de la plataforma.

---

## 🚀 deploy.sh

Script unificado de despliegue que soporta dos modos de operación:

### Modo Interactivo (por defecto)

Proporciona un menú interactivo con todas las operaciones de despliegue:

```bash
./scripts/deploy.sh
```

#### Funcionalidades disponibles:

**BUILD:**

- ✅ Construir imágenes de backend
- ✅ Construir imágenes de frontend
- ✅ Construir todas las imágenes

**DEPLOY:**

- ✅ Desplegar servicios (Docker Compose)
- ✅ Redesplegar servicios (down + up)
- ✅ Actualizar servicios (pull + up)
- ✅ Desplegar en Docker Swarm

**MONITORING:**

- ✅ Ver logs de todos los servicios
- ✅ Ver logs del frontend
- ✅ Ver logs del backend
- ✅ Ver estado de servicios con métricas

**DATABASE:**

- ✅ Ejecutar migraciones de Alembic
- ✅ Crear superusuario
- ✅ Backup de base de datos (con compresión)
- ✅ Restaurar base de datos

**MAINTENANCE:**

- ✅ Detener servicios
- ✅ Limpiar contenedores y volúmenes
- ✅ Validar configuración

### Modo Docker Swarm

Para despliegues en producción con Docker Swarm:

```bash
./scripts/deploy.sh --swarm
```

**Requisitos:**

- Variable `DOMAIN` configurada en `.env`
- Variable `STACK_NAME` configurada en `.env`
- Variable `TAG` (opcional, default: `latest`)

**Proceso:**

1. Genera `docker-stack.yml` desde `docker-compose.prod.yml`
2. Aplica auto-labels (si está disponible)
3. Despliega el stack con `docker stack deploy`

---

## 📋 Otros Scripts

### build.sh

Construye las imágenes Docker:

```bash
./scripts/build.sh
```

### build-push.sh

Construye y sube imágenes a un registry:

```bash
./scripts/build-push.sh
```

### validate_deployment.sh

Valida la configuración del despliegue:

```bash
./scripts/validate_deployment.sh
```

### validate_dev_environment.sh

Valida el entorno de desarrollo:

```bash
./scripts/validate_dev_environment.sh
```

---

## 🔧 Configuración Requerida

Asegúrate de tener un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Dominio
DOMAIN=example.com

# Docker Swarm (si aplica)
STACK_NAME=feature-models
TAG=latest

# Imágenes Docker
DOCKER_IMAGE_BACKEND=feature-models-backend
DOCKER_IMAGE_FRONTEND=feature-models-frontend

# Base de datos
POSTGRES_USER=postgres
POSTGRES_DB=featuremodels
POSTGRES_PASSWORD=changeme

# API
VITE_API_URL=https://api.example.com
```

---

## 📖 Ejemplos de Uso

### Flujo completo de despliegue

```bash
# 1. Construir imágenes
./scripts/deploy.sh
# Seleccionar opción 3 (Construir todas las imágenes)

# 2. Desplegar servicios
# Seleccionar opción 4 (Desplegar servicios)

# 3. Ejecutar migraciones
# Seleccionar opción 12 (Ejecutar migraciones)

# 4. Ver logs
# Seleccionar opción 8 (Ver logs de todos los servicios)
```

### Backup de base de datos

```bash
./scripts/deploy.sh
# Seleccionar opción 14 (Backup de base de datos)
```

Los backups se guardan en `backups/backup_YYYYMMDD_HHMMSS.sql.gz`

### Despliegue en Docker Swarm

```bash
# Configurar variables
export DOMAIN=myapp.com
export STACK_NAME=feature-models-prod
export TAG=v1.0.0

# Desplegar
./scripts/deploy.sh --swarm

# Ver servicios desplegados
docker stack services feature-models-prod
```

---

## ⚠️ Advertencias

### Operaciones Destructivas

Algunas operaciones son **irreversibles** y eliminarán datos:

- **Opción 17 (Limpiar contenedores y volúmenes)**: Elimina la base de datos
- **Opción 15 (Restaurar base de datos)**: Sobrescribe la base de datos actual

Estas operaciones requieren confirmación explícita escribiendo `SI`.

### Backups

Siempre crea un backup antes de:

- Aplicar migraciones importantes
- Actualizar servicios en producción
- Realizar cambios en el esquema de base de datos

---

## 🐛 Troubleshooting

### Error: "Variable not set"

```bash
# Solución: Verificar que el archivo .env existe
ls -la .env

# Si no existe, copiarlo desde el ejemplo
cp .env.example .env
```

### Error: "docker-compose command not found"

```bash
# Instalar docker-compose
sudo apt-get install docker-compose
```

### Servicios no se inician

```bash
# Ver logs detallados
./scripts/deploy.sh
# Seleccionar opción 8 (Ver logs)

# Verificar estado
# Seleccionar opción 11 (Ver estado)
```

### Base de datos no responde

```bash
# Verificar que el contenedor de BD está corriendo
docker-compose -f docker-compose.prod.yml ps

# Ver logs de la base de datos
docker-compose -f docker-compose.prod.yml logs db
```

---

## 📞 Soporte

Para más información, consulta:

- [Documentación de comandos](/backend/docs/commands.md)
- [Guía de despliegue](/deployment.md)
- [Guía de desarrollo](/development.md)

---

**Última actualización**: 2 de diciembre de 2025
