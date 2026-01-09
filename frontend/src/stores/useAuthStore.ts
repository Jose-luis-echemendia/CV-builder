import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { OpenAPI } from "../client/core/OpenAPI"
import type { UserPublic } from "../client/types.gen"

type AuthUser = UserPublic | null

interface AuthState {
  token: string | null
  user: AuthUser
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: (partial: AuthState | Partial<AuthState> | ((state: AuthState) => AuthState | Partial<AuthState>), replace?: boolean | undefined) => void) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: (token: string | null) => {
        OpenAPI.TOKEN = token ?? undefined
        set({ token, isAuthenticated: !!token })
      },

      setUser: (user: AuthUser) => set({ user }),

      logout: () => {
        // Limpiar cliente API
        OpenAPI.TOKEN = undefined
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state: AuthState | undefined) => {
        if (state?.token) {
          OpenAPI.TOKEN = state.token
        }
      },
    },
  ),
)

export default useAuthStore
