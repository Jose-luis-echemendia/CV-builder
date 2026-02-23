# 🌐 Solución: Errores de Red en Docker Build (npm timeout)

## ❌ Problema

Al construir el Docker del frontend, aparece este error:

```
npm error code ETIMEDOUT
npm error errno ETIMEDOUT
npm error network request to https://registry.npmjs.org/picomatch/-/picomatch-4.0.3.tgz failed
npm error network This is a problem related to network connectivity.
```

**Causa**: Timeout al descargar paquetes de npm dentro del contenedor Docker.

---

## ✅ Soluciones (de más rápida a más completa)

### Opción 1: Script Automático (Recomendado) ⚡

Usa el script que descarga dependencias localmente primero:

```bash
cd /home/jose/Escritorio/Work/CV-builder
./build-with-cache.sh
```

**Ventajas**:

- ✅ Descarga dependencias en tu máquina local (mejor conectividad)
- ✅ Docker solo copia los archivos (sin descargas)
- ✅ Más rápido en builds subsecuentes
- ✅ Manejo automático de errores

### Opción 2: Build Manual con Volumen de Caché

El `docker-compose.dev.yml` ya está configurado con un volumen de caché:

```bash
# Primera vez (puede tardar)
docker compose -f docker-compose.dev.yml build frontend

# Subsecuentes builds usarán caché
docker compose -f docker-compose.dev.yml up -d --build
```

El volumen `npm_cache` persiste las descargas entre builds.

### Opción 3: Build con BuildKit y Mejor Red

```bash
# Habilitar BuildKit
export DOCKER_BUILDKIT=1

# Build con logs detallados
docker compose -f docker-compose.dev.yml build --progress=plain frontend

# Si falla, reintentar solo frontend
docker compose -f docker-compose.dev.yml build --no-cache frontend
```

### Opción 4: Instalación Local + COPY

Instala dependencias localmente y Docker las copiará:

```bash
cd frontend

# Instalar localmente
npm install

# Volver y hacer build
cd ..
docker compose -f docker-compose.dev.yml build frontend
```

Con `node_modules` local, el Dockerfile usa el volumen montado.

---

## 🔧 Optimizaciones Aplicadas

### 1. Dockerfile.dev con Mejor Configuración de Red

```dockerfile
# Configure npm for better network handling
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5 && \
    npm config set maxsockets 5

# Install with network optimizations
RUN npm install --prefer-online --no-audit --loglevel=verbose && \
    npm cache clean --force
```

**Cambios**:

- ⏱️ Timeouts más largos (120s max)
- 🔄 5 reintentos automáticos
- 🌐 `--prefer-online` para forzar descarga fresca
- 📦 Menos sockets concurrentes (5) para evitar saturación

### 2. Archivo .npmrc

Creado en `frontend/.npmrc`:

```
fetch-retry-maxtimeout=120000
fetch-retry-mintimeout=10000
fetch-retries=5
fetch-timeout=300000
maxsockets=5
prefer-online=true
audit=false
fund=false
```

### 3. Volumen de Caché en docker-compose.dev.yml

```yaml
frontend:
  volumes:
    - ./frontend:/app
    - /app/node_modules
    - npm_cache:/root/.npm # ← Nuevo: persiste caché entre builds

volumes:
  npm_cache: # ← Volumen para caché de npm
```

**Beneficio**: Las descargas se guardan y reutilizan entre builds.

---

## 🚀 Flujo Recomendado

### Para Desarrollo Diario

```bash
# Opción A: Script automático (primera vez o después de cambios en package.json)
./build-with-cache.sh

# Opción B: Solo up (si ya está construido)
docker compose -f docker-compose.dev.yml up -d
```

### Para Builds Limpios

```bash
# Limpiar todo y reconstruir
docker compose -f docker-compose.dev.yml down -v
docker volume rm cv-builder_npm_cache
./build-with-cache.sh
```

### Para Problemas de Red Persistentes

```bash
cd frontend

# Instalar localmente con reintentos
npm install --prefer-online --fetch-retries=10

# Verificar que funciona
npm run dev

# Luego construir Docker
cd ..
docker compose -f docker-compose.dev.yml up -d --build
```

---

## 🐛 Troubleshooting

### Error persiste después de todo

1. **Verificar conectividad**:

```bash
# Probar npm registry
curl -I https://registry.npmjs.org/

# Probar dentro de Docker
docker run --rm node:20-alpine sh -c "npm config set fetch-retries 5 && npm install express"
```

2. **Limpiar todo**:

```bash
# Limpiar Docker
docker system prune -a --volumes

# Limpiar npm local
cd frontend
rm -rf node_modules package-lock.json .npmrc
npm cache clean --force

# Reinstalar
npm install
```

3. **Verificar proxy/firewall**:

```bash
# Si estás detrás de un proxy corporativo
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# En Dockerfile, agregar:
ENV HTTP_PROXY=http://proxy.company.com:8080
ENV HTTPS_PROXY=http://proxy.company.com:8080
```

### Build extremadamente lento

```bash
# Usar mirror de npm más cercano (opcional)
npm config set registry https://registry.npmmirror.com/

# O mantener el oficial pero con mejores timeouts
npm config set registry https://registry.npmjs.org/
npm config set fetch-timeout 300000
```

### Timeout en paquete específico

```bash
# Identificar el paquete problemático en los logs
# Instalarlo manualmente primero
npm install picomatch@4.0.3 --save-dev

# Luego build
docker compose -f docker-compose.dev.yml build frontend
```

---

## 📊 Comparación de Métodos

| Método                | Velocidad | Robustez | Uso                            |
| --------------------- | --------- | -------- | ------------------------------ |
| **Script automático** | ⚡⚡⚡    | 🛡️🛡️🛡️   | Primera build, cambios de deps |
| **Volumen de caché**  | ⚡⚡      | 🛡️🛡️     | Builds subsecuentes            |
| **npm install local** | ⚡⚡⚡    | 🛡️🛡️🛡️   | Problemas persistentes         |
| **Build sin caché**   | ⚡        | 🛡️       | Debugging, builds limpios      |

---

## 💡 Prevención

### 1. Mantener node_modules local actualizado

```bash
# Antes de hacer build de Docker
cd frontend
npm install
cd ..
./build-with-cache.sh
```

### 2. Usar el volumen de caché siempre

Ya está configurado en `docker-compose.dev.yml`, solo asegúrate de no hacer `down -v` a menos que quieras limpiar todo.

### 3. Monitorear logs de build

```bash
# Ver logs completos durante build
docker compose -f docker-compose.dev.yml build --progress=plain frontend 2>&1 | tee build.log
```

---

## 📚 Archivos Creados/Modificados

1. ✅ [frontend/Dockerfile.dev](../frontend/Dockerfile.dev) - Configuración de red optimizada
2. ✅ [frontend/Dockerfile](../frontend/Dockerfile) - Configuración de red para producción
3. ✅ [frontend/.npmrc](../frontend/.npmrc) - Configuración persistente de npm
4. ✅ [docker-compose.dev.yml](../docker-compose.dev.yml) - Volumen de caché agregado
5. ✅ [build-with-cache.sh](../build-with-cache.sh) - Script de build inteligente

---

## 🎯 Siguiente Paso Recomendado

**Ejecuta el script de build optimizado**:

```bash
cd /home/jose/Escritorio/Work/CV-builder
./build-with-cache.sh
```

Este script:

1. ✅ Descarga dependencias localmente (mejor red)
2. ✅ Construye Docker con caché
3. ✅ Maneja errores automáticamente
4. ✅ Muestra progreso claro
5. ✅ Inicia los servicios al finalizar

---

## 📖 Referencias

- [npm config documentation](https://docs.npmjs.com/cli/v10/using-npm/config)
- [Docker BuildKit](https://docs.docker.com/build/buildkit/)
- [npm network troubleshooting](https://docs.npmjs.com/common-errors)
- [Docker volumes](https://docs.docker.com/storage/volumes/)
