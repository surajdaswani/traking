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

export interface PaginatedEntries {
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

export interface SearchResult {
  tmdbId: number;
  title: string;
  year: string | null;
  releaseDate: string | null;
  posterPath: string | null;
  status: "watched" | "watchlist" | null;
}

export interface SearchResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  results: SearchResult[];
}

export interface MarkResponse {
  action: "created" | "updated" | "unchanged";
  entry: UserMovieEntry | null;
}
