import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSocioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsNumber()
  dni: number;

  @Type(() => Date)
  @IsDate()
  fechaNacimiento: Date;

  @IsString()
  direccion: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
