// Mock data centralizado para el sistema de gestión del club
import { Member, Season, Association, EntryLog, DailyStats } from './types';
import { MEMBER_STATUS, GENDER } from './constants';

// Mock Members
export const mockMembers: Member[] = [
  {
    id: '1',
    dni: '12345678',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@email.com',
    phone: '1234567890',
    birthDate: '1985-03-15',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-01-15',
    address: 'Av. Corrientes 1234, CABA'
  },
  {
    id: '2',
    dni: '87654321',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@email.com',
    phone: '0987654321',
    birthDate: '1990-07-22',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-02-10',
    address: 'Rivadavia 5678, CABA'
  },
  {
    id: '3',
    dni: '11223344',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '1122334455',
    birthDate: '1978-11-08',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-01-20',
    address: 'San Martín 910, CABA'
  },
  {
    id: '4',
    dni: '55667788',
    firstName: 'Ana',
    lastName: 'López',
    email: 'ana.lopez@email.com',
    phone: '5566778899',
    birthDate: '1992-05-14',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.INACTIVE,
    joinDate: '2023-03-05',
    address: 'Belgrano 1122, CABA'
  },
  {
    id: '5',
    dni: '99887766',
    firstName: 'Roberto',
    lastName: 'Martínez',
    email: 'roberto.martinez@email.com',
    phone: '9988776655',
    birthDate: '1980-12-03',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-01-30',
    address: 'Libertad 3344, CABA'
  },
  {
    id: '6',
    dni: '44556677',
    firstName: 'Laura',
    lastName: 'Fernández',
    email: 'laura.fernandez@email.com',
    phone: '4455667788',
    birthDate: '1988-09-18',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-02-15',
    address: 'Maipú 5566, CABA'
  },
  {
    id: '7',
    dni: '33445566',
    firstName: 'Diego',
    lastName: 'Silva',
    email: 'diego.silva@email.com',
    phone: '3344556677',
    birthDate: '1995-01-25',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-03-10',
    address: 'Florida 7788, CABA'
  },
  {
    id: '8',
    dni: '22334455',
    firstName: 'Sofía',
    lastName: 'Torres',
    email: 'sofia.torres@email.com',
    phone: '2233445566',
    birthDate: '1987-06-12',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-02-20',
    address: 'Callao 9900, CABA'
  },
  {
    id: '9',
    dni: '11112222',
    firstName: 'Miguel',
    lastName: 'Hernández',
    email: 'miguel.hernandez@email.com',
    phone: '1111222233',
    birthDate: '1983-04-18',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-03-15',
    address: 'Corrientes 1234, CABA'
  },
  {
    id: '10',
    dni: '33334444',
    firstName: 'Carmen',
    lastName: 'Vargas',
    email: 'carmen.vargas@email.com',
    phone: '3333444455',
    birthDate: '1991-08-25',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-03-20',
    address: 'Santa Fe 5678, CABA'
  },
  {
    id: '11',
    dni: '55556666',
    firstName: 'Fernando',
    lastName: 'Morales',
    email: 'fernando.morales@email.com',
    phone: '5555666677',
    birthDate: '1979-12-10',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-04-05',
    address: 'Córdoba 9101, CABA'
  },
  {
    id: '12',
    dni: '77778888',
    firstName: 'Patricia',
    lastName: 'Jiménez',
    email: 'patricia.jimenez@email.com',
    phone: '7777888899',
    birthDate: '1986-01-30',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-04-10',
    address: 'Uruguay 1122, CABA'
  },
  {
    id: '13',
    dni: '99990000',
    firstName: 'Ricardo',
    lastName: 'Castro',
    email: 'ricardo.castro@email.com',
    phone: '9999000011',
    birthDate: '1993-07-14',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-04-15',
    address: 'Paraguay 3344, CABA'
  },
  {
    id: '14',
    dni: '11113333',
    firstName: 'Isabel',
    lastName: 'Ruiz',
    email: 'isabel.ruiz@email.com',
    phone: '1111333344',
    birthDate: '1984-11-22',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-04-20',
    address: 'Alem 5566, CABA'
  },
  {
    id: '15',
    dni: '22225555',
    firstName: 'Eduardo',
    lastName: 'Moreno',
    email: 'eduardo.moreno@email.com',
    phone: '2222555566',
    birthDate: '1988-05-08',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-05-01',
    address: 'Reconquista 7788, CABA'
  },
  {
    id: '16',
    dni: '33337777',
    firstName: 'Lucía',
    lastName: 'Gutiérrez',
    email: 'lucia.gutierrez@email.com',
    phone: '3333777788',
    birthDate: '1990-09-16',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-05-05',
    address: 'San Nicolás 9900, CABA'
  },
  {
    id: '17',
    dni: '44449999',
    firstName: 'Alejandro',
    lastName: 'Reyes',
    email: 'alejandro.reyes@email.com',
    phone: '4444999900',
    birthDate: '1982-03-12',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-05-10',
    address: '25 de Mayo 1122, CABA'
  },
  {
    id: '18',
    dni: '55551111',
    firstName: 'Valentina',
    lastName: 'Ortiz',
    email: 'valentina.ortiz@email.com',
    phone: '5555111122',
    birthDate: '1994-12-28',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-05-15',
    address: 'Lavalle 3344, CABA'
  },
  {
    id: '19',
    dni: '66662222',
    firstName: 'Gabriel',
    lastName: 'Flores',
    email: 'gabriel.flores@email.com',
    phone: '6666222233',
    birthDate: '1987-06-05',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-05-20',
    address: 'Esmeralda 5566, CABA'
  },
  {
    id: '20',
    dni: '77773333',
    firstName: 'Daniela',
    lastName: 'Acosta',
    email: 'daniela.acosta@email.com',
    phone: '7777333344',
    birthDate: '1989-10-19',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-05-25',
    address: 'Tucumán 7788, CABA'
  },
  {
    id: '21',
    dni: '88884444',
    firstName: 'Héctor',
    lastName: 'Medina',
    email: 'hector.medina@email.com',
    phone: '8888444455',
    birthDate: '1981-02-14',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-06-01',
    address: 'Viamonte 9900, CABA'
  },
  {
    id: '22',
    dni: '99995555',
    firstName: 'Natalia',
    lastName: 'Herrera',
    email: 'natalia.herrera@email.com',
    phone: '9999555566',
    birthDate: '1992-08-07',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-06-05',
    address: 'Sarmiento 1122, CABA'
  },
  {
    id: '23',
    dni: '11116666',
    firstName: 'Oscar',
    lastName: 'Luna',
    email: 'oscar.luna@email.com',
    phone: '1111666677',
    birthDate: '1985-04-23',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-06-10',
    address: 'Charcas 3344, CABA'
  },
  {
    id: '24',
    dni: '22227777',
    firstName: 'Rosa',
    lastName: 'Soto',
    email: 'rosa.soto@email.com',
    phone: '2222777788',
    birthDate: '1983-11-30',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-06-15',
    address: 'Ayacucho 5566, CABA'
  },
  {
    id: '25',
    dni: '33338888',
    firstName: 'Manuel',
    lastName: 'Delgado',
    email: 'manuel.delgado@email.com',
    phone: '3333888899',
    birthDate: '1991-01-17',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-06-20',
    address: 'Junín 7788, CABA'
  },
  {
    id: '26',
    dni: '44440000',
    firstName: 'Elena',
    lastName: 'Vega',
    email: 'elena.vega@email.com',
    phone: '4444000011',
    birthDate: '1988-07-09',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-06-25',
    address: 'Mansilla 9900, CABA'
  },
  {
    id: '27',
    dni: '55552222',
    firstName: 'Felipe',
    lastName: 'Cordero',
    email: 'felipe.cordero@email.com',
    phone: '5555222233',
    birthDate: '1984-05-26',
    gender: GENDER.MALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-07-01',
    address: 'Billinghurst 1122, CABA'
  },
  {
    id: '28',
    dni: '66663333',
    firstName: 'Adriana',
    lastName: 'Mendoza',
    email: 'adriana.mendoza@email.com',
    phone: '6666333344',
    birthDate: '1990-12-03',
    gender: GENDER.FEMALE,
    status: MEMBER_STATUS.ACTIVE,
    joinDate: '2023-07-05',
    address: 'Pueyrredón 3344, CABA'
  }
];

// Mock Seasons
export const mockSeasons: Season[] = [
  {
    id: '1',
    name: 'Temporada Verano 2024',
    startDate: '2023-12-01',
    endDate: '2024-03-31',
    description: 'Temporada de verano con actividades acuáticas',
  },
  {
    id: '2',
    name: 'Temporada Invierno 2024',
    startDate: '2024-06-01',
    endDate: '2024-09-30',
    description: 'Temporada de invierno con actividades indoor',
  },
  {
    id: '3',
    name: 'Temporada Primavera 2024',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    description: 'Temporada de primavera con actividades al aire libre',
  },
  {
    id: '4',
    name: 'Temporada Verano 2025',
    startDate: '2024-12-01',
    endDate: '2025-10-31',
    description: 'Temporada de verano 2025 con actividades acuáticas y pileta climatizada',
  }
];

// Mock Associations
export const mockAssociations: Association[] = [
  // Temporada Verano 2024 - Miembros asociados
  {
    id: 'assoc-1',
    memberId: '1', // Juan Pérez
    seasonId: '1', // Temporada Verano 2024
    associationDate: '2023-12-01'
  },
  {
    id: 'assoc-2', 
    memberId: '2', // María González
    seasonId: '1',
    associationDate: '2023-12-01'
  },
  {
    id: 'assoc-3',
    memberId: '3', // Carlos Rodríguez
    seasonId: '1', 
    associationDate: '2023-12-01'
  },
  
  // Temporada Invierno 2024 - Miembros asociados
  {
    id: 'assoc-4',
    memberId: '4', // Ana López
    seasonId: '2',
    associationDate: '2024-06-01'
  },
  {
    id: 'assoc-5',
    memberId: '5', // Roberto Martínez
    seasonId: '2',
    associationDate: '2024-06-01'
  },
  
  // Temporada Primavera 2024 - Miembros asociados
  {
    id: 'assoc-6',
    memberId: '6', // Laura Fernández
    seasonId: '3',
    associationDate: '2024-09-01'
  },
  {
    id: 'assoc-7',
    memberId: '7', // Diego Silva
    seasonId: '3',
    associationDate: '2024-09-01'
  },
  {
    id: 'assoc-8',
    memberId: '8', // Sofía Torres
    seasonId: '3',
    associationDate: '2024-09-01'
  },
  
  // Temporada Verano 2025 - Miembros asociados
  {
    id: 'assoc-9',
    memberId: '1', // Juan Pérez
    seasonId: '4',
    associationDate: '2024-12-01'
  },
  {
    id: 'assoc-10',
    memberId: '2', // María González
    seasonId: '4',
    associationDate: '2024-12-01'
  },
  {
    id: 'assoc-11',
    memberId: '6', // Laura Fernández
    seasonId: '4',
    associationDate: '2024-12-01'
  },
  {
    id: 'assoc-12',
    memberId: '9', // Miguel Hernández
    seasonId: '4',
    associationDate: '2024-12-01'
  }
];

// Mock Entry Logs
export const mockEntryLogs: EntryLog[] = [
  // Entradas de ayer (2024-12-30)
  {
    id: '1',
    memberId: '1',
    memberName: 'Juan Pérez',
    memberDni: '12345678',
    entryTime: '09:30',
    date: '2024-12-30'
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'María González',
    memberDni: '87654321',
    entryTime: '10:15',
    date: '2024-12-30'
  },
  {
    id: '3',
    memberId: '3',
    memberName: 'Carlos Rodríguez',
    memberDni: '11223344',
    entryTime: '08:45',
    date: '2024-12-30'
  },
  {
    id: '4',
    memberId: '4',
    memberName: 'Ana López',
    memberDni: '55667788',
    entryTime: '11:00',
    date: '2024-12-30'
  },
  {
    id: '5',
    memberId: '5',
    memberName: 'Roberto Martínez',
    memberDni: '99887766',
    entryTime: '07:30',
    date: '2024-12-30'
  },
  // Entradas de hoy (2024-12-31)
  {
    id: '6',
    memberId: '1',
    memberName: 'Juan Pérez',
    memberDni: '12345678',
    entryTime: '08:00',
    date: '2024-12-31'
  },
  {
    id: '7',
    memberId: '6',
    memberName: 'Laura Fernández',
    memberDni: '44556677',
    entryTime: '09:15',
    date: '2024-12-31'
  },
  {
    id: '8',
    memberId: '7',
    memberName: 'Diego Silva',
    memberDni: '33445566',
    entryTime: '10:30',
    date: '2024-12-31'
  },
  {
    id: '9',
    memberId: '2',
    memberName: 'María González',
    memberDni: '87654321',
    entryTime: '11:45',
    date: '2024-12-31'
  },
  {
    id: '10',
    memberId: '8',
    memberName: 'Sofía Torres',
    memberDni: '22334455',
    entryTime: '12:00',
    date: '2024-12-31'
  }
];

// Mock Daily Statistics
export const mockDailyStats: DailyStats[] = [
  // Ayer
  {
    date: '2024-12-30',
    totalEntries: 45,
    currentlyInside: 0,
    peakOccupancy: 28,
    averageStayTime: 4.2
  },
  // Hoy
  {
    date: '2024-12-31',
    totalEntries: 32,
    currentlyInside: 8,
    peakOccupancy: 25,
    averageStayTime: 3.8
  }
];

// Funciones utilitarias para trabajar con mock data
export const getMockMembers = (): Member[] => {
  return mockMembers;
};

export const getMockSeasons = (): Season[] => {
  return mockSeasons;
};

export const getMemberById = (id: string): Member | undefined => {
  return mockMembers.find(member => member.id === id);
};

export const getSeasonById = (id: string): Season | undefined => {
  return mockSeasons.find(season => season.id === id);
};

export const getAssociationsBySeasonId = (seasonId: string): Association[] => {
  return mockAssociations.filter(association => association.seasonId === seasonId);
};

export const getAssociationsByMemberId = (memberId: string): Association[] => {
  return mockAssociations.filter(association => association.memberId === memberId);
};

export const getAvailableMembersForSeason = (seasonId: string): Member[] => {
  const associatedMemberIds = mockAssociations
    .filter(association => association.seasonId === seasonId)
    .map(association => association.memberId);
  
  return mockMembers.filter(member => 
    !associatedMemberIds.includes(member.id) && 
    member.status === MEMBER_STATUS.ACTIVE
  );
};

export const getEntryLogsByDateRange = (startDate: string, endDate: string): EntryLog[] => {
  return mockEntryLogs.filter(log => log.date >= startDate && log.date <= endDate);
};

export const getDailyStatsByDateRange = (startDate: string, endDate: string): DailyStats[] => {
  return mockDailyStats.filter(stat => stat.date >= startDate && stat.date <= endDate);
};
