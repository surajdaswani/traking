# CLAUDE.md

Este archivo se lee automáticamente al iniciar una sesión de Claude Code en este repositorio. Resume el contexto esencial del proyecto para no tener que repetirlo en cada sesión.

## Qué es este proyecto

**traking** — tracker cultural personal, módulo Películas (MVP). Monorepo con dos proyectos independientes:

```
traking/
├── server/     ← Strapi v5.50.1 (SQLite)
└── web/        ← React + Vite + TypeScript
```

## Reparto de responsabilidades con la IA

- **`server/` (backend):** ayuda activa — content-types, controllers, lógica, integración TMDB, auth.
- **`web/` (frontend):** aprendizaje propio del usuario — orientación mínima, el código lo escribe el usuario. Excepción: `lib/auth.ts` y `lib/apiClient.ts` fueron escritos directamente por la IA (código no específico de React).

## Stack

**Backend:** Strapi v5.50.1, SQLite, TypeScript, TMDB API como fuente de metadatos.
**Frontend:** React + Vite + TypeScript, CSS Modules (sin aplicar aún), React Router v8, TanStack Query, Radix UI (primitives), arquitectura de carpetas feature-based.

## Modelo de datos

- `Movie`: `tmdbId` (único), `title`, `posterPath`, `releaseDate`, `runtime`, `genres` (array de strings). Se crea solo al marcar watched/watchlist, nunca al buscar.
- `UserMovieEntry`: relación a `Movie` y a `User` (campo real: **`users_permissions_user`**, no `user`), `watchStatus` (`watched`/`watchlist`), `dateAdded`, `dateWatched`, `rating` (0–5, pasos de 0.5), `notes`.

## ⚠️ Bug de plataforma crítico (Strapi 5.50.1)

La relación `users_permissions_user` (hacia `plugin::users-permissions.user`) falla de forma inconsistente con `entityService` y `documents()`, tanto en lectura como escritura (errores tipo `Invalid key`, `Undefined attribute level operator`).

**Regla obligatoria:** usar `strapi.db.query(...)` para cualquier operación (lectura o escritura) que involucre esa relación. Para relaciones entre content-types propios (ej. `movie`), `documents()` funciona bien sin problemas.

## Endpoints del backend (todos bajo `/api`)

- `GET /connect/google` → inicia OAuth Google
- `GET /auth/google/callback?access_token=...` → devuelve `{ jwt, refreshToken, user }`
- `POST /auth/refresh` → `{ refreshToken }` en body → devuelve `{ jwt, refreshToken }` (rotan ambos)
- `GET /movies/search?query=...&page=...` → búsqueda TMDB con distintivo `status` (watched/watchlist/null)
- `POST /movies/mark` → `{ tmdbId, watchStatus }` → crea/actualiza/unchanged (nunca borra)
- `DELETE /movies/:tmdbId/entry` → elimina el tracking
- `GET /user-movie-entries?filters[watchStatus]=...&sort=...&pagination[page]=...` → Home/"ver todo" (controller custom `find`, fuerza filtro por usuario autenticado)

## Reglas de negocio clave

- `watchlist ↔ watched`: transición directa en ambos sentidos, sin necesidad de desmarcar antes.
- Desmarcar (`DELETE`) elimina la entrada por completo, desde cualquier estado.
- Marcar el mismo estado dos veces = no-op (`action: "unchanged"`), nunca error, nunca borra.
- **No se puede marcar `watched` una película con `releaseDate` futura** (ni crear directamente ni transicionar desde `watchlist`). Si `releaseDate` es nula/TBA, no se bloquea. Replicado también en frontend (`EntryActions`) por UX, aunque el backend es quien garantiza la regla de verdad.

## Sesión en frontend

JWT (10 min) + refresh token en `localStorage` (`traking_jwt`, `traking_refresh_token`). Interceptor centralizado en `lib/apiClient.ts`: ante 401, refresca automáticamente y reintenta una vez; refresh compartido entre peticiones concurrentes (el refresh token rota en cada uso). `httpOnly: false` en `config/plugins.ts` del backend, decisión consciente para el MVP — migración a BFF con cookie httpOnly planeada como evolución futura, no bloqueante.

## Estructura de carpetas frontend (`web/src/`)

```
routes/           → páginas (Login, Home, Search, SectionFullList, AuthCallback)
features/movies/  → api.ts, hooks.ts, types.ts, components/ (MovieCard, EntryActions)
components/       → genéricos (Collapsible, ProtectedRoute)
lib/              → apiClient.ts, auth.ts, queryClient.ts, strings.ts, useDebouncedValue.ts
```

Textos de UI centralizados en `lib/strings.ts` (decisión: no usar i18n, un único idioma previsto).

## Estado actual

**MVP completo** — backend y frontend funcionales de punta a punta (auth, búsqueda, mark/unmark, Home, "ver todo", estados de carga/error). Sin diseño visual aplicado todavía (CSS Modules pendiente, sin definición previa).

## Pendientes conocidos

- Backend: renombrar `users_permissions_user` → `user` (legibilidad); revisar si `releaseDate` nula debería bloquear `watched`; discrepancia ocasional de `releaseDate` entre `/search/movie` y `/movie/{id}` de TMDB para películas aún no marcadas.
- Frontend: diseño visual con CSS Modules; posible optimización de `SectionFullList` (llama a los 3 hooks siempre, por regla de hooks); posible refactor de `EntryActions` para que `isPending`/`isError` no se compartan entre todos los elementos de una lista.
- Fuera de alcance del MVP: series, sync con calendario externo, app móvil, descubrimiento general de TMDB.

## Documentación completa

Todas las decisiones, alternativas descartadas, y código de cada paso están documentadas en Obsidian (repo de notas separado), con el formato `YYYYMMDD.N - traking - Módulo Pelis - [Tema]`. Consultar esas notas para el detalle completo de cualquier decisión mencionada aquí de forma resumida.
