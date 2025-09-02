// Constantes centralizadas para el sistema de gestión del club

// Géneros
export const GENDER = {
  MALE: 'M',
  FEMALE: 'F'
} as const;

// Estados de socios
export const MEMBER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  MIN_PAGE_SIZE: 5,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
} as const;

// Configuración de búsqueda
export const SEARCH = {
  DEBOUNCE_DELAY: 3000, // milisegundos
  MIN_SEARCH_LENGTH: 2
} as const;

// Límites de validación
export const VALIDATION = {
  DNI: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 8,
    REGEX: /^\d{8}$/
  },
  EMAIL: {
    MAX_LENGTH: 100,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const;

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  SERVER_ERROR: 'Error interno del servidor. Intente nuevamente.',
  TIMEOUT: 'La operación ha tardado demasiado. Intente nuevamente.',
  DUPLICATE_DNI: 'Ya existe un socio con este DNI.',
  DUPLICATE_EMAIL: 'Ya existe un socio con este email.',
  INVALID_DATE_RANGE: 'La fecha de inicio debe ser anterior a la fecha de fin.',
  SEASON_FULL: 'La temporada ha alcanzado el máximo de socios permitidos.',
  INVALID_DNI: 'El DNI debe tener exactamente 8 dígitos numéricos.',
  INVALID_EMAIL: 'El formato del email no es válido.',
  INVALID_BIRTH_DATE: 'La fecha de nacimiento no puede ser posterior a hoy.',
  INVALID_SEASON_NAME: 'El nombre de la temporada es requerido.',
  INVALID_START_DATE: 'La fecha de inicio es requerida.',
  INVALID_END_DATE: 'La fecha de fin es requerida.',
  INVALID_DATE_ORDER: 'La fecha de fin debe ser posterior a la fecha de inicio.',
  INVALID_DESCRIPTION_LENGTH: 'La descripción no puede tener más de 100 caracteres.',
  REQUIRED_FIELD: 'Este campo es obligatorio.'
} as const;

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  MEMBER_DELETED: 'Socio eliminado exitosamente.',
  ASSOCIATION_CREATED: 'Socio agregado a la temporada.',
  ASSOCIATION_DELETED: 'Socio removido de la temporada.'
} as const;
// Mensajes informativos para asociaciones
export const ASSOCIATION_MESSAGES = {
  SEASON_ENDED_WARNING: 'Esta temporada ya ha finalizado. No se pueden agregar nuevos socios a temporadas finalizadas. Solo puedes ver la lista de socios que participaron.',
  SEASON_FUTURE_INFO: 'Esta temporada comenzará el',
  SEASON_FUTURE_INFO_SUFFIX: '. Puedes agregar y eliminar socios antes de que comience.',
  SEASON_ENDED_INFO: 'Esta temporada finalizó el',
  SEASON_ENDED_INFO_SUFFIX: '. No se pueden agregar ni eliminar socios de temporadas finalizadas.',


  // Placeholders y mensajes UI
  SEARCH_AVAILABLE_MEMBERS: 'Buscar socios disponibles...',
  SEARCH_ASSOCIATED_MEMBERS: 'Buscar socios asociados por nombre, DNI o email...',
  LOADING_MEMBERS: 'Cargando socios...',
  NO_MEMBERS_FOUND: 'No se encontraron socios disponibles',
  NO_MEMBERS_AVAILABLE: 'No hay socios disponibles para agregar',
  NO_ASSOCIATED_MEMBERS_FOUND: 'No se encontraron socios asociados',
  NO_ASSOCIATED_MEMBERS: 'No hay socios asociados a esta temporada',

  // Estados de temporada
  SEASON_STATUS_ENDED: 'Finalizada',
  SEASON_STATUS_FUTURE: 'Futura',
  SEASON_STATUS_ACTIVE: 'Temporada Activa',

  // Acciones
  ADD_MEMBERS: 'Agregar Socios',
  ADD_MEMBERS_TO_SEASON: 'Agregar Socios a',
  SEARCH_AND_SELECT_MEMBERS: 'Busca y selecciona los socios que deseas agregar a esta temporada',

  // Diálogo de eliminación
  DELETE_MEMBER_FROM_SEASON_TITLE: '¿Eliminar socio de la temporada?',
  DELETE_MEMBER_FROM_SEASON_DESC: 'Esta acción no se puede deshacer. Se eliminará permanentemente al socio',
  DELETE_MEMBER_FROM_SEASON_SUFFIX: 'de esta temporada.',
  DELETE_MEMBER: 'Eliminar',
  CANCEL: 'Cancelar',
  DELETE_DISABLED: 'Eliminar (deshabilitado)',

  // Errores específicos de asociaciones
  ERROR_ADD_MEMBER_TO_SEASON: 'Error al agregar socio a la temporada',
  ERROR_CANNOT_REMOVE_FROM_ENDED_SEASON: 'No se pueden eliminar socios de temporadas finalizadas',
} as const;

