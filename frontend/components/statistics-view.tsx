"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  CalendarDays,
  TrendingUp,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePagination } from '@/hooks/use-pagination'
import { useSearch } from '@/hooks/use-search'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'

import { RegistroEntrada } from '@/lib/types'
import { PAGINACION } from '@/lib/constants'

export function StatisticsView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estado para datos que vendrán de la API
  const [registrosEntrada, setRegistrosEntrada] = useState<RegistroEntrada[]>([])

  // Búsqueda en logs
  const { searchTerm, handleSearchChange, clearSearch } = useSearch({
    onSearch: (query) => {
      console.log('Searching logs for:', query)
    }
  })

  // Filtrar logs basado en el término de búsqueda
  const filteredLogs = useMemo(() => {
    let logs = registrosEntrada.filter(log => log.fecha === selectedDate)
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      logs = logs.filter(log =>
        log.nombreSocio.toLowerCase().includes(searchLower) ||
        log.dniSocio.toLowerCase().includes(searchLower)
      )
    }
    
    return logs
  }, [selectedDate, searchTerm, registrosEntrada])

  // Paginación
  const pagination = usePagination({
    totalItems: filteredLogs.length,
    initialPageSize: PAGINACION.TAMAÑO_PAGINA_POR_DEFECTO
  })

  // Calcular estadísticas específicas del día
  const dayStats = useMemo(() => {
    const todayLogs = filteredLogs
    const poolEntries = todayLogs.length
    const clubEntries = Math.floor(poolEntries * 0.3)
    const totalEntries = poolEntries + clubEntries
    const members = todayLogs.length // Simplificado hasta tener API
    const nonMembers = 0 // Se calculará con datos reales

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
        <StatCard
          title="Total Ingresos del Día"
          value={dayStats.totalEntries}
          description="Total de entradas"
          icon={TrendingUp}
        />

        <StatCard
          title="Ingresos a Pileta"
          value={dayStats.poolEntries}
          description="Acceso a pileta"
          icon={Users}
        />

        <StatCard
          title="Ingresos al Club"
          value={dayStats.clubEntries}
          description="Solo club"
          icon={Users}
        />

        <StatCard
          title="Total Socios"
          value={dayStats.members}
          description="Socios activos"
          icon={Users}
        />

        <StatCard
          title="Total No Socios"
          value={dayStats.nonMembers}
          description="Visitantes"
          icon={Users}
        />
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
                            {log.nombreSocio}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            DNI: {log.dniSocio}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Entrada:</span>{' '}
                          <span className="font-medium">{log.horaEntrada}</span>
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
