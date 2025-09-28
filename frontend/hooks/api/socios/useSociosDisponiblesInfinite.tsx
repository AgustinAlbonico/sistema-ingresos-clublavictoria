import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { SocioWithFoto } from "@/lib/types";
import { useMemo } from "react";

interface SociosDisponiblesParams {
  temporadaId: string;
  search?: string;
  limit?: number;
}

interface SociosDisponiblesResponse {
  data: SocioWithFoto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SociosDisponiblesPagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
}

export const useSociosDisponiblesInfinite = ({ 
  temporadaId, 
  search, 
  limit = 10 
}: SociosDisponiblesParams) => {
  const query = useInfiniteQuery<SociosDisponiblesResponse>({
    queryKey: ["socios-disponibles-infinite", temporadaId, search, limit],
    queryFn: async ({ pageParam = 1 }: { pageParam: unknown }) => {
      const page = pageParam as number;
      if (!temporadaId) {
        return {
          data: [],
          total: 0,
          page: 1,
          limit,
          totalPages: 0
        };
      }

      const response = await apiClient.get<SociosDisponiblesResponse>(
        `/temporadas/${temporadaId}/socios-disponibles`,
        {
          params: {
            page,
            limit,
            ...(search && { search })
          }
        }
      );
      return response.data;
    },
    enabled: !!temporadaId,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const allSocios = useMemo(() => {
    return query.data?.pages.flatMap((page: SociosDisponiblesResponse) => page.data) || [];
  }, [query.data]);

  // Get pagination info from the last page
  const paginationInfo = useMemo(() => {
    if (!query.data?.pages.length) {
      return null;
    }

    const lastPage = query.data.pages[query.data.pages.length - 1] as SociosDisponiblesResponse;
    const pagination: SociosDisponiblesPagination = {
      page: lastPage.page,
      totalPages: lastPage.totalPages,
      total: lastPage.total,
      limit: lastPage.limit,
      hasNextPage: lastPage.page < lastPage.totalPages,
    };

    return pagination;
  }, [query.data]);

  return {
    ...query,
    socios: allSocios,
    pagination: paginationInfo,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
