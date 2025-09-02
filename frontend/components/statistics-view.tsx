"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Users, TrendingUp, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePagination } from '@/hooks/use-pagination'
import { useSearch } from '@/hooks/use-search'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'

import { EntryLog, DailyStats } from '@/lib/types'
import { mockMembers, mockEntryLogs, mockDailyStats } from '@/lib/mock-data'
import { PAGINATION } from '@/lib/constants'

export function StatisticsView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener estadísticas del día seleccionado
  const selectedDayStats = useMemo(() => {
    return mockDailyStats.find(stat => stat.date === selectedDate) || {
      date: selectedDate,
      totalEntries: 0,
      currentlyInside: 0,
      peakOccupancy: 0,
      averageStayTime: 0
    }
  }, [selectedDate])

  // Búsqueda en logs
  const { searchTerm, handleSearchChange, clearSearch } = useSearch({
    onSearch: (query) => {
      // Ahora filtra los logs reales en lugar de hacer console.log
      console.log('Searching logs for:', query)
    }
  })

  // Filtrar logs basado en el término de búsqueda
  const filteredLogs = useMemo(() => {
    let logs = mockEntryLogs.filter(log => log.date === selectedDate)
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      logs = logs.filter(log =>
        log.memberName.toLowerCase().includes(searchLower) ||
        log.memberDni.toLowerCase().includes(searchLower)
      )
    }
    
    return logs
  }, [selectedDate, searchTerm])

  // Paginación
  const pagination = usePagination({
    totalItems: filteredLogs.length,
    initialPageSize: PAGINATION.DEFAULT_PAGE_SIZE
  })

  // Calcular estadísticas específicas del día
  const dayStats = useMemo(() => {
    const todayLogs = filteredLogs
    const poolEntries = todayLogs.length
    const clubEntries = Math.floor(poolEntries * 0.3)
    const totalEntries = poolEntries + clubEntries
    const members = todayLogs.filter(log => 
      mockMembers.find(m => m.id === log.memberId)?.status === 'active'
    ).length
    const nonMembers = totalEntries - members

    return {
      totalEntries,
      poolEntries,
      clubEntries,
      members,
      nonMembers
    }
  }, [filteredLogs])

  // Logs paginados
  const paginatedLogs = useMemo(() => {
    const start = pagination.startIndex - 1
    const end = pagination.endIndex
    return filteredLogs.slice(start, end)
  }, [filteredLogs, pagination.startIndex, pagination.endIndex])

  // Resetear página cuando cambia la fecha
  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    pagination.setCurrentPage(1)
    setError(null)
  }

  // Simular carga
  const handleRefresh = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      setError('Error al cargar las estadísticas')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <Button onClick={handleRefresh}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground">
            Análisis de ingresos y actividad del club
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Actualizar'
            )}
          </Button>
        </div>
      </div>

      {/* Estadísticas del Día Seleccionado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos del Día</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dayStats.totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              Total de entradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos a Pileta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dayStats.poolEntries}</div>
            <p className="text-xs text-muted-foreground">
              Acceso a pileta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos al Club</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dayStats.clubEntries}</div>
            <p className="text-xs text-muted-foreground">
              Solo club
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Socios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dayStats.members}</div>
            <p className="text-xs text-muted-foreground">
              Socios activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total No Socios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dayStats.nonMembers}</div>
            <p className="text-xs text-muted-foreground">
              Visitantes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Registro de Entradas */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Registro de Entradas</CardTitle>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="max-w-sm"
              />
              {searchTerm && (
                <Button variant="outline" size="sm" onClick={clearSearch}>
                  Limpiar
                </Button>
              )}
            </div>

            {paginatedLogs.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay registros para la fecha seleccionada
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {log.memberName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            DNI: {log.memberDni}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Entrada:</span>{' '}
                          <span className="font-medium">{log.entryTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {pagination.startIndex} a {pagination.endIndex} de{' '}
                      {pagination.totalItems} registros
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={pagination.goToPreviousPage}
                        disabled={!pagination.hasPreviousPage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      <span className="text-sm text-muted-foreground px-2">
                        {pagination.currentPage} / {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={pagination.goToNextPage}
                        disabled={!pagination.hasNextPage}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
