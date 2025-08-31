"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, X } from "lucide-react"

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
  description?: string
  currentMembers: number
}

interface SeasonFormProps {
  season?: Season
  onSubmit: (season: Omit<Season, "id" | "currentMembers">) => void
  onCancel: () => void
}

export function SeasonForm({ season, onSubmit, onCancel }: SeasonFormProps) {
  const [formData, setFormData] = useState({
    name: season?.name || "",
    startDate: season?.startDate || "",
    endDate: season?.endDate || "",
    description: season?.description || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la temporada es obligatorio"
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es obligatoria"
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es obligatoria"
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)

      if (startDate >= endDate) {
        newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio"
      }

      // Check for overlapping seasons (simplified validation)
      const duration = endDate.getTime() - startDate.getTime()
      const daysDuration = duration / (1000 * 3600 * 24)

      if (daysDuration < 30) {
        newErrors.endDate = "La temporada debe durar al menos 30 días"
      }

      if (daysDuration > 365) {
        newErrors.endDate = "La temporada no puede durar más de 365 días"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description.trim() || undefined,
      })
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Nombre de la Temporada *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Temporada Verano 2024-2025"
          className={`rounded-lg ${errors.name ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-foreground">
            Fecha de Inicio *
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className={`rounded-lg ${errors.startDate ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
          />
          {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-foreground">
            Fecha de Fin *
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className={`rounded-lg ${errors.endDate ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
          />
          {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Descripción (opcional)
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descripción de la temporada, horarios especiales, etc."
          className="rounded-lg border-border focus:ring-primary focus:border-primary resize-none"
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
          <Save className="h-4 w-4 mr-2" />
          {season ? "Actualizar" : "Crear"} Temporada
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
