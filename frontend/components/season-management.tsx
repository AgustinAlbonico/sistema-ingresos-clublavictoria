"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SeasonForm } from "@/components/season-form"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  description?: string
  currentMembers: number
}

// Mock data - simplified without status and maxMembers
const mockSeasons: Season[] = [
  {
    id: "1",
    name: "Temporada Verano 2024-2025",
    startDate: "2024-12-01",
    endDate: "2025-03-31",
    description: "Temporada de verano con acceso completo a todas las instalaciones",
    currentMembers: 186,
  },
  {
    id: "2",
    name: "Temporada Invierno 2024",
    startDate: "2024-06-01",
    endDate: "2024-11-30",
    description: "Temporada de invierno con horarios reducidos",
    currentMembers: 145,
  },
  {
    id: "3",
    name: "Temporada Verano 2025-2026",
    startDate: "2025-12-01",
    endDate: "2026-03-31",
    description: "Próxima temporada de verano",
    currentMembers: 0,
  },
]

export function SeasonManagement() {
  const [seasons, setSeasons] = useState<Season[]>(mockSeasons)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSeason, setEditingSeason] = useState<Season | null>(null)

  // Sort seasons by start date (most recent first)
  const sortedSeasons = [...seasons].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  const handleCreateSeason = (seasonData: Omit<Season, "id" | "currentMembers">) => {
    const newSeason: Season = {
      ...seasonData,
      id: Date.now().toString(),
      currentMembers: 0,
    }
    setSeasons([...seasons, newSeason])
    setIsCreateDialogOpen(false)
  }

  const handleEditSeason = (seasonData: Omit<Season, "id" | "currentMembers">) => {
    if (editingSeason) {
      setSeasons(
        seasons.map((season) =>
          season.id === editingSeason.id
            ? { ...seasonData, id: editingSeason.id, currentMembers: editingSeason.currentMembers }
            : season,
        ),
      )
      setEditingSeason(null)
    }
  }

  const handleDeleteSeason = (seasonId: string) => {
    setSeasons(seasons.filter((season) => season.id !== seasonId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Create Season Section */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Temporadas del Club</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/85 text-primary-foreground rounded-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Temporada
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Temporada</DialogTitle>
                </DialogHeader>
                <SeasonForm onSubmit={handleCreateSeason} onCancel={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gestiona las temporadas de pileta del club. Define fechas de inicio y fin para cada temporada.
          </p>
        </CardContent>
      </Card>

      {/* Seasons List */}
      <div className="grid gap-6">
        {sortedSeasons.length === 0 ? (
          <Card className="shadow-sm border-border">
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay temporadas registradas</p>
            </CardContent>
          </Card>
        ) : (
          sortedSeasons.map((season) => (
            <Card key={season.id} className="shadow-sm border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-foreground">{season.name}</CardTitle>
                    {season.description && <p className="text-muted-foreground">{season.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingSeason?.id === season.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingSeason(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSeason(season)}
                          className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Editar Temporada</DialogTitle>
                        </DialogHeader>
                        {editingSeason && (
                          <SeasonForm
                            season={editingSeason}
                            onSubmit={handleEditSeason}
                            onCancel={() => setEditingSeason(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar temporada?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la temporada "{season.name}"
                            y todas sus asociaciones con socios.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSeason(season.id)}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Fecha de Inicio</p>
                    <p className="text-sm text-muted-foreground">{formatDate(season.startDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Fecha de Fin</p>
                    <p className="text-sm text-muted-foreground">{formatDate(season.endDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Socios Inscritos</p>
                    <p className="text-sm text-muted-foreground">{season.currentMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
