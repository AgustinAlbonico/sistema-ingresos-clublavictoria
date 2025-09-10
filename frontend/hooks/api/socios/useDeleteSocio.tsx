// hooks/api/useDeleteSocio.ts
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MENSAJES_EXITO } from "@/lib/constants";
import apiClient from "@/lib/api/client";
import { AxiosResponse } from "axios";

export const useDeleteSocio = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation<AxiosResponse<any>, Error, string>({
      mutationFn: (id) => apiClient.delete(`/socios/${id}`),
      onSuccess: () => {
        toast.success(MENSAJES_EXITO.SOCIO_ELIMINADO, {
          position: "top-center",
          duration: 3000,
        });
        queryClient.invalidateQueries({ queryKey: ["socios"] });
      },
      onError: (error) => {
        console.error("Error deleting socio:", error);
        toast.error("Error al eliminar socio");
      },
    });
  
    return mutation;
  };