import { useState, useEffect, useCallback, useMemo } from 'react';

// Importar tipos y utilidades centralizadas
import { Member, SearchResponse, Pagination } from '@/lib/types';
import { SEARCH, PAGINATION } from '@/lib/constants';
import { handleFetchError, handleNetworkError, validateApiResponse, logError } from '@/lib/error-handler';
import { getAvailableMembersForSeason, mockMembers } from '@/lib/mock-data';

// Función de debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Función para simular paginación con mock data
function paginateMockData(data: Member[], page: number, limit: number): SearchResponse {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    members: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < data.length,
      hasPreviousPage: page > 1
    }
  };
}

// Función para filtrar mock data por búsqueda
function filterMockMembers(members: Member[], searchTerm: string): Member[] {
  if (!searchTerm || searchTerm.length < SEARCH.MIN_SEARCH_LENGTH) {
    return members;
  }
  
  const term = searchTerm.toLowerCase();
  return members.filter(member => 
    member.firstName.toLowerCase().includes(term) ||
    member.lastName.toLowerCase().includes(term) ||
    member.dni.includes(term) ||
    member.email.toLowerCase().includes(term)
  );
}

export function useAvailableMembers(seasonId: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async (search: string, page: number) => {
    if (!seasonId) {
      setMembers([]);
      setPagination(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Intentar usar API primero
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGINATION.DEFAULT_PAGE_SIZE.toString(),
        ...(search && search.length >= SEARCH.MIN_SEARCH_LENGTH && { search })
      });

      const response = await fetch(
        `/api/members/available-for-season/${seasonId}?${params}`
      );

      if (response.ok) {
        // API disponible - usar respuesta real
        const data = await response.json();
        const validatedData = validateApiResponse<SearchResponse>(data);
        
        setMembers(validatedData.members || []);
        setPagination(validatedData.pagination || null);
      } else {
        // API no disponible - usar mock data
        console.warn('API not available, using mock data');
        
        // Obtener socios disponibles para la temporada
        const availableMembers = getAvailableMembersForSeason(seasonId);
        
        // Filtrar por búsqueda si existe
        const filteredMembers = filterMockMembers(availableMembers, search);
        
        // Paginar resultados
        const paginatedResponse = paginateMockData(
          filteredMembers, 
          page, 
          PAGINATION.DEFAULT_PAGE_SIZE
        );
        
        setMembers(paginatedResponse.members);
        setPagination(paginatedResponse.pagination);
      }
    } catch (err) {
      // En caso de error, usar mock data como fallback
      console.warn('Error fetching from API, falling back to mock data:', err);
      
      try {
        const availableMembers = getAvailableMembersForSeason(seasonId);
        const filteredMembers = filterMockMembers(availableMembers, search);
        const paginatedResponse = paginateMockData(
          filteredMembers, 
          page, 
          PAGINATION.DEFAULT_PAGE_SIZE
        );
        
        setMembers(paginatedResponse.members);
        setPagination(paginatedResponse.pagination);
        setError(null); // Limpiar error ya que pudimos usar mock data
      } catch (mockError) {
        const errorMessage = handleNetworkError(mockError);
        setError(errorMessage);
        setMembers([]);
        setPagination(null);
        logError(mockError, 'useAvailableMembers.fetchMembers.mockFallback');
      }
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  // Debounced search - espera antes de ejecutar búsqueda
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      setCurrentPage(1); // Reset a página 1 cuando busca
      fetchMembers(term, 1);
    }, SEARCH.DEBOUNCE_DELAY),
    [fetchMembers]
  );

  // Efecto para búsqueda
  useEffect(() => {
    if (searchTerm.trim()) {
      // Solo buscar si el término tiene la longitud mínima
      if (searchTerm.trim().length >= SEARCH.MIN_SEARCH_LENGTH) {
        debouncedSearch(searchTerm.trim());
      } else {
        // Si el término es muy corto, limpiar resultados
        setMembers([]);
        setPagination(null);
      }
    } else {
      // Si no hay término de búsqueda, cargar página actual
      fetchMembers('', currentPage);
    }

    // Cleanup function para cancelar debounce pendiente
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [searchTerm, debouncedSearch, fetchMembers, currentPage]);

  // Cargar datos iniciales cuando se abre el modal
  useEffect(() => {
    if (seasonId) {
      setCurrentPage(1);
      setSearchTerm('');
      fetchMembers('', 1);
    } else {
      // Limpiar estado cuando no hay seasonId
      setMembers([]);
      setPagination(null);
      setError(null);
    }
  }, [seasonId, fetchMembers]);

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) {
      return;
    }
    
    setCurrentPage(page);
    fetchMembers(searchTerm.trim(), page);
  }, [searchTerm, fetchMembers, pagination]);

  const handleSearchChange = useCallback((term: string) => {
    // Validar longitud máxima del término de búsqueda
    if (term.length > SEARCH.MAX_SEARCH_LENGTH) {
      return;
    }
    
    setSearchTerm(term);
  }, []);

  const refetch = useCallback(() => {
    fetchMembers(searchTerm.trim(), currentPage);
  }, [fetchMembers, searchTerm, currentPage]);

  // Función para limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Estado derivado para facilitar el uso
  const hasResults = members.length > 0;
  const hasNextPage = pagination?.hasNextPage ?? false;
  const hasPreviousPage = pagination?.hasPreviousPage ?? false;
  const totalItems = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 0;

  return {
    // Datos
    members,
    pagination,
    
    // Estados
    loading,
    error,
    searchTerm,
    currentPage,
    
    // Estados derivados
    hasResults,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    totalPages,
    
    // Acciones
    setSearchTerm: handleSearchChange,
    setCurrentPage: handlePageChange,
    refetch,
    clearSearch
  };
}
