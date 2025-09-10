"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { Temporada } from "@/lib/types";
import { MENSAJES_ERROR, VALIDACION } from "@/lib/constants";

interface SeasonFormProps {
  season?: Temporada;
  onSubmit: (temporada: Omit<Temporada, "id">) => void;
  onCancel: () => void;
}

export function SeasonForm({ season, onSubmit, onCancel }: SeasonFormProps) {
  const [datosFormulario, setDatosFormulario] = useState<Temporada>({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (season) {
      setDatosFormulario({
        nombre: season.nombre,
        fechaInicio: season.fechaInicio,
        fechaFin: season.fechaFin,
        descripcion: season.descripcion || "",
      });
    }
  }, [season]);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    // Validación del nombre
    if (!datosFormulario.nombre.trim()) {
      nuevosErrores.nombre = MENSAJES_ERROR.NOMBRE_TEMPORADA_INVALIDO;
    }

    // Validación de la fecha de inicio
    if (!datosFormulario.fechaInicio) {
      nuevosErrores.fechaInicio = MENSAJES_ERROR.FECHA_INICIO_INVALIDA;
    }

    // Validación de la fecha de fin
    if (!datosFormulario.fechaFin) {
      nuevosErrores.fechaFin = MENSAJES_ERROR.FECHA_FIN_INVALIDA;
    }

    // Validación de las fechas cuando ambas están presentes
    if (datosFormulario.fechaInicio && datosFormulario.fechaFin) {
      const inicio = new Date(datosFormulario.fechaInicio);
      const fin = new Date(datosFormulario.fechaFin);

      if (inicio >= fin) {
        nuevosErrores.fechaFin = MENSAJES_ERROR.ORDEN_FECHAS_INVALIDO;
      }
    }

    // Validación de la descripción
    if (datosFormulario.descripcion && datosFormulario.descripcion.length > 100) {
      nuevosErrores.descripcion = MENSAJES_ERROR.LONGITUD_DESCRIPCION_INVALIDA;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    onSubmit(datosFormulario);
  };

  const handleCambioInput = (campo: keyof Temporada, valor: string) => {
    setDatosFormulario((prev) => ({ ...prev, [campo]: valor }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errores[campo]) {
      setErrores((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[campo];
        return nuevosErrores;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Temporada *</Label>
        <Input
          id="nombre"
          value={datosFormulario.nombre}
          onChange={(e) => handleCambioInput("nombre", e.target.value)}
          placeholder="Temporada Verano 2024-2025"
          className={`w-full resize-none ${
            errores.nombre ? "border-destructive" : "border-border"
          }`}
        />
        {errores.nombre && <p className="text-sm text-destructive">{errores.nombre}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
          <Input
            id="fechaInicio"
            type="date"
            value={datosFormulario.fechaInicio}
            onChange={(e) => handleCambioInput("fechaInicio", e.target.value)}
            className={`w-full resize-none ${
              errores.fechaInicio ? "border-destructive" : "border-border"
            }`}
          />
          {errores.fechaInicio && (
            <p className="text-sm text-destructive">{errores.fechaInicio}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaFin">Fecha de Fin *</Label>
          <Input
            id="fechaFin"
            type="date"
            value={datosFormulario.fechaFin}
            onChange={(e) => handleCambioInput("fechaFin", e.target.value)}
            className={`w-full resize-none ${
              errores.fechaFin ? "border-destructive" : "border-border"
            }`}
          />
          {errores.fechaFin && (
            <p className="text-sm text-destructive">{errores.fechaFin}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción (opcional)</Label>
        <Textarea
          id="descripcion"
          value={datosFormulario.descripcion}
          onChange={(e) => handleCambioInput("descripcion", e.target.value)}
          placeholder="Descripción de la temporada, horarios especiales, etc."
          rows={3}
          maxLength={100}
          className={`w-full resize-none break-words ${
            errores.descripcion ? "border-destructive" : "border-border"
          }`}
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{datosFormulario.descripcion?.length || 0}/100 caracteres</span>
          {errores.descripcion && (
            <span className="text-destructive">{errores.descripcion}</span>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/85 hover:scale-105 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {season ? "Actualizar" : "Crear"} Temporada
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-destructive hover:bg-destructive/85 hover:scale-105 text-white">
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}
