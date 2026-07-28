import { apiFetch } from "../../lib/apiClient";
import type { PaginatedEntries, SearchResponse, MarkResponse } from "./types";

export function getWatchedEntries(page = 1, pageSize = 10) {
  return apiFetch<PaginatedEntries>(
    `/api/user-movie-entries?filters[watchStatus]=watched&sort=dateWatched:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
  );
}

export function getWatchlistEntries(page = 1, pageSize = 10) {
  return apiFetch<PaginatedEntries>(
    `/api/user-movie-entries?filters[watchStatus]=watchlist&sort=dateAdded:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
  );
}

export function getCalendarEntries(page = 1, pageSize = 10) {
  const today = new Date().toISOString().slice(0, 10);
  return apiFetch<PaginatedEntries>(
    `/api/user-movie-entries?filters[watchStatus]=watchlist&filters[movie][releaseDate][$gt]=${today}&sort=movie.releaseDate:asc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
  );
}

export function searchMovies(query: string, page = 1) {
  return apiFetch<SearchResponse>(
    `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`,
  );
}

export function markMovie(
  tmdbId: number,
  watchStatus: "watched" | "watchlist",
) {
  return apiFetch<MarkResponse>("/api/movies/mark", {
    method: "POST",
    body: JSON.stringify({ tmdbId, watchStatus }),
  });
}

export function unmarkMovie(tmdbId: number) {
  return apiFetch<{ action: "deleted" }>(`/api/movies/${tmdbId}/entry`, {
    method: "DELETE",
  });
}
