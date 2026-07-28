import { useQuery } from "@tanstack/react-query";
import {
  getWatchedEntries,
  getWatchlistEntries,
  getCalendarEntries,
} from "./api";

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
