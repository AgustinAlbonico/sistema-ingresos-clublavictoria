// hooks/api/socios/useUpdateSocio.ts
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MENSAJES_EXITO } from "@/lib/constants";
import { apiClient } from "@/lib/api/client";
import { AxiosError, AxiosResponse } from "axios";
import { SocioWithFoto } from "@/lib/types";

export const useCreateSocio = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    AxiosResponse<SocioWithFoto>, // tipo de respuesta
    AxiosError<{ message: string }>, // tipo de error
    FormData // input
  >({
    mutationFn: (data) => apiClient.post(`/socios`, data),
    onSuccess: (response) => {
      toast.success(MENSAJES_EXITO.SOCIO_CREADO);

      // Actualiza la cache del socio específico
      queryClient.setQueryData(["socio", response.data.id], response.data);

      // Si tenés un listado de socios, invalida para refrescarlo
      queryClient.invalidateQueries({ queryKey: ["socios"] });
    },
    onError: (error) => {
      // TypeScript ya sabe que response.data tiene message
      const message = error.response?.data?.message ?? "Error al crear socio";
      toast.error(message);
      console.log("Error completo:", error);
    },
  });

  return mutation;
};
