// hooks/api/socios/useUpdateSocio.ts
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MENSAJES_EXITO } from "@/lib/constants";
import { apiClient } from "@/lib/api/client";
import { AxiosError, AxiosResponse } from "axios";
import { SocioWithFoto } from "@/lib/types";

export const useUpdateSocio = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    AxiosResponse<SocioWithFoto>,
    AxiosError<{ message: string }>,
    { id: number ; data: FormData }
  >({
    mutationFn: ({ id, data }) => apiClient.put(`/socios/${id}`, data),
    onSuccess: (response) => {
      toast.success(MENSAJES_EXITO.SOCIO_ACTUALIZADO)
      // Actualiza la cache del socio específico
      queryClient.setQueryData(['socio', response.data.id], response.data);

      // Si tenés un listado de socios, invalida para refrescarlo
      queryClient.invalidateQueries({ queryKey: ["socios"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message ?? "Error al crear socio";
      toast.error(message);
      console.log("Error completo:", error);
    },
  });

  return mutation;
};
