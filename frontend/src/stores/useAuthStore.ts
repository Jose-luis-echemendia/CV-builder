import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { OpenAPI } from "../client/core/OpenAPI"

export interface UserPublic {
  id: string
  email: string
  full_name?: string | null
  is_active?: boolean
  is_superuser?: boolean
}

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
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: (token: string | null) => {
        OpenAPI.TOKEN = token ?? undefined
        set({ token, isAuthenticated: !!token })
      },

      setUser: (user: AuthUser) => set({ user }),

      logout: () => {
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
