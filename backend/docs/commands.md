# 📚 Comandos Esenciales del Backend

Este documento contiene todos los comandos importantes para trabajar con el backend.

---

## 🗄️ Comandos de Base de Datos

### Migraciones con Alembic

#### Crear una nueva migración (auto-detecta cambios)

```bash
alembic revision --autogenerate -m "descripción de los cambios"
```

**Ejemplos**:

```bash
alembic revision --autogenerate -m "add user roles"
alembic revision --autogenerate -m "add feature constraints table"
alembic revision --autogenerate -m "update feature model relationships"
```

#### Crear una nueva migración manual

```bash
alembic revision -m "descripción de los cambios"
```

**Ejemplos**:

```bash
alembic revision -m "add user roles"
alembic revision -m "add feature constraints table"
alembic revision -m "update feature model relationships"
```

#### Aplicar migraciones pendientes

```bash
alembic upgrade head
```

#### Ver historial de migraciones

```bash
alembic history
```

#### Ver migración actual

```bash
alembic current
```

#### Revertir última migración

```bash
alembic downgrade -1
```

#### Revertir a una revisión específica

```bash
alembic downgrade <revision_id>
```

#### Revertir todas las migraciones

```bash
alembic downgrade base
```

---

## 🌱 Comandos de Seeding (Población de Datos)

### Ejecutar seeding completo (automático según entorno)

```bash
python -m app.seed.main
```

- **Producción/Staging**: Solo datos esenciales (settings, FIRST_SUPERUSER, usuarios de producción)
- **Local/Development**: Datos completos (esenciales + ejemplos + usuarios de prueba)

### Script Legacy (redirige a seed.main)

```bash
python -m app.seed_data
```

---

## 🐳 Comandos de Docker

### Desarrollo Local

#### Iniciar todos los servicios

```bash
docker-compose -f docker-compose.dev.yml up
```

#### Iniciar en segundo plano (detached)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### Reconstruir imágenes antes de iniciar

```bash
docker-compose -f docker-compose.dev.yml up --build
```

#### Ver logs de un servicio específico

```bash
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f db
docker-compose -f docker-compose.dev.yml logs -f redis
```

#### Detener todos los servicios

```bash
docker-compose -f docker-compose.dev.yml down
```

#### Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)

```bash
docker-compose -f docker-compose.dev.yml down -v
```

#### Ejecutar comandos dentro del contenedor backend

```bash
docker-compose -f docker-compose.dev.yml exec backend bash
docker-compose -f docker-compose.dev.yml exec backend python -m pytest
docker-compose -f docker-compose.dev.yml exec backend alembic upgrade head
```

#### Reiniciar solo el backend

```bash
docker-compose -f docker-compose.dev.yml restart backend
```

### Producción

#### Iniciar servicios de producción

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Ver logs de producción

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

#### Detener servicios de producción

```bash
docker-compose -f docker-compose.prod.yml down
```

---

## 🧪 Comandos de Testing

### Ejecutar todos los tests

```bash
pytest
```

### Ejecutar tests con cobertura

```bash
pytest --cov=app --cov-report=html
```

### Ejecutar tests específicos

```bash
pytest tests/test_users.py
pytest tests/test_users.py::test_create_user
```

### Ejecutar tests en modo verbose

```bash
pytest -v
```

### Ejecutar tests y detener en el primer fallo

```bash
pytest -x
```

---

## 🚀 Comandos del Servidor (Desarrollo sin Docker)

### Iniciar servidor de desarrollo con Uvicorn

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Con hot-reload y logs detallados

```bash
uvicorn app.main:app --reload --log-level debug
```

---

## 📦 Comandos de Dependencias

### Instalar dependencias

```bash
pip install -r requirements.txt
```

### Instalar dependencias de desarrollo

```bash
pip install -r requirements-dev.txt
```

### Actualizar requirements desde Poetry (si usas Poetry)

```bash
poetry export -f requirements.txt --output requirements.txt --without-hashes
```

### Ver dependencias instaladas

```bash
pip list
pip freeze
```

---

## 🔍 Comandos de Debugging

### Acceder a shell interactivo de Python con contexto de la app

```bash
python -c "from app.core.db import engine; from sqlmodel import Session; session = Session(engine); print('Session ready')"
```

### Ver configuración actual

```bash
python -c "from app.core.config import settings; print(settings.model_dump())"
```

### Verificar conexión a base de datos

```bash
python app/backend_pre_start.py
```

---

## 🧹 Comandos de Limpieza

### Limpiar archivos Python compilados

```bash
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

### Limpiar cache de pytest

```bash
rm -rf .pytest_cache
```

### Limpiar coverage reports

```bash
rm -rf htmlcov .coverage
```

---

## 🔧 Comandos de Mantenimiento

### Crear backup de la base de datos

```bash
docker-compose -f docker-compose.dev.yml exec db pg_dump -U postgres featuremodels > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup

```bash
docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres featuremodels < backup_20231124_120000.sql
```

### Limpiar volúmenes Docker no usados

```bash
docker volume prune
```

### Ver uso de espacio de Docker

```bash
docker system df
```

---

## 📝 Comandos Útiles de Desarrollo

### Formatear código con Black

```bash
black app/
```

### Ordenar imports con isort

```bash
isort app/
```

### Linter con Flake8

```bash
flake8 app/
```

### Type checking con MyPy

```bash
mypy app/
```

### Ejecutar pre-commit hooks manualmente

```bash
pre-commit run --all-files
```

---

## 🔐 Comandos de Seguridad

### Generar SECRET_KEY nueva

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Hashear una contraseña

```bash
python -c "from passlib.context import CryptContext; pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto'); print(pwd_context.hash('mi_password'))"
```

---

## 📊 Comandos de Monitoreo

### Ver estado de Celery workers

```bash
docker-compose -f docker-compose.dev.yml exec celery_worker celery -A app.worker inspect active
```

### Ver tareas en cola

```bash
docker-compose -f docker-compose.dev.yml exec celery_worker celery -A app.worker inspect reserved
```

### Purgar todas las tareas de Celery

```bash
docker-compose -f docker-compose.dev.yml exec celery_worker celery -A app.worker purge
```

---

## 🚦 Flujo Típico de Desarrollo

### 1. Inicio del día (primera vez)

```bash
# Clonar repositorio (solo primera vez)
git clone <repository-url>
cd feature_model

# Copiar variables de entorno
cp .env.example .env

# Iniciar servicios
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f backend
```

### 2. Hacer cambios en modelos

```bash
# 1. Modificar models en app/models/

# 2. Crear migración
docker-compose -f docker-compose.dev.yml exec backend alembic revision --autogenerate -m "descripción"

# 3. Aplicar migración
docker-compose -f docker-compose.dev.yml exec backend alembic upgrade head

# 4. Si necesitas datos nuevos, ejecutar seeding
docker-compose -f docker-compose.dev.yml exec backend python -m app.seed.main
```

### 3. Ejecutar tests

```bash
docker-compose -f docker-compose.dev.yml exec backend pytest -v
```

### 4. Limpiar y reiniciar desde cero

```bash
# ⚠️ CUIDADO: Esto borra toda la base de datos
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

---

## 📌 Notas Importantes

- **Migraciones**: Siempre revisa las migraciones autogeneradas antes de aplicarlas
- **Seeding**: El seeding es automático en desarrollo, manual en producción
- **Backups**: Haz backups antes de cambios importantes en la BD
- **Testing**: Ejecuta tests antes de hacer commits importantes
- **Logs**: Usa `docker-compose logs -f` para ver logs en tiempo real

---

## 🆘 Comandos de Emergencia

### Backend no responde

```bash
docker-compose -f docker-compose.dev.yml restart backend
```

### Base de datos corrupta

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Limpiar todo y empezar de nuevo

```bash
docker-compose -f docker-compose.dev.yml down -v
docker system prune -a
docker-compose -f docker-compose.dev.yml up --build
```

---

**Última actualización**: 24 de noviembre de 2025
