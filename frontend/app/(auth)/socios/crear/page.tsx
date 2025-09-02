"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { PhotoCropper } from "@/components/photo-cropper";
import { toast } from "sonner";
import { MemberForm } from "@/components/member-form";
import { Socio } from "@/lib/types";

export default function CreateMemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleCreateSocio = async (formData: Omit<Socio, 'id'>) => {
    try {
      setIsSubmitting(true);
      console.log("Creando socio:", { ...formData, foto: photoPreview });
      
      // Aquí iría la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar toast de éxito con Sonner
      toast.success("El socio se ha creado correctamente.");
      
      // Redirigir después de crear el socio
      router.push("/socios");
    } catch (error) {
      console.error("Error al crear socio:", error);
      // Mostrar toast de error con Sonner
      toast.error("No se pudo crear el socio. Por favor, intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setPhoto(file);
      setPhotoError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropSrc(e.target?.result as string);
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

  return (
    <div className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 my-4 max-w-4xl">
        <Card className="w-full">
          <div className="grid sm:grid-cols-3 grid-cols-2 justify-between items-center gap-4 mb-6 px-6">
            <Link href="/socios">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground text-center">
              Crear Nuevo Socio
            </h1>
          </div>

          <CardContent>
            {/* Photo Upload */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium">Foto del Socio</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
                      alt="Vista previa"
                      className="w-32 h-32 rounded-full object-cover mx-auto outline-2"
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

            {/* Member Form */}
            <MemberForm
              onSubmit={handleCreateSocio}
              onCancel={() => router.push("/socios")}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modal de recorte de imagen */}
      {cropSrc && (
        <PhotoCropper
          imageSrc={cropSrc}
          onCancel={() => setCropSrc(null)}
          onSave={(cropped) => {
            setPhotoPreview(cropped);
            setPhotoError(null);
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}
