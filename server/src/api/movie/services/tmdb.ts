/**
 * Small TMDB API client. Centralizes URL building, fetch and JSON-parsing
 * error handling so controllers don't repeat it per-endpoint.
 */

export class TmdbRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "TmdbRequestError";
    this.status = status;
  }
}

export interface TmdbSearchResult {
  id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
}

export interface TmdbSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbSearchResult[];
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  runtime: number | null;
  genres: TmdbGenre[];
}

async function request<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(`${process.env.TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY || "");
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new TmdbRequestError(
      `TMDB responded with status ${response.status}`,
      response.status,
    );
  }
  return response.json() as Promise<T>;
}

export function searchMovies(
  query: string,
  page: number,
): Promise<TmdbSearchResponse> {
  return request<TmdbSearchResponse>("/search/movie", { query, page });
}

export function getMovieDetails(tmdbId: number): Promise<TmdbMovieDetails> {
  return request<TmdbMovieDetails>(`/movie/${tmdbId}`);
}
