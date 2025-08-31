"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, Calendar, Plus, Trash2, User, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

interface Member {
  id: string
  dni: string
  firstName: string
  lastName: string
  email: string
  status: "active" | "inactive"
}

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
}

interface Association {
  id: string
  memberId: string
  seasonId: string
  associatedDate: string
  status: "active" | "inactive"
}

// Mock data - Updated member structure with firstName/lastName
const mockMembers: Member[] = [
  {
    id: "1",
    dni: "12345678A",
    firstName: "Ana",
    lastName: "García López",
    email: "ana.garcia@email.com",
    status: "active",
  },
  {
    id: "2",
    dni: "87654321B",
    firstName: "Carlos",
    lastName: "Martínez Ruiz",
    email: "carlos.martinez@email.com",
    status: "active",
  },
  {
    id: "3",
    dni: "11223344C",
    firstName: "Elena",
    lastName: "Rodríguez Sánchez",
    email: "elena.rodriguez@email.com",
    status: "inactive",
  },
  {
    id: "4",
    dni: "55667788D",
    firstName: "Miguel",
    lastName: "Fernández Torres",
    email: "miguel.fernandez@email.com",
    status: "active",
  },
  {
    id: "5",
    dni: "99887766E",
    firstName: "Laura",
    lastName: "Jiménez Morales",
    email: "laura.jimenez@email.com",
    status: "active",
  },
  {
    id: "6",
    dni: "44556677F",
    firstName: "David",
    lastName: "López Herrera",
    email: "david.lopez@email.com",
    status: "active",
  },
]

const mockSeasons: Season[] = [
  { id: "1", name: "Temporada Verano 2024-2025", startDate: "2024-12-01", endDate: "2025-03-31" },
  { id: "2", name: "Temporada Invierno 2024", startDate: "2024-06-01", endDate: "2024-11-30" },
  { id: "3", name: "Temporada Verano 2025-2026", startDate: "2025-12-01", endDate: "2026-03-31" },
]

const mockAssociations: Association[] = [
  { id: "1", memberId: "1", seasonId: "1", associatedDate: "2024-12-01", status: "active" },
  { id: "2", memberId: "2", seasonId: "1", associatedDate: "2024-12-05", status: "active" },
  { id: "3", memberId: "4", seasonId: "1", associatedDate: "2024-12-10", status: "active" },
]

export function AssociationManagement() {
  const [members] = useState<Member[]>(mockMembers)
  const [seasons] = useState<Season[]>(mockSeasons)
  const [associations, setAssociations] = useState<Association[]>(mockAssociations)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("")
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const membersPerPage = 8

  useEffect(() => {
    const currentDate = new Date()
    const currentSeason = seasons.find((season) => {
      const startDate = new Date(season.startDate)
      const endDate = new Date(season.endDate)
      return currentDate >= startDate && currentDate <= endDate
    })

    if (currentSeason) {
      setSelectedSeasonId(currentSeason.id)
    } else if (seasons.length > 0) {
      const sortedSeasons = [...seasons].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
      setSelectedSeasonId(sortedSeasons[0].id)
    }
  }, [seasons])

  const handleAddMemberToSeason = (memberId: string) => {
    if (!selectedSeasonId) return

    const newAssociation: Association = {
      id: Date.now().toString(),
      memberId,
      seasonId: selectedSeasonId,
      associatedDate: new Date().toISOString().split("T")[0],
      status: "active",
    }
    setAssociations([...associations, newAssociation])
    setIsAddMemberDialogOpen(false)
  }

  const handleRemoveAssociation = (associationId: string) => {
    setAssociations(associations.filter((assoc) => assoc.id !== associationId))
  }

  const getSeasonMembers = () => {
    if (!selectedSeasonId) return []

    return associations
      .filter((assoc) => assoc.seasonId === selectedSeasonId && assoc.status === "active")
      .map((assoc) => ({
        ...assoc,
        member: members.find((member) => member.id === assoc.memberId)!,
      }))
      .sort((a, b) => {
        const nameA = `${a.member.lastName}, ${a.member.firstName}`.toLowerCase()
        const nameB = `${b.member.lastName}, ${b.member.firstName}`.toLowerCase()
        return nameA.localeCompare(nameB)
      })
  }

  const getAvailableMembers = () => {
    if (!selectedSeasonId) return []

    const associatedMemberIds = associations
      .filter((assoc) => assoc.seasonId === selectedSeasonId && assoc.status === "active")
      .map((assoc) => assoc.memberId)

    return members
      .filter((member) => !associatedMemberIds.includes(member.id))
      .filter((member) => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase()
        return (
          fullName.includes(searchTerm.toLowerCase()) || member.dni.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      .sort((a, b) => {
        const nameA = `${a.lastName}, ${a.firstName}`.toLowerCase()
        const nameB = `${b.lastName}, ${b.firstName}`.toLowerCase()
        return nameA.localeCompare(nameB)
      })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const selectedSeason = seasons.find((season) => season.id === selectedSeasonId)
  const seasonMembers = getSeasonMembers()
  const availableMembers = getAvailableMembers()

  const totalPages = Math.ceil(availableMembers.length / membersPerPage)
  const startIndex = (currentPage - 1) * membersPerPage
  const paginatedAvailableMembers = availableMembers.slice(startIndex, startIndex + membersPerPage)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Season Selection */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Asociar Socios a Temporada de Pileta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Seleccionar Temporada</label>
              <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
                <SelectTrigger className="w-full rounded-lg border-border">
                  <SelectValue placeholder="Selecciona una temporada" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{season.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(season.startDate)} - {formatDate(season.endDate)}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Members Display */}
      {selectedSeasonId && selectedSeason && (
        <Card className="shadow-sm border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-foreground">Socios Asociados - {selectedSeason.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{seasonMembers.length} socios asociados</p>
              </div>
              <Button
                onClick={() => setIsAddMemberDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Socios
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {seasonMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay socios asociados a esta temporada</p>
                <p className="text-sm text-muted-foreground">Haz clic en "Agregar Socios" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {seasonMembers.map((assoc) => (
                  <div
                    key={assoc.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {assoc.member.lastName}, {assoc.member.firstName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          DNI: {assoc.member.dni} • Asociado el {formatDate(assoc.associatedDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20">Activo</Badge>
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
                            <AlertDialogTitle>¿Eliminar asociación?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se eliminará la asociación de {assoc.member.firstName} {assoc.member.lastName} con{" "}
                              {selectedSeason.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveAssociation(assoc.id)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Members Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Agregar Socios a {selectedSeason?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Available Members List */}
            <div className="flex-1 overflow-y-auto">
              {availableMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No se encontraron socios" : "Todos los socios ya están asociados"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {paginatedAvailableMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {member.lastName}, {member.firstName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              DNI: {member.dni} • {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {member.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                          <Button
                            onClick={() => handleAddMemberToSeason(member.id)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="sm"
                          >
                            Asociar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        {startIndex + 1} - {Math.min(startIndex + membersPerPage, availableMembers.length)} de{" "}
                        {availableMembers.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
