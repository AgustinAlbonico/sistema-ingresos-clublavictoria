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
import { Temporada } from "@/lib/types";
import { getMockTemporadas } from "@/lib/mock-data";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SeasonManagement() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemporada, setEditingTemporada] = useState<Temporada | null>(null);

  // Simular carga inicial de datos (llamada a API)
  useEffect(() => {
    setIsLoading(true);
    const loadTemporadas = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simula delay de API
      setTemporadas(getMockTemporadas());
      setIsLoading(false);
    };
    loadTemporadas();
  }, []);

  const handleCrearTemporada = (datosTemporada: Omit<Temporada, 'id'>) => {
    const nuevaTemporada: Temporada = {
      ...datosTemporada,
      id: Date.now().toString(),
      // Asegurar que las fechas se guarden correctamente
      fechaInicio: datosTemporada.fechaInicio.split('T')[0],
      fechaFin: datosTemporada.fechaFin.split('T')[0],
    };
    setTemporadas([...temporadas, nuevaTemporada]);
    setIsCreateDialogOpen(false);
    toast.success("Temporada creada exitosamente");
  };

  const handleEditarTemporada = (datosTemporada: Omit<Temporada, 'id'>) => {
    if (editingTemporada) {
      setTemporadas(
        temporadas.map((temporada) =>
          temporada.id === editingTemporada.id
            ? { 
                ...datosTemporada, 
                id: editingTemporada.id,
                // Asegurar que las fechas se guarden correctamente
                fechaInicio: datosTemporada.fechaInicio.split('T')[0],
                fechaFin: datosTemporada.fechaFin.split('T')[0],
              }
            : temporada
        )
      );
      setEditingTemporada(null);
      toast.success("Temporada actualizada exitosamente");
    }
  };

  const handleEliminarTemporada = (idTemporada: string) => {
    setTemporadas(temporadas.filter((temporada) => temporada.id !== idTemporada));
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
                  onSubmit={handleCrearTemporada}
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
        ) : temporadas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay temporadas registradas</p>
            </CardContent>
          </Card>
        ) : (
          temporadas.map((temporada) => (
            <Card key={temporada.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-xl">{temporada.nombre}</CardTitle>
                    {temporada.descripcion && (
                      <p className="text-muted-foreground">{temporada.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingTemporada?.id === temporada.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingTemporada(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTemporada(temporada)}
                          className="text-primary border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Temporada</DialogTitle>
                        </DialogHeader>
                        {editingTemporada && (
                          <SeasonForm
                            season={editingTemporada}
                            onSubmit={handleEditarTemporada}
                            onCancel={() => setEditingTemporada(null)}
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
                            Esta acción no se puede deshacer. Se eliminará permanentemente la temporada "{temporada.nombre}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleEliminarTemporada(temporada.id)}
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
                    <p className="text-sm text-muted-foreground">{formatDate(temporada.fechaInicio)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fecha de Fin</p>
                    <p className="text-sm text-muted-foreground">{formatDate(temporada.fechaFin)}</p>
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
