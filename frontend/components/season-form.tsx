"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { Season } from "@/lib/types";
import { ERROR_MESSAGES, VALIDATION } from "@/lib/constants";

interface SeasonFormData {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface SeasonFormProps {
  season?: Season;
  onSubmit: (season: Omit<Season, "id">) => void;
  onCancel: () => void;
}

export function SeasonForm({ season, onSubmit, onCancel }: SeasonFormProps) {
  const [formData, setFormData] = useState<SeasonFormData>({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (season) {
      setFormData({
        name: season.name,
        startDate: season.startDate,
        endDate: season.endDate,
        description: season.description || "",
      });
    }
  }, [season]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validación del nombre
    if (!formData.name.trim()) {
      newErrors.name = ERROR_MESSAGES.INVALID_SEASON_NAME;
    }

    // Validación de la fecha de inicio
    if (!formData.startDate) {
      newErrors.startDate = ERROR_MESSAGES.INVALID_START_DATE;
    }

    // Validación de la fecha de fin
    if (!formData.endDate) {
      newErrors.endDate = ERROR_MESSAGES.INVALID_END_DATE;
    }

    // Validación de las fechas cuando ambas están presentes
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (start >= end) {
        newErrors.endDate = ERROR_MESSAGES.INVALID_DATE_ORDER;
      }
    }

    // Validación de la descripción
    if (formData.description && formData.description.length > 100) {
      newErrors.description = ERROR_MESSAGES.INVALID_DESCRIPTION_LENGTH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SeasonFormData, value: string) => {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Temporada *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Temporada Verano 2024-2025"
          className={`w-full resize-none ${
            errors.name ? "border-destructive" : "border-border"
          }`}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de Inicio *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className={`w-full resize-none ${
              errors.startDate ? "border-destructive" : "border-border"
            }`}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha de Fin *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className={`w-full resize-none ${
              errors.endDate ? "border-destructive" : "border-border"
            }`}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Descripción de la temporada, horarios especiales, etc."
          rows={3}
          maxLength={100}
          className={`w-full resize-none break-words ${
            errors.description ? "border-destructive" : "border-border"
          }`}
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{formData.description?.length || 0}/100 caracteres</span>
          {errors.description && (
            <span className="text-destructive">{errors.description}</span>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {season ? "Actualizar" : "Crear"} Temporada
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 hover:bg-destructive">
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}
