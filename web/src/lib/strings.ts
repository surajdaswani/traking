export const STRINGS = {
  app: {
    name: "traking",
  },
  auth: {
    loginButton: "Iniciar sesión con Google",
    verifyingSession: "Verificando sesión...",
  },
  home: {
    sectionWatched: "Historia",
    sectionWatchlist: "Empezar a ver",
    sectionCalendar: "Calendario",
    viewAll: "Ver todo →",
  },
  emptyStates: {
    watched: "Todavía no has marcado ninguna película como vista.",
    watchlist: "No tienes ninguna película en tu lista de pendientes.",
    calendar: "No tienes próximos estrenos en tu lista.",
  },
  entryActions: {
    markWatched: "Marcar como vista",
    markWatchlist: "Marcar como pendiente",
    unmarkWatchlist: "Quitar de pendientes",
    unmarkWatched: "Quitar de vistas",
  },
  movieCard: {
    noPoster: "Sin póster",
    statusWatched: "Vista",
    statusWatchlist: "Pendiente",
  },
  search: {
    title: "Buscar",
    placeholder: "Busca una película...",
    searching: "Buscando...",
  },
  pagination: {
    previous: "Anterior",
    next: "Siguiente",
    pageOf: (page: number, total: number) => `Página ${page} de ${total}`,
  },
  errors: {
    genericAction: "No se pudo completar la acción.",
    loadingData: "Ha ocurrido un error al cargar los datos.",
    search: "Ha ocurrido un error en la búsqueda.",
  },
  loading: {
    generic: "Cargando...",
  },
  notFound: {
    section: "Sección no encontrada.",
  },
} as const;
