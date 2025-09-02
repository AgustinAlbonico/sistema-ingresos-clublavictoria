// Tipos centralizados para el sistema de gestión del club

// Estados de socios
export type MemberStatus = 'active' | 'inactive';

// Géneros
export type Gender = 'M' | 'F';

// Interfaz principal de Socio/Member
export interface Member {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  status: MemberStatus;
  photo?: string;
  joinDate?: string;
  address?: string;
  gender?: Gender;
}

// Interfaz de Temporada/Season
export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

// Interfaz de Asociación entre Socio y Temporada
export interface Association {
  id: string;
  memberId: string;
  seasonId: string;
  associationDate: string;
  member?: Member;
  season?: Season;
}

// Interfaz para estadísticas de entradas
export interface EntryLog {
  id: string;
  memberId: string;
  memberName: string;
  memberDni: string;
  entryTime: string;
  date: string;
}

// Interfaz para estadísticas diarias
export interface DailyStats {
  date: string;
  totalEntries: number;
  currentlyInside: number;
  peakOccupancy: number;
  averageStayTime?: number;
}

// Interfaces para paginación
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
