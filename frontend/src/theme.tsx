import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"

export const system = createSystem(defaultConfig, {
  globalCss: {
    html: {
      fontSize: "16px",
      fontFamily: "'Space Grotesk', sans-serif",
    },
    body: {
      fontSize: "0.875rem",
      fontFamily: "'Space Grotesk', sans-serif",
      margin: 0,
      padding: 0,
    },
    ".main-link": {
      color: "ui.main",
      fontWeight: "bold",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Space Grotesk', sans-serif" },
        body: { value: "'Space Grotesk', sans-serif" },
        mono: { value: "'Space Grotesk', sans-serif" },
      },
      colors: {
        ui: {
          main: { value: "#009688" },
        },
        brand: {
          // ── Fondos ────────────────────────────────────────────────
          bg:        { value: "#000000" }, // fondo base de toda la app
          bgCard:    { value: "#111111" }, // fondo de tarjetas y paneles
          bgMuted:   { value: "#1A1A1A" }, // superficies elevadas sobre bgCard
          border:    { value: "#2A2A2A" }, // bordes de cards y separadores (≈ surface-container-highest)

          // ── Primario · Indigo/Purple ───────────────────────────────
          primary:       { value: "#a3a6ff" }, // color principal: botón Login, "ARM YOURSELF.", acentos
          primaryHover:  { value: "#4F46E5" }, // estado hover de primary
          primaryLight:  { value: "#C7D2FE" }, // fondo claro: tarjeta Pro destacada
          primarySubtle: { value: "#1E1B4B" }, // fondo oscuro: botón GO PRO

          // ── Secundario · Pink/Red ──────────────────────────────────
          secondary:      { value: "#F43F5E" }, // badges ("THE SELECTION", "MOST AGGRESSIVE"), subrayados CTA
          secondaryHover: { value: "#E11D48" }, // estado hover de secondary

          // ── Terciario · Emerald ────────────────────────────────────
          tertiary: { value: "#10B981" }, // checkmarks de features, acentos de confirmación

          // ── Textos ─────────────────────────────────────────────────
          textPrimary: { value: "#0f00a4" }, // texto principal sobre fondos oscuros
          surface:     { value: "#FFFFFF" }, // fondo de superficies elevadas (≈ surface-container-highest)
          textMuted:   { value: "#9CA3AF" }, // texto secundario, subtítulos, descripciones
          textInverse: { value: "#000000" }, // texto sobre fondos claros (ej: primaryLight)
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
})
