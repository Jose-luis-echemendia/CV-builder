#!/bin/bash

# Script para sincronizar package-lock.json con package.json
# Uso: ./sync-deps.sh

set -e

echo "🔄 Sincronizando package-lock.json con package.json..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    echo "   Ejecuta este script desde el directorio frontend/"
    exit 1
fi

# Backup del lock file actual (por si acaso)
if [ -f "package-lock.json" ]; then
    echo "📦 Creando backup de package-lock.json..."
    cp package-lock.json package-lock.json.backup
fi

# Eliminar node_modules y lock file para forzar reinstalación limpia
echo "🗑️  Limpiando node_modules y package-lock.json..."
rm -rf node_modules package-lock.json

# Instalar dependencias (esto regenerará package-lock.json)
echo "📥 Instalando dependencias..."
npm install

echo ""
echo "✅ Sincronización completada!"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Verifica que la aplicación funcione: npm run dev"
echo "   2. Commitea el nuevo package-lock.json:"
echo "      git add package-lock.json"
echo "      git commit -m 'chore: sync package-lock.json'"
echo ""
echo "🐳 Ahora puedes hacer build de Docker sin errores"
