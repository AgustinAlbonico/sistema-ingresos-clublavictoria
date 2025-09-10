import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateTemporadaDto {
    @IsString()
    nombre: string;

    @IsDateString()
    fechaInicio: string;

    @IsDateString()
    fechaFin: string;

    @IsString()
    @IsOptional()
    descripcion?: string;
}
