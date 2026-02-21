# Optimización de Dockerfiles

## 📋 Resumen de Optimizaciones Aplicadas

Todos los Dockerfiles han sido optimizados siguiendo las mejores prácticas de Docker para mejorar:

- **Performance**: Builds más rápidos con mejor uso de caché
- **Seguridad**: Usuario no-root, imágenes Alpine, reducción de superficie de ataque
- **Tamaño**: Imágenes más pequeñas con multi-stage builds
- **Confiabilidad**: Health checks integrados

---

## 🎯 Backend (Python/FastAPI)

### Dockerfile de Producción

**Mejoras aplicadas:**

1. **Multi-stage build** con 2 stages:
   - `builder`: Compila dependencias con herramientas de build
   - `runtime`: Solo runtime dependencies, sin compiladores

2. **Seguridad**:
   - Usuario no-root `appuser` (UID 1001)
   - Solo dependencias de runtime en imagen final
   - `PYTHONDONTWRITEBYTECODE=1` para evitar archivos .pyc

3. **Optimización**:
   - Usa `--no-install-recommends` para paquetes mínimos
   - Limpia cache de apt: `rm -rf /var/lib/apt/lists/*`
   - Usa `uv sync --no-dev` para excluir dependencias de desarrollo

4. **Health check**:

   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
       CMD curl -f http://localhost:8000/api/v1/health || exit 1
   ```

5. **Tamaño reducido**:
   - Imagen base: `python:3.12-slim` (~150MB vs ~1GB de python:3.12)
   - Solo librerías runtime necesarias (libpq5 para PostgreSQL)

### Dockerfile.dev (Desarrollo)

**Características:**

1. **Hot-reload**: Usa `fastapi dev` para auto-reload
2. **Dev dependencies**: Incluye todas las dependencias de desarrollo
3. **Usuario no-root**: `devuser` para desarrollo seguro
4. **Tools de desarrollo**: Incluye git, curl para debugging

**Uso:**

```bash
docker-compose -f docker-compose.dev.yml up backend
```

---

## 🌐 Frontend (React/Vite)

### Dockerfile de Producción

**Mejoras aplicadas:**

1. **Multi-stage build optimizado** con 3 stages:
   - `deps`: Dependencias de producción
   - `builder`: Build del frontend
   - `runtime`: Nginx con assets estáticos

2. **Imágenes Alpine**:
   - `node:20-alpine` (~180MB vs ~1GB de node:20)
   - `nginx:1.27-alpine` (~40MB vs ~150MB de nginx:1)
   - **Resultado**: Imagen final de ~50MB

3. **Cache optimization**:

   ```dockerfile
   # Layer 1: package.json (cambia raramente)
   COPY package*.json ./
   RUN npm ci

   # Layer 2: código fuente (cambia frecuentemente)
   COPY . .
   RUN npm run build
   ```

4. **Seguridad**:
   - Usuario no-root `appuser`
   - Nginx corriendo como usuario no privilegiado
   - Permisos correctos en cache y logs

5. **Performance**:
   - `npm ci` en vez de `npm install` (más rápido y reproducible)
   - `npm cache clean --force` para reducir tamaño
   - Assets pre-comprimidos servidos por Nginx

### Dockerfile.dev (Desarrollo)

**Características:**

1. **Alpine-based**: Imagen más ligera
2. **Hot Module Replacement (HMR)**: Vite dev server con hot-reload
3. **Usuario no-root**: `nodeuser` para desarrollo
4. **Volúmenes**: Se monta código fuente para desarrollo en tiempo real

**Uso:**

```bash
docker-compose -f docker-compose.dev.yml up frontend
```

---

## 📦 .dockerignore Optimizados

### Backend

Excluye:

- `__pycache__/`, `.venv/`, archivos compilados
- Tests, coverage, documentación generada
- IDEs, logs, archivos temporales
- Docker y CI/CD configs

### Frontend

Excluye:

- `node_modules/`, `dist/`, builds
- Cache de Vite, Playwright, tests
- IDEs, logs, archivos temporales
- Docker y CI/CD configs

---

## 🚀 Comparación de Tamaños

### Antes vs Después

| Componente    | Antes  | Después | Reducción |
| ------------- | ------ | ------- | --------- |
| Backend Prod  | ~800MB | ~250MB  | **68%**   |
| Frontend Prod | ~200MB | ~50MB   | **75%**   |
| Backend Dev   | N/A    | ~900MB  | -         |
| Frontend Dev  | ~1.2GB | ~250MB  | **79%**   |

---

## 🔧 Comandos de Build Recomendados

### Producción

```bash
# Backend
docker build -t cv-builder-backend:latest -f backend/Dockerfile backend/

# Frontend (con API URL)
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  -t cv-builder-frontend:latest \
  -f frontend/Dockerfile \
  frontend/
```

### Desarrollo

```bash
# Usar docker-compose para desarrollo
docker-compose -f docker-compose.dev.yml up

# O individualmente
docker-compose -f docker-compose.dev.yml up backend
docker-compose -f docker-compose.dev.yml up frontend
```

### Con BuildKit (más rápido)

```bash
# Habilitar BuildKit para mejor performance
export DOCKER_BUILDKIT=1

# O usar docker buildx
docker buildx build --platform linux/amd64,linux/arm64 \
  -t cv-builder-backend:latest \
  -f backend/Dockerfile \
  backend/
```

---

## 📊 Health Checks

### Backend

- **Endpoint**: `http://localhost:8000/api/v1/health`
- **Intervalo**: 30s
- **Timeout**: 10s
- **Start period**: 40s (tiempo para iniciar)
- **Retries**: 3

### Frontend

- **Endpoint**: `http://localhost/`
- **Intervalo**: 30s
- **Timeout**: 5s
- **Start period**: 10s (Nginx inicia rápido)
- **Retries**: 3

**Verificar health:**

```bash
docker ps
# HEALTHY aparecerá en la columna STATUS después del start period
```

---

## 🔒 Seguridad

### Usuarios No-Root

**Backend:**

- Producción: `appuser` (UID 1001)
- Desarrollo: `devuser` (UID 1001)

**Frontend:**

- Producción: `appuser` (UID 1001)
- Desarrollo: `nodeuser` (UID 1001)

### Escaneo de Vulnerabilidades

```bash
# Escanear imágenes con Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image cv-builder-backend:latest

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image cv-builder-frontend:latest
```

---

## 💡 Mejores Prácticas Aplicadas

1. ✅ **Multi-stage builds** para imágenes pequeñas
2. ✅ **Imágenes Alpine** cuando es posible
3. ✅ **Usuarios no-root** para seguridad
4. ✅ **Health checks** integrados
5. ✅ **Cache optimization** con orden correcto de layers
6. ✅ **.dockerignore** completos
7. ✅ **Limpieza de cache** de package managers
8. ✅ **ENV variables** consolidadas
9. ✅ **BuildKit compatible** con mount cache
10. ✅ **Reproducibilidad** con versiones fijas

---

## 🐛 Troubleshooting

### Builds lentos

```bash
# Limpiar build cache
docker builder prune -a

# Usar BuildKit con cache mount
export DOCKER_BUILDKIT=1
docker build --progress=plain ...
```

### Permisos en desarrollo

```bash
# Si hay problemas con volúmenes, ajustar permisos:
sudo chown -R $USER:$USER ./backend
sudo chown -R $USER:$USER ./frontend
```

### Health check fallando

```bash
# Verificar logs
docker logs <container-id>

# Entrar al contenedor
docker exec -it <container-id> sh

# Probar health check manualmente
curl http://localhost:8000/api/v1/health
```

---

## 📚 Referencias

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [uv Docker Integration](https://docs.astral.sh/uv/guides/integration/docker/)
- [Vite Docker Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Nginx Security](https://nginx.org/en/docs/http/ngx_http_core_module.html#user)
