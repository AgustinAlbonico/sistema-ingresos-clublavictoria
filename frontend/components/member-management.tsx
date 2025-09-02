"use client";

import { useEffect, useState } from "react";
import { useSearch } from "@/hooks/use-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importar tipos y datos centralizados
import { Member } from "@/lib/types";
import { mockMembers } from "@/lib/mock-data";
import { PAGINATION, SUCCESS_MESSAGES, MEMBER_STATUS } from "@/lib/constants";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState<number>(
    PAGINATION.DEFAULT_PAGE_SIZE
  );
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga inicial de datos
  useEffect(() => {
    const loadMembers = async () => {
      try {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMembers(mockMembers);
      } catch (error) {
        console.error("Error loading members:", error);
        toast.error("Error al cargar socios");
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, []);

  // Hook de búsqueda con debounce
  const { searchTerm, handleSearchChange, clearSearch } = useSearch({
    onSearch: async (query) => {
      console.log("Searching members for:", query);
      setCurrentPage(1);
    },
  });

  // Filter members based on search term
  const filteredMembers = members
    .filter(
      (member) =>
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      `${a.lastName}, ${a.firstName}`.localeCompare(
        `${b.lastName}, ${b.firstName}`
      )
    );

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + membersPerPage
  );


  // TODO: Cuando se implemente la API, esta función debería hacer una llamada DELETE
  const handleDeleteMember = async (memberId: string) => {
    try {
      setMembers(members.filter((member) => member.id !== memberId));
      toast.success(SUCCESS_MESSAGES.MEMBER_DELETED, {
        position: "top-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Error al eliminar socio");
    }
  };

  const handleMembersPerPageChange = (value: string) => {
    setMembersPerPage(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search and Create Section */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Buscar y Gestionar Socios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 " />
              <Input
                placeholder="Buscar por nombre, DNI o email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 rounded-lg border-border focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSearch}
                className="whitespace-nowrap"
              >
                Limpiar
              </Button>
            )}
            <Link href="/socios/crear">
              <Button className="bg-primary hover:bg-primary/85 text-primary-foreground rounded-lg whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Crear Socio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">
              Lista de Socios ({filteredMembers.length})
            </CardTitle>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Cargando socios...
                </p>
              </div>
            ) : paginatedMembers.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No se encontraron socios"
                    : "No hay socios registrados"}
                </p>
              </div>
            ) : (
              paginatedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Member Info Section */}
                  <div className="flex justify-center sm:items-start gap-3 flex-1 min-w-0 ">
                    {/* Avatar - visible on mobile too but smaller */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0 sm:my-auto ">
                      {member.photo ? (
                        <img
                          src={member.photo || "/placeholder.svg"}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base sm:text-lg truncate">
                        {member.lastName}, {member.firstName}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          DNI: {member.dni}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </p>
                        {member.phone && (
                          <p className="text-sm text-muted-foreground">
                            {member.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <Badge
                      variant={
                        member.status === MEMBER_STATUS.ACTIVE
                          ? "default"
                          : "secondary"
                      }
                      className={`${
                        member.status === MEMBER_STATUS.ACTIVE
                          ? "bg-primary text-primary-foreground"
                          : ""
                      } flex-shrink-0`}
                    >
                      {member.status === MEMBER_STATUS.ACTIVE
                        ? "Activo"
                        : "Inactivo"}
                    </Badge>

                    <div className="flex gap-2">
                      <Link href={`/socios/${member.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

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
                              ¿Eliminar socio?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará
                              permanentemente el socio {member.firstName}{" "}
                              {member.lastName} del sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMember(member.id)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls - Always show to keep items per page selector visible */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-4 border-t border-border gap-3">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + membersPerPage, filteredMembers.length)} de{" "}
              {filteredMembers.length} socios
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2">
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
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
                </div>
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
    </div>
  );
}
