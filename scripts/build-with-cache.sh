#!/bin/bash

# Script para build optimizado de Docker con mejor manejo de red
# Uso: ./build-with-cache.sh

set -e

echo "🚀 Build optimizado de Docker con caché local de npm"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Cambiar al directorio del proyecto
cd "$(dirname "$0")"

# Función para manejar errores
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Función para success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para info
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.dev.yml" ]; then
    error_exit "docker-compose.dev.yml no encontrado. Ejecuta desde la raíz del proyecto."
fi

info "Paso 1/4: Descargando dependencias localmente..."

# Descargar dependencias del frontend localmente primero
cd frontend

# Si existe node_modules, usar --prefer-offline para ser más rápido
if [ -d "node_modules" ]; then
    info "node_modules existe, usando caché local..."
    npm install --prefer-offline --no-audit --loglevel=error || {
        info "Caché local falló, intentando con --prefer-online..."
        npm install --prefer-online --no-audit --loglevel=error || error_exit "npm install falló"
    }
else
    info "Instalando dependencias desde cero..."
    npm install --no-audit --loglevel=error || error_exit "npm install falló"
fi

success "Dependencias del frontend instaladas localmente"

cd ..

info "Paso 2/4: Deteniendo contenedores existentes..."
docker compose -f docker-compose.dev.yml down || true

info "Paso 3/4: Construyendo imágenes de Docker..."

# Opción 1: Build con caché de BuildKit
export DOCKER_BUILDKIT=1

# Build del backend
info "Building backend..."
docker compose -f docker-compose.dev.yml build backend || error_exit "Build del backend falló"
success "Backend construido"

# Build del frontend (debería ser más rápido con node_modules local)
info "Building frontend..."
docker compose -f docker-compose.dev.yml build frontend || {
    info "Build del frontend falló, intentando sin caché..."
    docker compose -f docker-compose.dev.yml build --no-cache frontend || error_exit "Build del frontend falló completamente"
}
success "Frontend construido"

info "Paso 4/4: Iniciando contenedores..."
docker compose -f docker-compose.dev.yml up -d || error_exit "Inicio de contenedores falló"

echo ""
success "¡Build completado con éxito!"
echo ""
echo "📊 Estado de los contenedores:"
docker compose -f docker-compose.dev.yml ps
echo ""
echo "📝 Ver logs:"
echo "   docker compose -f docker-compose.dev.yml logs -f"
echo ""
echo "🛑 Detener:"
echo "   docker compose -f docker-compose.dev.yml down"
