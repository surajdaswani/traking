export const STRINGS = {
  app: {
    name: "traking",
  },
  nav: {
    home: "Inicio",
    search: "Buscar",
    logout: "Cerrar sesión",
    themeToLight: "Modo claro",
    themeToDark: "Modo oscuro",
  },
  auth: {
    loginButton: "Iniciar sesión con Google",
    verifyingSession: "Verificando sesión...",
  },
  home: {
    sectionWatched: "Historia",
    sectionWatchlist: "Watchlist",
    sectionCalendar: "Calendario",
    viewAll: "Ver todo →",
  },
  emptyStates: {
    watched: "Todavía no has marcado ninguna película como vista.",
    watchlist: "No tienes ninguna película en tu watchlist.",
    calendar: "No tienes próximos estrenos en tu lista.",
    search: "No se encontraron resultados para tu búsqueda.",
  },
  entryActions: {
    markWatched: "Marcar como vista",
    markWatchlist: "Enviar a watchlist",
    unmarkWatchlist: "Quitar de watchlist",
    unmarkWatched: "Quitar de vistas",
  },
  movieCard: {
    noPoster: "Sin póster",
    statusWatched: "Vista",
    statusWatchlist: "Watchlist",
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
