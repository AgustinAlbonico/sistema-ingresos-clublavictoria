"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X } from "lucide-react"

interface Member {
  id: string
  dni: string
  name: string
  email: string
  phone: string
  status: "active" | "inactive"
  joinDate: string
  photo?: string
}

interface MemberFormProps {
  member?: Member
  onSubmit: (member: Omit<Member, "id">) => void
  onCancel: () => void
}

export function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState({
    dni: member?.dni || "",
    name: member?.name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    status: member?.status || ("active" as const),
    joinDate: member?.joinDate || new Date().toISOString().split("T")[0],
    photo: member?.photo || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio"
    } else if (!/^[0-9]{8}[A-Z]$/.test(formData.dni.trim())) {
      newErrors.dni = "Formato de DNI inválido (ej: 12345678A)"
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
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
        <Label htmlFor="dni" className="text-foreground">
          DNI *
        </Label>
        <Input
          id="dni"
          value={formData.dni}
          onChange={(e) => handleChange("dni", e.target.value.toUpperCase())}
          placeholder="12345678A"
          className={`rounded-lg ${errors.dni ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
        />
        {errors.dni && <p className="text-sm text-destructive">{errors.dni}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Nombre Completo *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ana García López"
          className={`rounded-lg ${errors.name ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="ana.garcia@email.com"
          className={`rounded-lg ${errors.email ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          Teléfono *
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+34 600 123 456"
          className={`rounded-lg ${errors.phone ? "border-destructive" : "border-border"} focus:ring-primary focus:border-primary`}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-foreground">
          Estado
        </Label>
        <Select value={formData.status} onValueChange={(value: "active" | "inactive") => handleChange("status", value)}>
          <SelectTrigger className="rounded-lg border-border focus:ring-primary focus:border-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="joinDate" className="text-foreground">
          Fecha de Ingreso
        </Label>
        <Input
          id="joinDate"
          type="date"
          value={formData.joinDate}
          onChange={(e) => handleChange("joinDate", e.target.value)}
          className="rounded-lg border-border focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo" className="text-foreground">
          URL de Foto (opcional)
        </Label>
        <Input
          id="photo"
          value={formData.photo}
          onChange={(e) => handleChange("photo", e.target.value)}
          placeholder="https://ejemplo.com/foto.jpg"
          className="rounded-lg border-border focus:ring-primary focus:border-primary"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
          <Save className="h-4 w-4 mr-2" />
          {member ? "Actualizar" : "Crear"} Socio
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
