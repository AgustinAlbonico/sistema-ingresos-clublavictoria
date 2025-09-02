import { useState, useEffect, useCallback, useMemo } from 'react';

// Importar tipos y utilidades centralizadas
import { Socio, RespuestaBusqueda, Paginacion } from '@/lib/types';
import { BUSQUEDA, PAGINACION } from '@/lib/constants';
import { handleFetchError, handleNetworkError, validateApiResponse, logError } from '@/lib/error-handler';
import { getSociosDisponiblesParaTemporada, mockSocios } from '@/lib/mock-data';

// Función de debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel?: () => void } {
  let timeout: NodeJS.Timeout;
  const debouncedFn = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debouncedFn.cancel = () => {
    clearTimeout(timeout);
  };
  
  return debouncedFn;
}

// Función para simular paginación con mock data
function paginateMockData(data: Socio[], page: number, limit: number): RespuestaBusqueda {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    socios: paginatedData,
    paginacion: {
      paginaActual: page,
      totalPaginas: Math.ceil(data.length / limit),
      totalElementos: data.length,
      elementosPorPagina: limit,
      tieneSiguientePagina: endIndex < data.length,
      tieneAnteriorPagina: page > 1
    }
  };
}

// Función para filtrar mock data por búsqueda
function filtrarMockSocios(socios: Socio[], terminoBusqueda: string): Socio[] {
  if (!terminoBusqueda || terminoBusqueda.length < BUSQUEDA.LONGITUD_MINIMA_BUSQUEDA) {
    return socios;
  }
  
  const termino = terminoBusqueda.toLowerCase();
  return socios.filter(socio => 
    socio.nombre.toLowerCase().includes(termino) ||
    socio.apellido.toLowerCase().includes(termino) ||
    socio.dni.includes(termino) ||
    socio.email.toLowerCase().includes(termino)
  );
}

export function useAvailableMembers(idTemporada: string) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginacion, setPaginacion] = useState<Paginacion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSocios = useCallback(async (busqueda: string, pagina: number) => {
    if (!idTemporada) {
      setSocios([]);
      setPaginacion(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Intentar usar API primero
      const params = new URLSearchParams({
        page: pagina.toString(),
        limit: PAGINACION.TAMAÑO_PAGINA_POR_DEFECTO.toString(),
        ...(busqueda && busqueda.length >= BUSQUEDA.LONGITUD_MINIMA_BUSQUEDA && { search: busqueda })
      });

      const response = await fetch(
        `/api/socios/disponibles-para-temporada/${idTemporada}?${params}`
      );

      if (response.ok) {
        // API disponible - usar respuesta real
        const data = await response.json();
        const validatedData = validateApiResponse<RespuestaBusqueda>(data);
        
        setSocios(validatedData.socios || []);
        setPaginacion(validatedData.paginacion || null);
      } else {
        // API no disponible - usar mock data
        console.warn('API not available, using mock data');
        
        // Obtener socios disponibles para la temporada
        const sociosDisponibles = getSociosDisponiblesParaTemporada(idTemporada);
        
        // Filtrar por búsqueda si existe
        const sociosFiltrados = filtrarMockSocios(sociosDisponibles, busqueda);
        
        // Paginar resultados
        const respuestaPaginada = paginateMockData(
          sociosFiltrados, 
          pagina, 
          PAGINACION.TAMAÑO_PAGINA_POR_DEFECTO
        );
        
        setSocios(respuestaPaginada.socios);
        setPaginacion(respuestaPaginada.paginacion);
      }
    } catch (err) {
      // En caso de error, usar mock data como fallback
      console.warn('Error fetching from API, falling back to mock data:', err);
      
      try {
        const sociosDisponibles = getSociosDisponiblesParaTemporada(idTemporada);
        const sociosFiltrados = filtrarMockSocios(sociosDisponibles, busqueda);
        const respuestaPaginada = paginateMockData(
          sociosFiltrados, 
          pagina, 
          PAGINACION.TAMAÑO_PAGINA_POR_DEFECTO
        );
        
        setSocios(respuestaPaginada.socios);
        setPaginacion(respuestaPaginada.paginacion);
        setError(null); // Limpiar error ya que pudimos usar mock data
      } catch (mockError) {
        const errorMessage = handleNetworkError(mockError);
        setError(errorMessage);
        setSocios([]);
        setPaginacion(null);
        logError(mockError, 'useAvailableMembers.fetchSocios.mockFallback');
      }
    } finally {
      setLoading(false);
    }
  }, [idTemporada]);

  // Debounced search - espera antes de ejecutar búsqueda
  const busquedaConDebounce = useMemo(
    () => debounce((termino: string) => {
      setPaginaActual(1); // Reset a página 1 cuando busca
      fetchSocios(termino, 1);
    }, BUSQUEDA.DELAY_DEBOUNCE),
    [fetchSocios]
  );

  // Efecto para búsqueda
  useEffect(() => {
    if (terminoBusqueda.trim()) {
      // Solo buscar si el término tiene la longitud mínima
      if (terminoBusqueda.trim().length >= BUSQUEDA.LONGITUD_MINIMA_BUSQUEDA) {
        busquedaConDebounce(terminoBusqueda.trim());
      } else {
        // Si el término es muy corto, limpiar resultados
        setSocios([]);
        setPaginacion(null);
      }
    } else {
      // Si no hay término de búsqueda, cargar página actual
      fetchSocios('', paginaActual);
    }

    // Cleanup function para cancelar debounce pendiente
    return () => {
      busquedaConDebounce.cancel?.();
    };
  }, [terminoBusqueda, busquedaConDebounce, fetchSocios, paginaActual]);

  // Cargar datos iniciales cuando se abre el modal
  useEffect(() => {
    if (idTemporada) {
      setPaginaActual(1);
      setTerminoBusqueda('');
      fetchSocios('', 1);
    } else {
      // Limpiar estado cuando no hay idTemporada
      setSocios([]);
      setPaginacion(null);
      setError(null);
    }
  }, [idTemporada, fetchSocios]);

  const handleCambioPagina = useCallback((pagina: number) => {
    if (pagina < 1 || (paginacion && pagina > paginacion.totalPaginas)) {
      return;
    }
    
    setPaginaActual(pagina);
    fetchSocios(terminoBusqueda.trim(), pagina);
  }, [terminoBusqueda, fetchSocios, paginacion]);

  const handleCambioBusqueda = useCallback((termino: string) => {
    // Validar longitud máxima del término de búsqueda
    if (termino.length > BUSQUEDA.LONGITUD_MAXIMA_BUSQUEDA) {
      return;
    }
    
    setTerminoBusqueda(termino);
  }, []);

  const refetch = useCallback(() => {
    fetchSocios(terminoBusqueda.trim(), paginaActual);
  }, [fetchSocios, terminoBusqueda, paginaActual]);

  // Función para limpiar búsqueda
  const limpiarBusqueda = useCallback(() => {
    setTerminoBusqueda('');
    setPaginaActual(1);
  }, []);

  // Estado derivado para facilitar el uso
  const tieneResultados = socios.length > 0;
  const tieneSiguientePagina = paginacion?.tieneSiguientePagina ?? false;
  const tieneAnteriorPagina = paginacion?.tieneAnteriorPagina ?? false;
  const totalElementos = paginacion?.totalElementos ?? 0;
  const totalPaginas = paginacion?.totalPaginas ?? 0;

  return {
    // Datos
    members: socios,
    pagination: paginacion,
    
    // Estados
    loading,
    error,
    searchTerm: terminoBusqueda,
    currentPage: paginaActual,
    
    // Estados derivados
    hasResults: tieneResultados,
    hasNextPage: tieneSiguientePagina,
    hasPreviousPage: tieneAnteriorPagina,
    totalItems: totalElementos,
    totalPages: totalPaginas,
    
    // Acciones
    setSearchTerm: handleCambioBusqueda,
    setCurrentPage: handleCambioPagina,
    refetch,
    clearSearch: limpiarBusqueda
  };
}
