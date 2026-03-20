#!/usr/bin/env bash

# ════════════════════════════════════════════════════════════════════════════
# Script de Verificación de Dependencias de Prestart
# ════════════════════════════════════════════════════════════════════════════
# 
# Verifica que todos los archivos y scripts necesarios para el prestart
# estén disponibles en el contenedor Docker.
#
# ════════════════════════════════════════════════════════════════════════════

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  🔍 VERIFICACIÓN DE DEPENDENCIAS DE PRESTART${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Contador de errores
ERRORS=0

# Función para verificar archivo
check_file() {
    local file=$1
    local description=$2
    local required=${3:-true}
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        echo -e "   📄 $file"
    else
        if [ "$required" = true ]; then
            echo -e "${RED}❌ $description${NC}"
            echo -e "   📄 $file (NOT FOUND)"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${YELLOW}⚠️  $description (OPCIONAL)${NC}"
            echo -e "   📄 $file (NOT FOUND)"
        fi
    fi
}

# Función para verificar directorio
check_dir() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        echo -e "   📁 $dir"
        echo -e "   📊 Archivos: $(ls -1 $dir 2>/dev/null | wc -l)"
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "   📁 $dir (NOT FOUND)"
        ERRORS=$((ERRORS + 1))
    fi
}

# Función para verificar comando Python
check_python_module() {
    local module=$1
    local description=$2
    
    if python -c "import $module" 2>/dev/null; then
        echo -e "${GREEN}✅ $description${NC}"
        echo -e "   🐍 import $module"
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "   🐍 import $module (FAILED)"
        ERRORS=$((ERRORS + 1))
    fi
}

echo -e "${BLUE}📋 PASO 1: Verificando módulos Python necesarios${NC}"
echo ""
check_python_module "app.backend_pre_start" "Módulo backend_pre_start"
check_python_module "app.seed.main" "Módulo seed.main"
check_python_module "alembic" "Alembic (migraciones)"
echo ""

echo -e "${BLUE}📋 PASO 2: Verificando scripts del backend${NC}"
echo ""
check_file "scripts/prestart.sh" "Script prestart.sh"
check_file "scripts/check_migrations.py" "Script check_migrations.py" false
check_file "scripts/verify_migration_order.sh" "Script verify_migration_order.sh" false
echo ""

echo -e "${BLUE}📋 PASO 3: Verificando scripts de documentación${NC}"
echo ""
check_file "root_scripts/build_docs.sh" "Script build_docs.sh (raíz)" false
check_file "scripts/build_docs.sh" "Script build_docs.sh (backend)" false
echo ""

echo -e "${BLUE}📋 PASO 4: Verificando archivos de configuración${NC}"
echo ""
check_file "alembic.ini" "Configuración de Alembic"
check_file "pyproject.toml" "Configuración del proyecto"
echo ""

echo -e "${BLUE}📋 PASO 5: Verificando directorios principales${NC}"
echo ""
check_dir "app" "Directorio de aplicación"
check_dir "app/seed" "Directorio de seeders"
check_dir "app/alembic" "Directorio de Alembic"
check_dir "app/alembic/migrations" "Directorio de migraciones"
check_dir "docs" "Directorio de documentación backend" false
check_dir "internal_docs" "Directorio de documentación interna" false
echo ""

echo -e "${BLUE}📋 PASO 6: Verificando migraciones de Alembic${NC}"
echo ""
MIGRATION_COUNT=$(find app/alembic/migrations -name "*.py" ! -name "__*" 2>/dev/null | wc -l)
if [ "$MIGRATION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Migraciones encontradas: $MIGRATION_COUNT${NC}"
    echo -e "   📂 app/alembic/migrations/"
    find app/alembic/migrations -name "*.py" ! -name "__*" -exec basename {} \; | head -5
    if [ "$MIGRATION_COUNT" -gt 5 ]; then
        echo -e "   ... y $((MIGRATION_COUNT - 5)) más"
    fi
else
    echo -e "${RED}❌ No se encontraron migraciones${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo -e "${BLUE}📋 PASO 7: Verificando archivos de datos de seed${NC}"
echo ""
check_file "app/seed/data_models.py" "Datos de modelos"
check_file "app/seed/data_users.py" "Datos de usuarios"
check_file "app/seed/data_settings.py" "Datos de configuración"
check_file "app/seed/seeders.py" "Funciones de seeding"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ TODAS LAS VERIFICACIONES PASARON${NC}"
    echo -e "${GREEN}   El servicio prestart tiene todos los recursos necesarios${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${RED}❌ SE ENCONTRARON $ERRORS ERRORES${NC}"
    echo -e "${RED}   Revisa los archivos faltantes antes de ejecutar prestart${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    exit 1
fi
