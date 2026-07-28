import { useQuery } from "@tanstack/react-query";
import {
  getWatchedEntries,
  getWatchlistEntries,
  getCalendarEntries,
  searchMovies,
} from "./api";
import { useDebouncedValue } from "../../lib/useDebouncedValue";

export function useWatchedEntries(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["user-movie-entries", "watched", page, pageSize],
    queryFn: () => getWatchedEntries(page, pageSize),
  });
}

export function useWatchlistEntries(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["user-movie-entries", "watchlist", page, pageSize],
    queryFn: () => getWatchlistEntries(page, pageSize),
  });
}

export function useCalendarEntries(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["user-movie-entries", "calendar", page, pageSize],
    queryFn: () => getCalendarEntries(page, pageSize),
  });
}

export function useSearchMovies(query: string, page = 1) {
  const debouncedQuery = useDebouncedValue(query, 400);

  return useQuery({
    queryKey: ["movies-search", debouncedQuery, page],
    queryFn: () => searchMovies(debouncedQuery, page),
    enabled: debouncedQuery.trim().length > 0,
  });
}
