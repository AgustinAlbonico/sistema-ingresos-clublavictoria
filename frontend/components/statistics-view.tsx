"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, UserCheck, TrendingUp, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

const stats = [
  {
    title: "Total de Socios",
    value: "248",
    description: "+12 este mes",
    icon: Users,
    trend: "up",
  },
  {
    title: "Temporadas Activas",
    value: "2",
    description: "Temporada 2024-2025",
    icon: Calendar,
    trend: "neutral",
  },
  {
    title: "Socios Activos",
    value: "186",
    description: "75% del total",
    icon: UserCheck,
    trend: "up",
  },
  {
    title: "Nuevos Registros",
    value: "23",
    description: "Últimos 30 días",
    icon: TrendingUp,
    trend: "up",
  },
]

interface Entry {
  id: string
  memberName: string
  memberDni: string
  isMember: boolean
  entryTime: string
  location: "club" | "pool"
  paidDay?: boolean
}

// Mock entry data
const mockEntries: Entry[] = [
  {
    id: "1",
    memberName: "Ana García López",
    memberDni: "12345678A",
    isMember: true,
    entryTime: "09:15",
    location: "pool",
  },
  {
    id: "2",
    memberName: "Carlos Martínez Ruiz",
    memberDni: "87654321B",
    isMember: true,
    entryTime: "10:30",
    location: "club",
  },
  {
    id: "3",
    memberName: "María Rodríguez",
    memberDni: "55667788E",
    isMember: false,
    entryTime: "11:45",
    location: "pool",
    paidDay: true,
  },
  {
    id: "4",
    memberName: "Juan Pérez",
    memberDni: "99887766F",
    isMember: false,
    entryTime: "14:20",
    location: "club",
    paidDay: true,
  },
  {
    id: "5",
    memberName: "Elena Rodríguez Sánchez",
    memberDni: "11223344C",
    isMember: true,
    entryTime: "15:10",
    location: "pool",
  },
]

export function StatisticsView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [entries] = useState<Entry[]>(mockEntries)
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10

  const totalEntries = entries.length
  const nonMemberEntries = entries.filter((entry) => !entry.isMember).length
  const clubEntries = entries.filter((entry) => entry.location === "club").length
  const poolEntries = entries.filter((entry) => entry.location === "pool").length

  const totalPages = Math.ceil(entries.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedEntries = entries.slice(startIndex, startIndex + entriesPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* General Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p
                className={`text-xs mt-1 ${
                  stat.trend === "up"
                    ? "text-primary"
                    : stat.trend === "down"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Entry Statistics */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Estadísticas del Día</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="date-filter" className="text-sm text-muted-foreground">
                Fecha:
              </Label>
              <Input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
          <p className="text-muted-foreground">{formatDate(selectedDate)}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{totalEntries}</div>
              <p className="text-sm text-muted-foreground">Total Ingresos</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{nonMemberEntries}</div>
              <p className="text-sm text-muted-foreground">No Socios</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{clubEntries}</div>
              <p className="text-sm text-muted-foreground">Ingreso Club</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{poolEntries}</div>
              <p className="text-sm text-muted-foreground">Ingreso Pileta</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry Log */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Registro de Ingresos</CardTitle>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
          <p className="text-muted-foreground">Listado de personas que ingresaron al club en la fecha seleccionada</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedEntries.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay registros de ingreso para esta fecha</p>
              </div>
            ) : (
              paginatedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{entry.memberName}</h3>
                      <p className="text-sm text-muted-foreground">DNI: {entry.memberDni}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {entry.entryTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        {entry.location === "pool" ? "Pileta" : "Club"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={entry.isMember ? "default" : "secondary"}
                        className={entry.isMember ? "bg-primary text-primary-foreground" : ""}
                      >
                        {entry.isMember ? "Socio" : "No Socio"}
                      </Badge>
                      {!entry.isMember && entry.paidDay && (
                        <Badge variant="outline" className="text-primary border-primary">
                          Pagó día
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + entriesPerPage, entries.length)} de {entries.length}{" "}
                registros
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
