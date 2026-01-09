import { UtilsService } from "@/client" // Ajusta según el nombre generado por tu SDK
import { useQuery } from "@tanstack/react-query"

export const useEnums = () => {
  return useQuery({
    queryKey: ["enums"],
    queryFn: () => UtilsService.readEnums(),
    // IMPORTANTE: Como los enums no cambian casi nunca,
    // configuramos un tiempo de vida largo para no pedirlos de más.
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24, // Mantener en memoria 24 horas
  })
}

export const useRoles = (enabled = false) => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => UtilsService.getRoles(),
    enabled: enabled, // Solo se ejecuta si el usuario es superuser
    staleTime: 1000 * 60 * 60 * 24,
  })
}
