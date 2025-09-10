import { IsString, IsOptional, IsDateString, IsEmail, IsEnum, IsBoolean } from 'class-validator';

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMENINO = 'FEMENINO',
}

export enum Estado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class UpdateSocioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  @IsOptional()
  dni?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  email?: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsEnum(Estado)
  estado: Estado;

  @IsEnum(Genero)
  genero: Genero;

  @IsOptional()
  fotoUrl?: string;

  @IsDateString()
  fechaAlta: string;

  @IsBoolean()
  eliminarFotoVieja?: boolean;
}
