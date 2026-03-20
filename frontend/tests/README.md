# 🎭 Playwright Tests - Guía Rápida

## 🚀 Inicio Rápido

### Ejecutar Tests en Docker (Recomendado)

```bash
# Desde la raíz del proyecto

# Todos los tests
./run-playwright-tests.sh all

# Test específico
./run-playwright-tests.sh tests/login.spec.ts

# Ver reporte
./run-playwright-tests.sh report
```

### Ejecutar Tests Localmente

```bash
cd frontend

# Instalar dependencias (primera vez)
npm install
npx playwright install --with-deps

# Ejecutar tests
npm run test              # Todos los tests
npx playwright test       # Con más control
npx playwright test --ui  # Modo UI interactivo
```

---

## 📁 Estructura

```
tests/
├── auth.setup.ts          # Setup de autenticación
├── config.ts              # Configuración compartida
├── login.spec.ts          # Tests de login
├── reset-password.spec.ts # Tests de reset password
├── sign-up.spec.ts        # Tests de registro
├── user-settings.spec.ts  # Tests de configuración de usuario
└── utils/                 # Utilidades compartidas
```

---

## 🎯 Comandos Útiles

### Con el Script Helper

```bash
./run-playwright-tests.sh all      # Ejecutar todos
./run-playwright-tests.sh ui       # Modo UI (interactivo)
./run-playwright-tests.sh headed   # Ver navegador en acción
./run-playwright-tests.sh debug    # Modo debug paso a paso
./run-playwright-tests.sh report   # Abrir reporte HTML
./run-playwright-tests.sh codegen  # Grabar nuevos tests
./run-playwright-tests.sh shell    # Shell en contenedor
./run-playwright-tests.sh clean    # Limpiar resultados
```

### Comandos Docker Directos

```bash
# Ejecutar en contenedor
docker compose -f docker-compose.dev.yml exec playwright npx playwright test

# Test específico
docker compose -f docker-compose.dev.yml exec playwright \
  npx playwright test tests/login.spec.ts

# Solo Chromium
docker compose -f docker-compose.dev.yml exec playwright \
  npx playwright test --project=chromium

# Con grep (pattern)
docker compose -f docker-compose.dev.yml exec playwright \
  npx playwright test --grep="login"
```

### Comandos Locales

```bash
# Todos los tests
npx playwright test

# Modo interactivo UI
npx playwright test --ui

# Solo un navegador
npx playwright test --project=chromium

# Ver navegador en acción
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Grabar nuevos tests
npx playwright codegen http://localhost:5173
```

---

## 📊 Reportes

### Ver Reportes

```bash
# Opción 1: Con el script
./run-playwright-tests.sh report

# Opción 2: Docker directo
docker compose -f docker-compose.dev.yml exec playwright \
  npx playwright show-report

# Opción 3: Abrir archivo directamente
# frontend/playwright-report/index.html
```

### Tipos de Reportes

- **HTML**: Reporte visual completo (`playwright-report/`)
- **JSON**: Datos estructurados (`test-results/results.json`)
- **Terminal**: Output en consola durante ejecución

---

## ✍️ Escribir Tests

### Template Básico

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    // Setup antes de cada test
    await page.goto("/");
  });

  test("should do something", async ({ page }) => {
    // Arrange
    await page.fill('[data-testid="input"]', "value");

    // Act
    await page.click('[data-testid="submit"]');

    // Assert
    await expect(page.locator('[data-testid="result"]')).toContainText(
      "Expected text",
    );
  });
});
```

### Grabar Tests Automáticamente

```bash
# Inicia el codegen
./run-playwright-tests.sh codegen

# O localmente
npx playwright codegen http://localhost:5173

# Interactúa con la aplicación y Playwright generará el código
```

---

## 🔧 Configuración

### playwright.config.ts

Archivo de configuración principal. Ajusta:

- **workers**: Número de tests en paralelo
- **retries**: Reintentos en caso de fallo
- **timeout**: Timeout global de tests
- **projects**: Navegadores a testear

### Variables de Entorno

Configurables en `.env` o docker-compose:

```bash
VITE_API_URL=http://backend:8000  # API backend
BASE_URL=http://frontend:5173      # URL del frontend
NODE_ENV=test                       # Modo test
CI=true                            # Modo CI
```

---

## 🐛 Debugging

### Modo Debug

```bash
# Con el script
./run-playwright-tests.sh debug

# Docker directo
docker compose -f docker-compose.dev.yml exec playwright \
  npx playwright test --debug

# Local
npx playwright test --debug
```

### Ver Traces

```bash
# Ejecutar con traces
docker compose -f docker-compose.dev.yml exec playwright \
  npx playwright test --trace on

# Ver trace de un test fallido
docker compose -f docker-compose.dev.yml exec playwright \
  npx playwright show-trace test-results/.../trace.zip
```

### Screenshots y Videos

```bash
# Screenshots en fallos
npx playwright test --screenshot=only-on-failure

# Videos de todos los tests
npx playwright test --video=on

# Videos solo de fallos
npx playwright test --video=retain-on-failure
```

---

## 💡 Tips y Mejores Prácticas

### 1. Usar data-testid

```tsx
// En el componente
<button data-testid="submit-button">Submit</button>;

// En el test
await page.click('[data-testid="submit-button"]');
```

### 2. Esperas Implícitas

```typescript
// ✅ Bueno - Playwright espera automáticamente
await expect(page.locator(".result")).toBeVisible();

// ❌ Malo - Espera fija
await page.waitForTimeout(5000);
```

### 3. Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="submit"]');
  }
}

// En el test
const loginPage = new LoginPage(page);
await loginPage.login("user@example.com", "password");
```

### 4. Fixtures Personalizados

```typescript
// fixtures.ts
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/login");
    await page.fill('[data-testid="email"]', "user@test.com");
    await page.fill('[data-testid="password"]', "password");
    await page.click('[data-testid="submit"]');
    await use(page);
  },
});

// En el test
test("admin action", async ({ authenticatedPage }) => {
  // Ya estás autenticado
});
```

---

## 🚨 Troubleshooting

### Tests fallan con "Target closed"

```typescript
// Aumentar timeout
test.setTimeout(60000);  // 60 segundos

// O en el config
timeout: 60000,
```

### "Connection refused" error

Verifica que los servicios estén corriendo:

```bash
docker compose -f docker-compose.dev.yml ps
```

### Permisos en test-results

```bash
sudo chown -R $USER:$USER frontend/test-results frontend/playwright-report
```

### Limpiar y reiniciar

```bash
# Limpiar resultados
./run-playwright-tests.sh clean

# Limpiar caché de Docker
docker volume rm cv-builder_playwright_cache

# Reconstruir
docker compose -f docker-compose.dev.yml build playwright
docker compose -f docker-compose.dev.yml up -d playwright
```

---

## 📚 Recursos

- [Documentación Oficial de Playwright](https://playwright.dev/)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selector Strategies](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## 🎯 Workflow Recomendado

### Desarrollo de Tests

1. **Grabar interacción**: `./run-playwright-tests.sh codegen`
2. **Refinar test**: Editar el código generado
3. **Ejecutar**: `./run-playwright-tests.sh tests/nuevo-test.spec.ts`
4. **Debug si falla**: `./run-playwright-tests.sh debug`
5. **Ver reporte**: `./run-playwright-tests.sh report`

### Antes de Commit

```bash
# Ejecutar todos los tests
./run-playwright-tests.sh all

# Verificar que pasen
# Si hay fallos, revisar el reporte
./run-playwright-tests.sh report
```

### CI/CD

Los tests se ejecutan automáticamente en CI/CD. Para replicar localmente:

```bash
# Modo CI
CI=true npx playwright test --reporter=github
```

---

## 📞 Ayuda

Si tienes problemas:

1. Ejecuta `./run-playwright-tests.sh shell` para inspeccionar
2. Verifica los logs: `docker compose -f docker-compose.dev.yml logs playwright`
3. Limpia y reconstruye todo

Happy Testing! 🎭
