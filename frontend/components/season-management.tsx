"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeasonForm } from "@/components/season-form";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Season } from "@/lib/types";
import { getMockSeasons } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SeasonManagement() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);

  // Simular carga inicial de datos (llamada a API)
  useEffect(() => {
    setIsLoading(true);
    const loadSeasons = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simula delay de API
      setSeasons(getMockSeasons());
      setIsLoading(false);
    };
    loadSeasons();
  }, []);

  const handleCreateSeason = (seasonData: Omit<Season, 'id'>) => {
    const newSeason: Season = {
      ...seasonData,
      id: Date.now().toString(),
      // Asegurar que las fechas se guarden correctamente
      startDate: seasonData.startDate.split('T')[0],
      endDate: seasonData.endDate.split('T')[0],
    };
    setSeasons([...seasons, newSeason]);
    setIsCreateDialogOpen(false);
    toast.success("Temporada creada exitosamente");
  };

  const handleEditSeason = (seasonData: Omit<Season, 'id'>) => {
    if (editingSeason) {
      setSeasons(
        seasons.map((season) =>
          season.id === editingSeason.id
            ? { 
                ...seasonData, 
                id: editingSeason.id,
                // Asegurar que las fechas se guarden correctamente
                startDate: seasonData.startDate.split('T')[0],
                endDate: seasonData.endDate.split('T')[0],
              }
            : season
        )
      );
      setEditingSeason(null);
      toast.success("Temporada actualizada exitosamente");
    }
  };

  const handleDeleteSeason = (seasonId: string) => {
    setSeasons(seasons.filter((season) => season.id !== seasonId));
    toast.success("Temporada eliminada exitosamente");
  };

  const formatDate = (dateString: string) => {
    // Crear la fecha y ajustar para zona horaria local
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header y botón crear */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl">Temporadas del Club</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Temporada
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Temporada</DialogTitle>
                </DialogHeader>
                <SeasonForm
                  onSubmit={handleCreateSeason}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
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

      {/* Lista de temporadas */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-muted-foreground">Cargando temporadas...</p>
          </div>
        ) : seasons.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay temporadas registradas</p>
            </CardContent>
          </Card>
        ) : (
          seasons.map((season) => (
            <Card key={season.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-xl">{season.name}</CardTitle>
                    {season.description && (
                      <p className="text-muted-foreground">{season.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingSeason?.id === season.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingSeason(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSeason(season)}
                          className="text-primary border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
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
                        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar temporada?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la temporada "{season.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSeason(season.id)}
                            className="bg-destructive hover:bg-destructive/90"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Fecha de Inicio</p>
                    <p className="text-sm text-muted-foreground">{formatDate(season.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fecha de Fin</p>
                    <p className="text-sm text-muted-foreground">{formatDate(season.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
