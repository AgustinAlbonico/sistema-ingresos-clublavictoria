"use client";

import { useState } from "react";
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

interface Member {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  photo?: string;
}

const mockMembers: Member[] = [
  {
    id: "1",
    dni: "12345678A",
    firstName: "Ana",
    lastName: "García López",
    email: "ana.garcia@email.com",
    phone: "+34 600 123 456",
    status: "active",
  },
  {
    id: "2",
    dni: "87654321B",
    firstName: "Carlos",
    lastName: "Martínez Ruiz",
    email: "carlos.martinez@email.com",
    phone: "+34 600 654 321",
    status: "active",
  },
  {
    id: "3",
    dni: "11223344C",
    firstName: "Elena",
    lastName: "Rodríguez Sánchez",
    email: "elena.rodriguez@email.com",
    phone: "+34 600 789 012",
    status: "inactive",
  },
  {
    id: "4",
    dni: "55667788D",
    firstName: "Miguel",
    lastName: "Fernández Torres",
    email: "miguel.fernandez@email.com",
    phone: "+34 600 345 678",
    status: "active",
  },
  {
    id: "5",
    dni: "99887766E",
    firstName: "Laura",
    lastName: "Jiménez Morales",
    email: "laura.jimenez@email.com",
    phone: "+34 600 111 222",
    status: "active",
  },
  {
    id: "6",
    dni: "44556677F",
    firstName: "David",
    lastName: "López Herrera",
    email: "david.lopez@email.com",
    phone: "+34 600 333 444",
    status: "active",
  },
  {
    id: "7",
    dni: "33445566G",
    firstName: "María",
    lastName: "Sánchez Ruiz",
    email: "maria.sanchez@email.com",
    phone: "+34 600 555 666",
    status: "inactive",
  },
  {
    id: "8",
    dni: "22334455H",
    firstName: "José",
    lastName: "Morales García",
    email: "jose.morales@email.com",
    phone: "+34 600 777 888",
    status: "active",
  },
];

export function MemberManagement() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId));
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, DNI o email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 rounded-lg border-border focus:ring-primary focus:border-primary"
              />
            </div>
            <Link href="/socios/crear">
              <Button className="bg-primary hover:bg-primary/85 text-primary-foreground rounded-lg">
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
            {paginatedMembers.length === 0 ? (
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
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      {member.photo ? (
                        <img
                          src={member.photo || "/placeholder.svg"}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {member.lastName}, {member.firstName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        DNI: {member.dni}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        member.status === "active" ? "default" : "secondary"
                      }
                      className={
                        member.status === "active"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {member.status === "active" ? "Activo" : "Inactivo"}
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
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
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
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMember(member.id)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a{" "}
                {Math.min(startIndex + membersPerPage, filteredMembers.length)}{" "}
                de {filteredMembers.length} socios
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
  );
}
