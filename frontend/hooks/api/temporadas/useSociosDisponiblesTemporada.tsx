"use client";

import { usePaginatedSearchQuery } from "../common/usePaginatedSearchQuery";
import { SocioWithFoto } from "@/lib/types";

export const useSociosDisponiblesTemporada = (temporadaId: string | null) => {
  const enabled = Boolean(temporadaId);

  const query = usePaginatedSearchQuery<SocioWithFoto>({
    queryKey: temporadaId ? `socios-${temporadaId}` : "socios",
    url: temporadaId ? `/temporadas/${temporadaId}/socios-disponibles` : "",
    initialLimit: 10,
    enabled,
  });

  return {
    ...query,
    enabled,
  };
};
