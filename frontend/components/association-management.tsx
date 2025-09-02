"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Search,
  UserPlus,
  Users,
  Calendar,
  Mail,
  Phone,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
} from "lucide-react";
import { useAvailableMembers } from "@/hooks/use-available-members";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Importar tipos y datos centralizados
import { Temporada, Asociacion } from "@/lib/types";
import { mockTemporadas, mockAsociaciones, mockSocios } from "@/lib/mock-data";
import { PAGINACION, MENSAJES_EXITO } from "@/lib/constants";
import { useSearch } from '@/hooks/use-search'

export function AssociationManagement() {
  const [temporadas] = useState<Temporada[]>(mockTemporadas);
  const [asociaciones, setAsociaciones] =
    useState<Asociacion[]>(mockAsociaciones);
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para paginación de socios asociados
  const [currentPage, setCurrentPage] = useState(1);
  const [sociosPorPagina, setSociosPorPagina] = useState<number>(
    PAGINACION.TAMAÑO_PAGINA_POR_DEFECTO
  );

  // Estados para búsqueda y paginación de socios asociados
  const { searchTerm, handleSearchChange, clearSearch } = useSearch({
    onSearch: (query) => {
      console.log('Searching season members for:', query)
    }
  })

  // Server-side search hook
  const {
    members: sociosDisponibles,
    loading: isLoadingSocios,
    pagination,
    error: sociosError,
    searchTerm: terminoBusquedaDisponibles,
    currentPage: paginaActualDisponibles,
    setSearchTerm: setTerminoBusquedaDisponibles,
    setCurrentPage: setPaginaActualDisponibles,
    refetch,
  } = useAvailableMembers(temporadaSeleccionada || "");

  useEffect(() => {
    const fechaActual = new Date();
    const temporadaActualObj = temporadas.find((temporada) => {
      const fechaInicio = new Date(temporada.fechaInicio);
      const fechaFin = new Date(temporada.fechaFin);
      return fechaActual >= fechaInicio && fechaActual <= fechaFin;
    });

    if (temporadaActualObj) {
      setTemporadaSeleccionada(temporadaActualObj.id);
    } else if (temporadas.length > 0) {
      const temporadasOrdenadas = [...temporadas].sort(
        (a, b) =>
          new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
      );
      setTemporadaSeleccionada(temporadasOrdenadas[0].id);
    }
  }, [temporadas]);

  // Simular carga de asociaciones al cambiar de temporada
  useEffect(() => {
    setIsLoading(true);
    const cargarAsociaciones = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simula delay de API
      setIsLoading(false);
    };
    cargarAsociaciones();
  }, [temporadaSeleccionada]);

  const obtenerSociosTemporada = () => {
    if (!temporadaSeleccionada) return [];

    return asociaciones
      .filter((asoc) => asoc.idTemporada === temporadaSeleccionada)
      .map((asoc) => ({
        ...asoc,
        socio: mockSocios.find((socio) => socio.id === asoc.idSocio)!,
      }))
      .filter((item) => item.socio) // Filtrar items sin socio válido
      .sort((a, b) => {
        const nombreA =
          `${a.socio.apellido}, ${a.socio.nombre}`.toLowerCase();
        const nombreB =
          `${b.socio.apellido}, ${b.socio.nombre}`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      });
  };

  // Filtrar miembros usando el término de búsqueda con debounce
  const sociosTemporadaFiltrados = useMemo(() => {
    let socios = obtenerSociosTemporada()
    
    if (searchTerm.trim()) {
      const busquedaLower = searchTerm.toLowerCase()
      socios = socios.filter((item) => {
        if (!item.socio) return false
        return (
          `${item.socio.nombre} ${item.socio.apellido}`
            .toLowerCase()
            .includes(busquedaLower) ||
          item.socio.dni.toLowerCase().includes(busquedaLower) ||
          (item.socio.email &&
            item.socio.email.toLowerCase().includes(busquedaLower))
        )
      })
    }
    
    return socios
  }, [searchTerm, temporadaSeleccionada])

  // Paginación para socios asociados
  const totalPages = Math.ceil(sociosTemporadaFiltrados.length / sociosPorPagina);
  const startIndex = (currentPage - 1) * sociosPorPagina;
  const sociosTemporadaPaginados = sociosTemporadaFiltrados.slice(
    startIndex,
    startIndex + sociosPorPagina
  );

  // Eliminar la declaración manual duplicada de handleSearchChange
  // const handleSearchChange = (value: string) => {
  //   setSearchTerm(value);
  //   setCurrentPage(1);
  // };

  const handleSociosPorPaginaChange = (value: string) => {
    setSociosPorPagina(parseInt(value));
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const temporadaSeleccionadaObj = temporadas.find(
    (temporada) => temporada.id === temporadaSeleccionada
  );

  // Check if selected season has ended
  const haFinalizadoTemporada = temporadaSeleccionadaObj
    ? new Date() > new Date(temporadaSeleccionadaObj.fechaFin)
    : false;

  // Check if selected season has started
  const haComenzadoTemporada = temporadaSeleccionadaObj
    ? new Date() >= new Date(temporadaSeleccionadaObj.fechaInicio)
    : false;

  // Check if season is currently active (can add/remove members)
  const estaActivaTemporada = temporadaSeleccionadaObj
    ? new Date() >= new Date(temporadaSeleccionadaObj.fechaInicio) &&
      new Date() <= new Date(temporadaSeleccionadaObj.fechaFin)
    : false;

  // Check if season is future (can add/remove members)
  const esFuturaTemporada = temporadaSeleccionadaObj
    ? new Date() < new Date(temporadaSeleccionadaObj.fechaInicio)
    : false;

  // Check if can manage members (future or active seasons)
  const puedeGestionarSocios = esFuturaTemporada || estaActivaTemporada;

  const handleAgregarSocioATemporada = async (idSocio: string) => {
    if (!temporadaSeleccionada) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const nuevaAsociacion: Asociacion = {
        id: `asoc-${Date.now()}`,
        idSocio,
        idTemporada: temporadaSeleccionada,
        fechaAsociacion: new Date().toISOString().split("T")[0],
        estado: 'activa'
      };

      setAsociaciones((prev) => [...prev, nuevaAsociacion]);
      toast.success(MENSAJES_EXITO.ASOCIACION_CREADA);

      // Refetch available members to update the list
      refetch();
    } catch (error) {
      console.error("Error adding member to season:", error);
      toast.error("Error al agregar socio a la temporada");
    }
  };

  const handleEliminarAsociacion = (idAsociacion: string) => {
    if (!puedeGestionarSocios) {
      toast.error("No se pueden eliminar socios de temporadas finalizadas");
      return;
    }

    setAsociaciones(asociaciones.filter((asoc) => asoc.id !== idAsociacion));
    toast.success(MENSAJES_EXITO.ASOCIACION_ELIMINADA);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Season Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Asociar Socios a Temporada de Pileta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Seleccionar Temporada
              </label>
              <Select value={temporadaSeleccionada} onValueChange={setTemporadaSeleccionada}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una temporada" />
                </SelectTrigger>
                <SelectContent className="">
                  {temporadas.map((temporada) => (
                    <SelectItem key={temporada.id} value={temporada.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{temporada.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(temporada.fechaInicio)} -{" "}
                            {formatDate(temporada.fechaFin)}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Warning message when season has ended */}
            {temporadaSeleccionada && temporadaSeleccionadaObj && haFinalizadoTemporada && (
              <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <strong>⚠️ Atención:</strong> Esta temporada ya ha finalizado.
                  No se pueden agregar nuevos socios a temporadas finalizadas.
                  Solo puedes ver la lista de socios que participaron.
                </AlertDescription>
              </Alert>
            )}

            {/* Info for future seasons */}
            {temporadaSeleccionada && temporadaSeleccionadaObj && esFuturaTemporada && (
              <div className="mt-4">
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Esta temporada comenzará el{" "}
                    {formatDate(temporadaSeleccionadaObj.fechaInicio)}. Puedes agregar y
                    eliminar socios antes de que comience.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">Cargando asociaciones...</p>
        </div>
      ) : (
        <>
          {/* Season Members Display */}
          {temporadaSeleccionada && temporadaSeleccionadaObj && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">
                      {temporadaSeleccionadaObj.nombre}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(temporadaSeleccionadaObj.fechaInicio)} -{" "}
                      {formatDate(temporadaSeleccionadaObj.fechaFin)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={haFinalizadoTemporada ? "secondary" : "default"}
                      className="opacity- hidden sm:block"
                    >
                      {haFinalizadoTemporada
                        ? "Finalizada"
                        : esFuturaTemporada
                        ? "Futura"
                        : "Temporada Activa"}
                    </Badge>
                    {puedeGestionarSocios && (
                      <Dialog
                        open={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Agregar Socios
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[calc(100vw-2rem)] sm:mx-auto  sm:w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                          <DialogHeader>
                            <DialogTitle>
                              Agregar Socios a {temporadaSeleccionadaObj.nombre}
                            </DialogTitle>
                            <DialogDescription>
                              Busca y selecciona los socios que deseas agregar a
                              esta temporada
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Search */}
                            <div className="p-4 border-b">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  placeholder="Buscar socios disponibles..."
                                  value={terminoBusquedaDisponibles}
                                  onChange={(e) =>
                                    setTerminoBusquedaDisponibles(e.target.value)
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>

                            {/* Available Members List */}
                            <div className="flex-1 overflow-y-auto">
                              {isLoadingSocios ? (
                                <div className="p-4 text-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Cargando socios...
                                  </p>
                                </div>
                              ) : sociosError ? (
                                <div className="p-4 text-center text-destructive">
                                  <p>Error al cargar socios: {sociosError}</p>
                                </div>
                              ) : sociosDisponibles.length === 0 ? (
                                <div className="p-4 text-center">
                                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-muted-foreground">
                                    {terminoBusquedaDisponibles
                                      ? "No se encontraron socios disponibles"
                                      : "No hay socios disponibles para agregar"}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 space-y-3">
                                  {sociosDisponibles.map((socio) => (
                                    <div
                                      key={socio.id}
                                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors bg-background"
                                    >
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                                          {socio.foto ? (
                                            <img
                                              src={socio.foto}
                                              alt={`${socio.nombre} ${socio.apellido}`}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <User className="h-6 w-6 text-muted-foreground" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-foreground truncate">
                                            {socio.nombre} {socio.apellido}
                                          </p>
                                          <div className="space-y-2 mt-2">
                                            {/* DNI - Siempre visible y prominente */}
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                                DNI
                                              </span>
                                              <span className="text-sm font-mono text-foreground">
                                                {socio.dni}
                                              </span>
                                            </div>
                                            
                                            {/* Email y teléfono uno encima del otro */}
                                            {socio.email && (
                                              <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground truncate">
                                                  {socio.email}
                                                </span>
                                              </div>
                                            )}
                                            {socio.telefono && (
                                              <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground truncate">
                                                  {socio.telefono}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex-shrink-0">
                                        <Button
                                          onClick={() =>
                                            handleAgregarSocioATemporada(socio.id)
                                          }
                                          size="sm"
                                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Agregar
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Pagination for available members */}
                            {pagination && pagination.totalPaginas > 1 && (
                              <div className="p-4 border-t flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  Página {pagination.paginaActual} de{" "}
                                  {pagination.totalPaginas}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setPaginaActualDisponibles(
                                        pagination.paginaActual - 1
                                      )
                                    }
                                    disabled={!pagination.tieneAnteriorPagina}
                                  >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setPaginaActualDisponibles(
                                        pagination.paginaActual + 1
                                      )
                                    }
                                    disabled={!pagination.tieneSiguientePagina}
                                  >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                {/* Additional info for ended seasons */}
                {haFinalizadoTemporada && (
                  <div className="mt-4">
                    <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        Esta temporada finalizó el{" "}
                        {formatDate(temporadaSeleccionadaObj.fechaFin)}. No se pueden
                        agregar ni eliminar socios de temporadas finalizadas.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Search Section for Season Members */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar socios asociados por nombre, DNI o email..."
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 rounded-lg border-border focus:ring-primary focus:border-primary text-sm"
                    />
                  </div>
                </div>

                {/* Season Members List */}
                <div className="space-y-4">
                  {sociosTemporadaPaginados.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "No se encontraron socios asociados"
                          : "No hay socios asociados a esta temporada"}
                      </p>
                    </div>
                  ) : (
                    sociosTemporadaPaginados.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Member Info Section */}
                        <div className="flex justify-center sm:items-start gap-3 flex-1 min-w-0 ">
                          {/* Avatar */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0 sm:my-auto">
                            {item.socio.foto ? (
                              <img
                                src={item.socio.foto}
                                alt={`${item.socio.nombre} ${item.socio.apellido}`}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                            )}
                          </div>

                          {/* Member Details */}
                          <div className="flex flex-col justify-center sm:justify-start gap-1 flex-1 min-w-0">
                            <div className="text-center sm:text-left">
                              <h3 className="font-semibold text-foreground truncate">
                                {item.socio.nombre} {item.socio.apellido}
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1 justify-center sm:justify-start">
                                  <User className="h-3 w-3" />
                                  DNI: {item.socio.dni}
                                </span>
                                {item.socio.email && (
                                  <span className="flex items-center gap-1 justify-center sm:justify-start">
                                    <Mail className="h-3 w-3" />
                                    {item.socio.email}
                                  </span>
                                )}
                                {item.socio.telefono && (
                                  <span className="flex items-center gap-1 justify-center sm:justify-start">
                                    <Phone className="h-3 w-3" />
                                    {item.socio.telefono}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Section */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                          <Badge
                            variant={
                              item.socio.estado === "activo"
                                ? "default"
                                : "secondary"
                            }
                            className={`${
                              item.socio.estado === "activo"
                                ? "bg-primary text-primary-foreground"
                                : ""
                            } flex-shrink-0`}
                          >
                            {item.socio.estado === "activo"
                              ? "Activo"
                              : "Inactivo"}
                          </Badge>

                          <div className="flex gap-2">
                            {puedeGestionarSocios ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="w-[95%] md:w-full mx-auto">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ¿Eliminar socio de la temporada?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Se eliminará
                                      permanentemente al socio{" "}
                                      {item.socio.nombre} {item.socio.apellido}{" "}
                                      de esta temporada.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                    <AlertDialogCancel className="w-full sm:w-auto">
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleEliminarAsociacion(item.id)
                                      }
                                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="text-muted-foreground border-muted-foreground/30 bg-muted/20 cursor-not-allowed opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">
                                  Eliminar (deshabilitado)
                                </span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls for Season Members */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-4 border-t border-border gap-3">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Mostrando {startIndex + 1} a{" "}
                    {Math.min(
                      startIndex + sociosPorPagina,
                      sociosTemporadaFiltrados.length
                    )}{" "}
                    de {sociosTemporadaFiltrados.length} socios asociados
                  </p>
                  <div className="flex items-center justify-center sm:justify-end gap-2">
                    {totalPages > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex-shrink-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="hidden xs:inline ml-1">Anterior</span>
                        </Button>
                        <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded min-w-[60px] text-center">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex-shrink-0"
                        >
                          <span className="hidden xs:inline mr-1">Siguiente</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Mostrar:
                      </span>
                      <Select
                        value={sociosPorPagina.toString()}
                        onValueChange={handleSociosPorPaginaChange}
                      >
                        <SelectTrigger className="w-20 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAGINACION.OPCIONES_TAMAÑO_PAGINA.map((option) => (
                            <SelectItem key={option} value={option.toString()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
