// Tipos centralizados para el sistema de gestión del club

import { ESTADO_SOCIO, GENERO } from "./constants";

// Interfaz principal de Socio
export interface Socio {
  id?: string;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  fechaIngreso?: string;
  direccion: string;
  estado: ESTADO_SOCIO;
  genero: GENERO;
}

export interface SocioWithFoto extends Socio {
  fotoUrl?: string;
}

// Interfaz de Temporada
export interface Temporada {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activa' | 'inactiva' | 'proxima' | 'finalizada';
  descripcion?: string;
}

// Interfaz de Asociación entre Socio y Temporada
export interface Asociacion {
  id: string;
  idSocio: string;
  idTemporada: string;
  fechaAsociacion: string;
  estado: 'activa' | 'inactiva';
  socio?: Socio;
  temporada?: Temporada;
}

// Interfaz para estadísticas de entradas
export interface RegistroEntrada {
  id: string;
  idSocio: string;
  nombreSocio: string;
  dniSocio: string;
  horaEntrada: string;
  fecha: string;
}

// Interfaz para estadísticas diarias
export interface EstadisticasDiarias {
  fecha: string;
  totalEntradas: number;
  actualmenteDentro: number;
  picoOcupacion: number;
  tiempoPromedioEstadia?: number;
}

// Interfaces para paginación
export interface Paginacion {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
  tieneSiguientePagina: boolean;
  tieneAnteriorPagina: boolean;
}

// Interfaz para respuestas de búsqueda
export interface RespuestaBusqueda {
  socios: Socio[];
  paginacion: Paginacion;
}

// Aliases for English compatibility (for statistics component)
export type EntryLog = RegistroEntrada;
export type DailyStats = EstadisticasDiarias;
