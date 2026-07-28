import { apiFetch } from "../../lib/apiClient";

export interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
}

export interface UserMovieEntry {
  id: number;
  watchStatus: "watched" | "watchlist";
  dateAdded: string;
  dateWatched: string | null;
  rating: number | null;
  notes: string | null;
  movie: Movie;
}

interface PaginatedEntries {
  data: UserMovieEntry[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

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
