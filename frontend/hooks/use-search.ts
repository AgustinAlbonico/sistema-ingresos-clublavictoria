import { useState, useEffect, useCallback } from 'react'
import { BUSQUEDA } from '@/lib/constants'

interface UseSearchOptions {
  initialValue?: string
  debounceDelay?: number
  minLength?: number
  onSearch?: (query: string) => void
}

export function useSearch({
  initialValue = '',
  debounceDelay = BUSQUEDA.DELAY_DEBOUNCE,
  minLength = BUSQUEDA.LONGITUD_MINIMA_BUSQUEDA,
  onSearch
}: UseSearchOptions = {}) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue)

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceDelay)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceDelay])

  // Trigger search when debounced term changes
  useEffect(() => {
    if (onSearch && debouncedSearchTerm.length >= minLength) {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch, minLength])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
  }, [])

  const isValidSearch = useCallback((term: string) => {
    return term.length >= minLength
  }, [minLength])

  // Agregada funcionalidad para mostrar estado de búsqueda
  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchChange,
    clearSearch,
    isValidSearch,
    isSearching: searchTerm !== debouncedSearchTerm // Indica si está buscando
  }
}
