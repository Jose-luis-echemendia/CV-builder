import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  type UserRegister,
  UsersService,
} from "@/client"
import useAuthStore from "@/stores/useAuthStore"
import { handleError } from "@/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const setToken = useAuthStore((state) => state.setToken)
  const setUser = useAuthStore((state) => state.setUser)
  const logoutStore = useAuthStore((state) => state.logout)

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),
    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: (err: ApiError) => {
      handleError(err)
      setError((err as any)?.message ?? String(err))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const loginMutation = useMutation({
    mutationFn: (data: AccessToken) =>
      LoginService.loginAccessToken({ requestBody: data }),
    onSuccess: async (data) => {
      // 1. Guardar token (esto actualiza OpenAPI.TOKEN automáticamente en el store)
      setToken(data.access_token)
      setError(null)

      try {
        // 2. Obtener perfil
        const userData = await UsersService.readUserMe()
        setUser(userData)
        navigate({ to: "/" })
      } catch (err) {
        // Si falla obtener el usuario, limpiamos todo
        logoutStore()
        handleError(err as ApiError)
      }
    },
    onError: (err: ApiError) => {
      handleError(err)
      setError((err as any)?.message ?? String(err))
    },
  })

  const logout = () => {
    logoutStore()
    queryClient.clear()
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    token,
    isAuthenticated: !!token,
    error,
    resetError: () => setError(null),
  }
}

export default useAuth

export const isLoggedIn = (): boolean => {
  const token = useAuthStore.getState().token
  return !!token
}
