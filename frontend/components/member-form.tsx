"use client";

import type React from "react";
import { useState, useEffect, memo } from "react";
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
import { Socio, Genero } from "@/lib/types";
import { MENSAJES_ERROR, VALIDACION } from "@/lib/constants";

// Componente reutilizable para campos de formulario
interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const FormField = memo(({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  required, 
  maxLength, 
  value, 
  error, 
  disabled,
  onChange 
}: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label} {required && "*"}</Label>
    <Input
      id={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`rounded-lg ${
        error ? "border-destructive" : "border-border"
      } focus:ring-primary focus:border-primary`}
      disabled={disabled}
    />
    {error && (
      <p className="text-sm text-destructive">{error}</p>
    )}
  </div>
));

FormField.displayName = "FormField";

// Componente reutilizable para campos select
interface SelectFieldProps {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  value: string;
  error?: string;
  disabled?: boolean;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SelectField = memo(({
  name,
  label,
  placeholder,
  required,
  value,
  error,
  disabled,
  options,
  onChange
}: SelectFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label} {required && "*"}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`rounded-lg ${
          error ? "border-destructive" : "border-border"
        } focus:ring-primary focus:border-primary`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && (
      <p className="text-sm text-destructive">{error}</p>
    )}
  </div>
));

SelectField.displayName = "SelectField";

interface MemberFormProps {
  socio?: Socio;
  onSubmit: (socio: Omit<Socio, "id">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Función helper para crear datos del formulario desde un socio
const createFormDataFromSocio = (socio?: Socio): Omit<Socio, "id"> => ({
  dni: socio?.dni || "",
  nombre: socio?.nombre || "",
  apellido: socio?.apellido || "",
  direccion: socio?.direccion || "",
  email: socio?.email || "",
  telefono: socio?.telefono || "",
  fechaNacimiento: socio?.fechaNacimiento || "",
  genero: socio?.genero || "M",
  estado: socio?.estado || "activo",
  foto: socio?.foto || "",
  fechaIngreso: socio?.fechaIngreso || "",
});

export function MemberForm({
  socio,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: MemberFormProps) {
  const [formData, setFormData] = useState<Omit<Socio, "id">>(() => 
    createFormDataFromSocio(socio)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar formulario cuando cambie el socio
  useEffect(() => {
    setFormData(createFormDataFromSocio(socio));
  }, [socio]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validación del DNI - debe tener exactamente 8 dígitos
    if (!formData.dni.trim()) {
      newErrors.dni = MENSAJES_ERROR.CAMPO_REQUERIDO;
    } else if (!VALIDACION.DNI.REGEX.test(formData.dni.trim())) {
      newErrors.dni = MENSAJES_ERROR.DNI_INVALIDO;
    }

    // Validación del nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = MENSAJES_ERROR.CAMPO_REQUERIDO;
    }

    // Validación del apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = MENSAJES_ERROR.CAMPO_REQUERIDO;
    }

    // Validación de la dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = MENSAJES_ERROR.CAMPO_REQUERIDO;
    }

    // Validación del email
    if (formData.email && formData.email.trim() && !VALIDACION.EMAIL.REGEX.test(formData.email.trim())) {
      newErrors.email = MENSAJES_ERROR.EMAIL_INVALIDO;
    }

    // Validación del género
    if (!formData.genero || (formData.genero !== 'M' && formData.genero !== 'F')) {
      newErrors.genero = MENSAJES_ERROR.CAMPO_REQUERIDO;
    }

    // Validación del estado
    if (!formData.estado || (formData.estado !== 'activo' && formData.estado !== 'inactivo')) {
      newErrors.estado = MENSAJES_ERROR.CAMPO_REQUERIDO;
    }

    // Validación de la fecha de nacimiento
    if (formData.fechaNacimiento && formData.fechaNacimiento.trim()) {
      const birthDate = new Date(formData.fechaNacimiento);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear la hora a 00:00:00

      if (isNaN(birthDate.getTime())) {
        newErrors.fechaNacimiento = "Fecha inválida";
      } else if (birthDate > today) {
        newErrors.fechaNacimiento = MENSAJES_ERROR.FECHA_NACIMIENTO_INVALIDA;
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Ajustar edad si aún no ha cumplido años este año
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age > VALIDACION.EDAD.MAXIMA) {
          newErrors.fechaNacimiento = MENSAJES_ERROR.EDAD_FUERA_DE_RANGO;
        }
      }
    } else {
      newErrors.fechaNacimiento = MENSAJES_ERROR.CAMPO_REQUERIDO;
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

  const handleChange = (field: keyof Omit<Socio, "id">, value: string | Genero) => {
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
        <FormField
          name="dni"
          label="DNI"
          placeholder="12345678"
          required
          maxLength={8}
          value={formData.dni}
          error={errors.dni}
          disabled={isSubmitting}
          onChange={(value) => handleChange("dni", value)}
        />

        <FormField
          name="nombre"
          label="Nombre"
          placeholder="Ana"
          required
          value={formData.nombre}
          error={errors.nombre}
          disabled={isSubmitting}
          onChange={(value) => handleChange("nombre", value)}
        />

        <FormField
          name="apellido"
          label="Apellido"
          placeholder="García López"
          required
          value={formData.apellido}
          error={errors.apellido}
          disabled={isSubmitting}
          onChange={(value) => handleChange("apellido", value)}
        />

        <FormField
          name="fechaNacimiento"
          label="Fecha de Nacimiento"
          type="date"
          required
          value={formData.fechaNacimiento || ""}
          error={errors.fechaNacimiento}
          disabled={isSubmitting}
          onChange={(value) => handleChange("fechaNacimiento", value)}
        />

        <FormField
          name="direccion"
          label="Dirección"
          placeholder="Av. Siempre Viva 742"
          required
          value={formData.direccion}
          error={errors.direccion}
          disabled={isSubmitting}
          onChange={(value) => handleChange("direccion", value)}
        />

        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="ana.garcia@email.com"
          value={formData.email || ""}
          error={errors.email}
          disabled={isSubmitting}
          onChange={(value) => handleChange("email", value)}
        />

        <FormField
          name="telefono"
          label="Teléfono"
          placeholder="1122334455"
          value={formData.telefono || ""}
          error={errors.telefono}
          disabled={isSubmitting}
          onChange={(value) => handleChange("telefono", value)}
        />

        <SelectField
          name="genero"
          label="Género"
          placeholder="Seleccione el género"
          required
          value={formData.genero || "M"}
          error={errors.genero}
          disabled={isSubmitting}
          options={[
            { value: "M", label: "Masculino" },
            { value: "F", label: "Femenino" }
          ]}
          onChange={(value) => handleChange("genero", value as Genero)}
        />

        <SelectField
          name="estado"
          label="Estado"
          placeholder="Seleccione el estado"
          required
          value={formData.estado}
          error={errors.estado}
          disabled={isSubmitting}
          options={[
            { value: "activo", label: "Activo" },
            { value: "inactivo", label: "Inactivo" }
          ]}
          onChange={(value) => handleChange("estado", value)}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/85 text-primary-foreground rounded-lg"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Guardando..." : socio ? "Actualizar" : "Crear"}
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
