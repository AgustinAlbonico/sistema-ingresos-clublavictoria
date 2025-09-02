"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { Member } from "@/lib/types";
import { MEMBER_STATUS, ERROR_MESSAGES, VALIDATION } from "@/lib/constants";

// Interfaz compatible con las páginas existentes
export interface ISocio {
  id?: string;
  dni: string;
  nombre: string;
  apellido: string;
  direccion: string;
  email?: string;
  telefono?: string;
  fechaDeNacimiento: string;
  sexo: "M" | "F";
  estado: "activo" | "inactivo";
  photo?: string;
}

interface MemberFormProps {
  member?: ISocio;
  onSubmit: (member: Omit<ISocio, "id">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function MemberForm({
  member,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: MemberFormProps) {
  const [formData, setFormData] = useState<Omit<ISocio, "id">>({
    dni: member?.dni || "",
    nombre: member?.nombre || "",
    apellido: member?.apellido || "",
    direccion: member?.direccion || "",
    email: member?.email || "",
    telefono: member?.telefono || "",
    fechaDeNacimiento: member?.fechaDeNacimiento || "",
    sexo: member?.sexo || "M",
    estado: member?.estado || "activo",
    photo: member?.photo || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar formulario cuando cambie el member
  useEffect(() => {
    if (member) {
      setFormData({
        dni: member.dni || "",
        nombre: member.nombre || "",
        apellido: member.apellido || "",
        direccion: member.direccion || "",
        email: member.email || "",
        telefono: member.telefono || "",
        fechaDeNacimiento: member.fechaDeNacimiento || "",
        sexo: member.sexo || "M",
        estado: member.estado || "activo",
        photo: member.photo || "",
      });
    }
  }, [member]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validación del DNI - debe tener exactamente 8 dígitos
    if (!formData.dni.trim()) {
      newErrors.dni = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!VALIDATION.DNI.REGEX.test(formData.dni.trim())) {
      newErrors.dni = ERROR_MESSAGES.INVALID_DNI;
    }

    // Validación del nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    // Validación del apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    // Validación de la dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    // Validación del email
    if (formData.email && !VALIDATION.EMAIL.REGEX.test(formData.email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    // Validación de la fecha de nacimiento
    if (formData.fechaDeNacimiento) {
      const birthDate = new Date(formData.fechaDeNacimiento);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear la hora a 00:00:00

      if (birthDate > today) {
        newErrors.fechaDeNacimiento = ERROR_MESSAGES.INVALID_BIRTH_DATE;
      } else {
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age > 120) {
          newErrors.fechaDeNacimiento = "La edad debe estar entre 0 y 120 años";
        }
      }
    } else {
      newErrors.fechaDeNacimiento = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof Omit<ISocio, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dni">DNI *</Label>
          <Input
            id="dni"
            value={formData.dni}
            onChange={(e) => handleChange("dni", e.target.value)}
            placeholder="12345678"
            maxLength={8}
            className={`rounded-lg ${
              errors.dni ? "border-destructive" : "border-border"
            } focus:ring-primary focus:border-primary`}
            disabled={isSubmitting}
          />
          {errors.dni && (
            <p className="text-sm text-destructive">{errors.dni}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Ana"
            className={`rounded-lg ${
              errors.nombre ? "border-destructive" : "border-border"
            } focus:ring-primary focus:border-primary`}
            disabled={isSubmitting}
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => handleChange("apellido", e.target.value)}
            placeholder="García López"
            className={`rounded-lg ${
              errors.apellido ? "border-destructive" : "border-border"
            } focus:ring-primary focus:border-primary`}
            disabled={isSubmitting}
          />
          {errors.apellido && (
            <p className="text-sm text-destructive">{errors.apellido}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaDeNacimiento">Fecha de Nacimiento *</Label>
          <Input
            id="fechaDeNacimiento"
            type="date"
            value={formData.fechaDeNacimiento}
            onChange={(e) => handleChange("fechaDeNacimiento", e.target.value)}
            className={`rounded-lg ${
              errors.fechaDeNacimiento ? "border-destructive" : "border-border"
            } focus:ring-primary focus:border-primary`}
            disabled={isSubmitting}
          />
          {errors.fechaDeNacimiento && (
            <p className="text-sm text-destructive">
              {errors.fechaDeNacimiento}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => handleChange("direccion", e.target.value)}
            placeholder="Av. Siempre Viva 742"
            className={`rounded-lg ${
              errors.direccion ? "border-destructive" : "border-border"
            } focus:ring-primary focus:border-primary`}
            disabled={isSubmitting}
          />
          {errors.direccion && (
            <p className="text-sm text-destructive">{errors.direccion}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="ana.garcia@email.com"
            className={`rounded-lg ${
              errors.email ? "border-destructive" : "border-border"
            } focus:ring-primary focus:border-primary`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono || ""}
            onChange={(e) => handleChange("telefono", e.target.value)}
            placeholder="1122334455"
            className={`rounded-lg ${
              errors.telefono ? "border-destructive" : "border-border"
            } focus:ring-primary focus:border-primary`}
            disabled={isSubmitting}
          />
          {errors.telefono && (
            <p className="text-sm text-destructive">{errors.telefono}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo *</Label>
          <Select
            value={formData.sexo}
            onValueChange={(value: "M" | "F") => handleChange("sexo", value)}
          >
            <SelectTrigger
              className={`rounded-lg ${
                errors.sexo ? "border-destructive" : "border-border"
              } focus:ring-primary focus:border-primary`}
            >
              <SelectValue placeholder="Seleccione el sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Femenino</SelectItem>
            </SelectContent>
          </Select>
          {errors.sexo && (
            <p className="text-sm text-destructive">{errors.sexo}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Select
            value={formData.estado}
            onValueChange={(value: "activo" | "inactivo") =>
              handleChange("estado", value)
            }
          >
            <SelectTrigger
              className={`rounded-lg ${
                errors.estado ? "border-destructive" : "border-border"
              } focus:ring-primary focus:border-primary`}
            >
              <SelectValue placeholder="Seleccione el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
          {errors.estado && (
            <p className="text-sm text-destructive">{errors.estado}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/85 text-primary-foreground rounded-lg"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Guardando..." : member ? "Actualizar" : "Crear"}{" "}
          Socio
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 rounded-lg border-border hover:bg-destructive bg-transparent"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}
