"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"

interface Member {
  id: string
  dni: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: "active" | "inactive"
  photo?: string
}

// Mock data - in real app, fetch from API
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
]

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string

  const [member, setMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState({
    dni: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // In real app, fetch member from API
    const foundMember = mockMembers.find((m) => m.id === memberId)
    if (foundMember) {
      setMember(foundMember)
      setFormData({
        dni: foundMember.dni,
        firstName: foundMember.firstName,
        lastName: foundMember.lastName,
        email: foundMember.email,
        phone: foundMember.phone,
        status: foundMember.status,
      })
      if (foundMember.photo) {
        setPhotoPreview(foundMember.photo)
      }
    }
  }, [memberId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dni.trim()) newErrors.dni = "El DNI es obligatorio"
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio"
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es obligatorio"
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically update in database
      console.log("Updating member:", formData, photo)
      router.push("/dashboard/members")
    }
  }

  if (!member) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/members">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Editar Socio</h1>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Información del Socio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Foto del Socio</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragOver(true)
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                >
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover mx-auto"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                        onClick={removePhoto}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Arrastra una imagen aquí o</p>
                        <Button type="button" variant="outline" asChild>
                          <label className="cursor-pointer">
                            Seleccionar archivo
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                          </label>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => handleInputChange("dni", e.target.value)}
                    className={errors.dni ? "border-destructive" : ""}
                  />
                  {errors.dni && <p className="text-sm text-destructive">{errors.dni}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Guardar Cambios
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/members")}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
