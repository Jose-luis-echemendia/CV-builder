import path from "node:path"
import tailwindcss from "@tailwindcss/vite" // <--- 1. Importa el plugin de Tailwind
import { TanStackRouterVite } from "@tanstack/router-vite-plugin"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tailwindcss(), // <--- 2. Añade el plugin aquí
    react(),
    TanStackRouterVite(),
  ],
  server: {
    host: true, // Permite conexiones externas (Docker)
    port: 5173,
    watch: {
      usePolling: true, // <--- 3. OBLIGATORIO para que detecte cambios en Docker
    },
    hmr: {
      clientPort: 5173, // Asegura que el HMR use el puerto correcto en tu navegador
    },
  },
})
