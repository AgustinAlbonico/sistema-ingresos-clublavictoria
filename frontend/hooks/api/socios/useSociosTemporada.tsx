import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { SocioWithFoto } from "@/lib/types";

export const useSociosTemporada = (temporadaId: string) => {
  return useQuery<SocioWithFoto[]>({
    queryKey: ["socios-temporada", temporadaId],
    queryFn: async () => {
      if (!temporadaId) return [];
      const { data } = await apiClient.get<SocioWithFoto[]>(`/temporadas/${temporadaId}/socios`);
      console.log(data);
      return data;
    },
    enabled: !!temporadaId,
  });
};
