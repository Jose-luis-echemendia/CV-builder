#!/bin/bash
# Script de validación para verificar que la documentación esté correctamente configurada en producción

echo "🔍 Verificando configuración de documentación en producción..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# Función para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

# 1. Verificar que existen las carpetas de documentación
echo "📁 Verificando carpetas..."
[ -d "./docs" ]
check "Carpeta ./docs existe"

[ -d "./internal_docs" ]
check "Carpeta ./internal_docs existe"

[ -f "./internal_docs/mkdocs.yml" ]
check "Archivo mkdocs.yml existe"

# 2. Verificar que el Dockerfile tiene las copias
echo ""
echo "🐋 Verificando Dockerfile..."
grep -q "COPY ./docs /app/docs" Dockerfile
check "Dockerfile copia ./docs"

grep -q "COPY ./internal_docs /app/internal_docs" Dockerfile
check "Dockerfile copia ./internal_docs"

# 3. Verificar docker-compose.prod.yml
echo ""
echo "🐳 Verificando docker-compose.prod.yml..."
grep -q "./docs:/app/docs" docker-compose.prod.yml
check "Volúmenes de ./docs configurados"

grep -q "./internal_docs:/app/internal_docs" docker-compose.prod.yml
check "Volúmenes de ./internal_docs configurados"

# 4. Verificar scripts
echo ""
echo "📜 Verificando scripts..."
[ -f "./scripts/prestart.sh" ]
check "Script prestart.sh existe"

[ -f "./scripts/build_docs.sh" ]
check "Script build_docs.sh existe"

[ -f "./app/sync_docs.py" ]
check "Script sync_docs.py existe"

grep -q "build_docs.sh" scripts/prestart.sh
check "prestart.sh ejecuta build_docs.sh"

# 5. Verificar configuración de FastAPI
echo ""
echo "⚡ Verificando configuración FastAPI..."
grep -q "internal-docs" app/main.py
check "main.py configura ruta /internal-docs/"

grep -q "protect_internal_docs" app/middleware.py
check "middleware.py tiene protect_internal_docs"

# 6. Verificar dependencias
echo ""
echo "📦 Verificando dependencias..."
grep -q "mkdocs" pyproject.toml
check "mkdocs en pyproject.toml"

grep -q "mkdocs-material" pyproject.toml
check "mkdocs-material en pyproject.toml"

# 7. Verificar enum DEVELOPER
echo ""
echo "👤 Verificando rol DEVELOPER..."
grep -q 'DEVELOPER = "DEVELOPER"' app/enums.py
check "Enum DEVELOPER definido en mayúsculas"

ls app/alembic/migrations/*_add_developer_role_to_userrole_enum.py >/dev/null 2>&1
check "Migración de DEVELOPER existe"

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumen de Validación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Pasadas:${NC} $PASSED"
echo -e "${RED}Fallidas:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Toda la configuración está correcta!${NC}"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "1. Ejecutar migración de DEVELOPER en producción"
    echo "2. Crear un usuario con rol DEVELOPER"
    echo "3. Desplegar con: docker-compose -f docker-compose.prod.yml up -d"
    echo "4. Acceder a: https://pizzabackend.srv605590.hstgr.cloud/internal-docs/?token=<TOKEN>"
    exit 0
else
    echo -e "${RED}✗ Hay errores en la configuración. Por favor, revisar.${NC}"
    exit 1
fi
