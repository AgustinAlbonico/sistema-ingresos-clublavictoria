"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { PhotoCropper } from "@/components/photo-cropper";

export default function CreateMemberPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    direccion: "",
    email: "",
    telefono: "",
    fechaDeNacimiento: "",
    sexo: "" as "M" | "F",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [cropSrc, setCropSrc] = useState<string | null>(null);

  function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  function downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setPhoto(file);
      setPhotoError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropSrc(e.target?.result as string); // abrir modal para crop
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto(null);
      setPhotoPreview(null);
      setPhotoError("El archivo debe ser una imagen (jpg, png, etc.)");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es obligatorio";
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni =
        "El DNI debe contener exactamente 8 dígitos sin puntos ni letras";
    }

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";

    if (!formData.apellido.trim())
      newErrors.apellido = "El apellido es obligatorio";

    if(!formData.fechaDeNacimiento.trim())
      newErrors.fechaDeNacimiento = "La fecha de nacimiento es obligatoria";

    if (!formData.direccion.trim())
      newErrors.direccion = "La dirección es obligatoria";

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (formData.telefono.trim() && !/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono solo debe contener números";
    }

    if (!formData.sexo) {
      newErrors.sexo = "El sexo es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Creating member:", formData, photo);
      router.push("/socios");
    }
  };

  return (
    <div className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="w-full">
          {/* Cabecera de la card */}
          <div className="flex justify-between items-center gap-4 mb-6 px-6">
            <Link href="/socios">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground text-center">
              Crear Nuevo Socio
            </h1>
            <Button variant="outline" size="sm" className="invisible">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Foto del Socio</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors opacity-0${
                    isDragOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                >
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={photoPreview}
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
                        <p className="text-sm text-muted-foreground mb-2">
                          Arrastra una imagen aquí o
                        </p>
                        <Button type="button" variant="outline" asChild>
                          <label className="cursor-pointer">
                            Seleccionar archivo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileInput}
                            />
                          </label>
                        </Button>
                      </div>
                      {photoError && (
                        <p className="text-sm text-destructive mt-2">
                          {photoError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* increased gap for better spacing */}
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => handleInputChange("dni", e.target.value)}
                    className={errors.dni ? "border-destructive" : ""}
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
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className={errors.nombre ? "border-destructive" : ""}
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
                    onChange={(e) =>
                      handleInputChange("apellido", e.target.value)
                    }
                    className={errors.apellido ? "border-destructive" : ""}
                  />
                  {errors.apellido && (
                    <p className="text-sm text-destructive">
                      {errors.apellido}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaDeNacimiento">
                    Fecha de nacimiento *
                  </Label>
                  <Input
                    id="fechaDeNacimiento"
                    type="date"
                    value={formData.fechaDeNacimiento}
                    onChange={(e) =>
                      handleInputChange("fechaDeNacimiento", e.target.value)
                    }
                    className={errors.telefono ? "border-destructive" : ""}
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
                    id="text"
                    value={formData.direccion}
                    onChange={(e) =>
                      handleInputChange("direccion", e.target.value)
                    }
                    className={errors.direccion ? "border-destructive" : ""}
                  />
                  {errors.direccion && (
                    <p className="text-sm text-destructive">
                      {errors.direccion}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) =>
                      handleInputChange("telefono", e.target.value)
                    }
                    className={errors.telefono ? "border-destructive" : ""}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-destructive">
                      {errors.telefono}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value: "M" | "F") =>
                      handleInputChange("sexo", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/85"
                >
                  Crear Socio
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/socios")}
                  className="hover:bg-destructive"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal Crop */}
      {cropSrc && (
        <PhotoCropper
          imageSrc={cropSrc}
          onCancel={() => setCropSrc(null)}
          onSave={(cropped) => {
            setPhotoPreview(cropped); // preview ya recortado
            setPhotoError(null);
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}
