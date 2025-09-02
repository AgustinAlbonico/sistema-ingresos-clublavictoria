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

// Importar tipos y datos centralizados
import { Season, Association } from "@/lib/types";
import { mockSeasons, mockAssociations, mockMembers } from "@/lib/mock-data";
import { PAGINATION, SUCCESS_MESSAGES } from "@/lib/constants";
import { useSearch } from '@/hooks/use-search'

export function AssociationManagement() {
  const [seasons] = useState<Season[]>(mockSeasons);
  const [associations, setAssociations] =
    useState<Association[]>(mockAssociations);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Estados para paginación de socios asociados
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState<number>(
    PAGINATION.DEFAULT_PAGE_SIZE
  );

  // Estados para búsqueda y paginación de socios asociados
  const { searchTerm, handleSearchChange, clearSearch } = useSearch({
    onSearch: (query) => {
      console.log('Searching season members for:', query)
    }
  })

  // Server-side search hook
  const {
    members: availableMembers,
    loading: isLoadingMembers,
    pagination,
    error: membersError,
    searchTerm: availableSearchTerm,
    currentPage: availableCurrentPage,
    setSearchTerm: setAvailableSearchTerm,
    setCurrentPage: setAvailableCurrentPage,
    refetch,
  } = useAvailableMembers(selectedSeason || "");

  useEffect(() => {
    const currentDate = new Date();
    const currentSeasonObj = seasons.find((season) => {
      const startDate = new Date(season.startDate);
      const endDate = new Date(season.endDate);
      return currentDate >= startDate && currentDate <= endDate;
    });

    if (currentSeasonObj) {
      setSelectedSeason(currentSeasonObj.id);
    } else if (seasons.length > 0) {
      const sortedSeasons = [...seasons].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setSelectedSeason(sortedSeasons[0].id);
    }
  }, [seasons]);

  const getSeasonMembers = () => {
    if (!selectedSeason) return [];

    return associations
      .filter((assoc) => assoc.seasonId === selectedSeason)
      .map((assoc) => ({
        ...assoc,
        member: mockMembers.find((member) => member.id === assoc.memberId)!,
      }))
      .filter((item) => item.member) // Filtrar items sin member válido
      .sort((a, b) => {
        const nameA =
          `${a.member.lastName}, ${a.member.firstName}`.toLowerCase();
        const nameB =
          `${b.member.lastName}, ${b.member.firstName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
  };

  // Filtrar miembros usando el término de búsqueda con debounce
  const filteredSeasonMembers = useMemo(() => {
    let members = getSeasonMembers()
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      members = members.filter((item) => {
        if (!item.member) return false
        return (
          `${item.member.firstName} ${item.member.lastName}`
            .toLowerCase()
            .includes(searchLower) ||
          item.member.dni.toLowerCase().includes(searchLower) ||
          (item.member.email &&
            item.member.email.toLowerCase().includes(searchLower))
        )
      })
    }
    
    return members
  }, [searchTerm, selectedSeason])

  // Paginación para socios asociados
  const totalPages = Math.ceil(filteredSeasonMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const paginatedSeasonMembers = filteredSeasonMembers.slice(
    startIndex,
    startIndex + membersPerPage
  );

  // Eliminar la declaración manual duplicada de handleSearchChange
  // const handleSearchChange = (value: string) => {
  //   setSearchTerm(value);
  //   setCurrentPage(1);
  // };

  const handleMembersPerPageChange = (value: string) => {
    setMembersPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedSeasonObj = seasons.find(
    (season) => season.id === selectedSeason
  );

  // Check if selected season has ended
  const isSeasonEnded = selectedSeasonObj
    ? new Date() > new Date(selectedSeasonObj.endDate)
    : false;

  // Check if selected season has started
  const isSeasonStarted = selectedSeasonObj
    ? new Date() >= new Date(selectedSeasonObj.startDate)
    : false;

  // Check if season is currently active (can add/remove members)
  const isSeasonActive = selectedSeasonObj
    ? new Date() >= new Date(selectedSeasonObj.startDate) &&
      new Date() <= new Date(selectedSeasonObj.endDate)
    : false;

  // Check if season is future (can add/remove members)
  const isSeasonFuture = selectedSeasonObj
    ? new Date() < new Date(selectedSeasonObj.startDate)
    : false;

  // Check if can manage members (future or active seasons)
  const canManageMembers = isSeasonFuture || isSeasonActive;

  const handleAddMemberToSeason = async (memberId: string) => {
    if (!selectedSeason) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newAssociation: Association = {
        id: `assoc-${Date.now()}`,
        memberId,
        seasonId: selectedSeason,
        associationDate: new Date().toISOString().split("T")[0],
      };

      setAssociations((prev) => [...prev, newAssociation]);
      toast.success(SUCCESS_MESSAGES.ASSOCIATION_CREATED);

      // Refetch available members to update the list
      refetch();
    } catch (error) {
      console.error("Error adding member to season:", error);
      toast.error("Error al agregar socio a la temporada");
    }
  };

  const handleRemoveAssociation = (associationId: string) => {
    if (!canManageMembers) {
      toast.error("No se pueden eliminar socios de temporadas finalizadas");
      return;
    }

    setAssociations(associations.filter((assoc) => assoc.id !== associationId));
    toast.success(SUCCESS_MESSAGES.ASSOCIATION_DELETED);
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
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una temporada" />
                </SelectTrigger>
                <SelectContent className="">
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{season.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(season.startDate)} -{" "}
                            {formatDate(season.endDate)}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Warning message when season has ended */}
            {selectedSeason && selectedSeasonObj && isSeasonEnded && (
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
            {selectedSeason && selectedSeasonObj && isSeasonFuture && (
              <div className="mt-4">
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Esta temporada comenzará el{" "}
                    {formatDate(selectedSeasonObj.startDate)}. Puedes agregar y
                    eliminar socios antes de que comience.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Season Members Display */}
      {selectedSeason && selectedSeasonObj && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">
                  {selectedSeasonObj.name}
                </CardTitle>
                <CardDescription>
                  {formatDate(selectedSeasonObj.startDate)} -{" "}
                  {formatDate(selectedSeasonObj.endDate)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={isSeasonEnded ? "secondary" : "default"}
                  className="opacity- hidden sm:block"
                >
                  {isSeasonEnded
                    ? "Finalizada"
                    : isSeasonFuture
                    ? "Futura"
                    : "Temporada Activa"}
                </Badge>
                {canManageMembers && (
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
                          Agregar Socios a {selectedSeasonObj.name}
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
                              value={availableSearchTerm}
                              onChange={(e) =>
                                setAvailableSearchTerm(e.target.value)
                              }
                              className="pl-10"
                            />
                          </div>
                        </div>

                        {/* Available Members List */}
                        <div className="flex-1 overflow-y-auto">
                          {isLoadingMembers ? (
                            <div className="p-4 text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Cargando socios...
                              </p>
                            </div>
                          ) : membersError ? (
                            <div className="p-4 text-center text-destructive">
                              <p>Error al cargar socios: {membersError}</p>
                            </div>
                          ) : availableMembers.length === 0 ? (
                            <div className="p-4 text-center">
                              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">
                                {availableSearchTerm
                                  ? "No se encontraron socios disponibles"
                                  : "No hay socios disponibles para agregar"}
                              </p>
                            </div>
                          ) : (
                            <div className="p-4 space-y-3">
                              {availableMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors bg-background"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                                      {member.photo ? (
                                        <img
                                          src={member.photo}
                                          alt={`${member.firstName} ${member.lastName}`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <User className="h-6 w-6 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-foreground truncate">
                                        {member.firstName} {member.lastName}
                                      </p>
                                      <div className="space-y-2 mt-2">
                                        {/* DNI - Siempre visible y prominente */}
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                                            DNI
                                          </span>
                                          <span className="text-sm font-mono text-foreground">
                                            {member.dni}
                                          </span>
                                        </div>
                                        
                                        {/* Email y teléfono uno encima del otro */}
                                        {member.email && (
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground truncate">
                                              {member.email}
                                            </span>
                                          </div>
                                        )}
                                        {member.phone && (
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground truncate">
                                              {member.phone}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <Button
                                      onClick={() =>
                                        handleAddMemberToSeason(member.id)
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
                        {pagination && pagination.totalPages > 1 && (
                          <div className="p-4 border-t flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                              Página {pagination.currentPage} de{" "}
                              {pagination.totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setAvailableCurrentPage(
                                    pagination.currentPage - 1
                                  )
                                }
                                disabled={!pagination.hasPreviousPage}
                              >
                                <ChevronLeft className="h-4 w-4" />
                                Anterior
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setAvailableCurrentPage(
                                    pagination.currentPage + 1
                                  )
                                }
                                disabled={!pagination.hasNextPage}
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
            {isSeasonEnded && (
              <div className="mt-4">
                <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Esta temporada finalizó el{" "}
                    {formatDate(selectedSeasonObj.endDate)}. No se pueden
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
              {paginatedSeasonMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No se encontraron socios asociados"
                      : "No hay socios asociados a esta temporada"}
                  </p>
                </div>
              ) : (
                paginatedSeasonMembers.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Member Info Section */}
                    <div className="flex justify-center sm:items-start gap-3 flex-1 min-w-0 ">
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0 sm:my-auto">
                        {item.member.photo ? (
                          <img
                            src={item.member.photo}
                            alt={`${item.member.firstName} ${item.member.lastName}`}
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
                            {item.member.firstName} {item.member.lastName}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 justify-center sm:justify-start">
                              <User className="h-3 w-3" />
                              DNI: {item.member.firstName}
                            </span>
                            {item.member.email && (
                              <span className="flex items-center gap-1 justify-center sm:justify-start">
                                <Mail className="h-3 w-3" />
                                {item.member.email}
                              </span>
                            )}
                            {item.member.phone && (
                              <span className="flex items-center gap-1 justify-center sm:justify-start">
                                <Phone className="h-3 w-3" />
                                {item.member.phone}
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
                          item.member.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className={`${
                          item.member.status === "active"
                            ? "bg-primary text-primary-foreground"
                            : ""
                        } flex-shrink-0`}
                      >
                        {item.member.status === "active"
                          ? "Activo"
                          : "Inactivo"}
                      </Badge>

                      <div className="flex gap-2">
                        {canManageMembers ? (
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
                                  {item.member.firstName} {item.member.lastName}{" "}
                                  de esta temporada.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleRemoveAssociation(item.id)
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
                  startIndex + membersPerPage,
                  filteredSeasonMembers.length
                )}{" "}
                de {filteredSeasonMembers.length} socios asociados
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
                    value={membersPerPage.toString()}
                    onValueChange={handleMembersPerPageChange}
                  >
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGINATION.PAGE_SIZE_OPTIONS.map((option) => (
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
    </div>
  );
}
