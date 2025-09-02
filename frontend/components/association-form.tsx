"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, X } from "lucide-react"
import { Member, Season, Association } from "@/lib/types"
import { MEMBER_STATUS, SEASON_STATUS, ASSOCIATION_STATUS, ERROR_MESSAGES } from "@/lib/constants"

interface AssociationFormProps {
  members: Member[]
  seasons: Season[]
  existingAssociations: Association[]
  onSubmit: (association: { memberId: string; seasonId: string }) => void
  onCancel: () => void
}

export function AssociationForm({ members, seasons, existingAssociations, onSubmit, onCancel }: AssociationFormProps) {
  const [selectedMember, setSelectedMember] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter active members and available seasons
  const activeMembers = members.filter((member) => member.status === MEMBER_STATUS.ACTIVE)
  const availableSeasons = seasons.filter((season) => 
    season.status === SEASON_STATUS.ACTIVE || season.status === SEASON_STATUS.UPCOMING
  )

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedMember) {
      newErrors.member = ERROR_MESSAGES.REQUIRED_FIELD
    }

    if (!selectedSeason) {
      newErrors.season = ERROR_MESSAGES.REQUIRED_FIELD
    }

    if (selectedMember && selectedSeason) {
      // Check if association already exists
      const existingAssociation = existingAssociations.find(
        (assoc) => assoc.memberId === selectedMember && assoc.seasonId === selectedSeason && assoc.status === ASSOCIATION_STATUS.ACTIVE,
      )

      if (existingAssociation) {
        newErrors.general = "Esta asociación ya existe"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        memberId: selectedMember,
        seasonId: selectedSeason,
      })
    }
  }

  const handleMemberChange = (value: string) => {
    setSelectedMember(value)
    if (errors.member || errors.general) {
      setErrors((prev) => ({ ...prev, member: "", general: "" }))
    }
  }

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(value)
    if (errors.season || errors.general) {
      setErrors((prev) => ({ ...prev, season: "", general: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{errors.general}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="member" className="text-foreground">
          Seleccionar Socio *
        </Label>
        <Select value={selectedMember} onValueChange={handleMemberChange}>
          <SelectTrigger
            className={`rounded-lg ${errors.member ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
          >
            <SelectValue placeholder="Seleccione un socio..." />
          </SelectTrigger>
          <SelectContent>
            {activeMembers.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No hay socios activos disponibles</div>
            ) : (
              activeMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.firstName} {member.lastName}</span>
                    <span className="text-xs text-muted-foreground">DNI: {member.dni}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.member && <p className="text-sm text-destructive">{errors.member}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="season" className="text-foreground">
          Seleccionar Temporada *
        </Label>
        <Select value={selectedSeason} onValueChange={handleSeasonChange}>
          <SelectTrigger
            className={`rounded-lg ${errors.season ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
          >
            <SelectValue placeholder="Seleccione una temporada..." />
          </SelectTrigger>
          <SelectContent>
            {availableSeasons.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No hay temporadas disponibles</div>
            ) : (
              availableSeasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{season.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(season.startDate).toLocaleDateString("es-ES")} -{" "}
                      {new Date(season.endDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.season && <p className="text-sm text-destructive">{errors.season}</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
          disabled={activeMembers.length === 0 || availableSeasons.length === 0}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Asociar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 rounded-lg border-border hover:bg-muted bg-transparent"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}
