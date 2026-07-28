import { useState } from "react";
import { useSearchMovies } from "../features/movies/hooks";
import { MovieCard } from "../features/movies/components/MovieCard";
import { EntryActions } from "../features/movies/components/EntryActions";
import { STRINGS } from "../lib/strings";
import styles from "./Search.module.css";

export function Search() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useSearchMovies(query, page);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <h1>{STRINGS.search.title}</h1>
      <input
        type="text"
        className={styles.searchInput}
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder={STRINGS.search.placeholder}
      />

      {isLoading && <p>{STRINGS.search.searching}</p>}
      {isError && <p>{STRINGS.errors.search}</p>}

      {data && (
        <>
          {data.results.length === 0 ? (
            <p>{STRINGS.emptyStates.search}</p>
          ) : (
            <div className={styles.grid}>
              {data.results.map((result) => (
                <div key={result.tmdbId} className={styles.entry}>
                  <MovieCard
                    movie={{
                      title: result.title,
                      posterPath: result.posterPath,
                    }}
                    status={result.status}
                  />
                  <EntryActions
                    tmdbId={result.tmdbId}
                    releaseDate={result.releaseDate}
                    status={result.status}
                  />
                </div>
              ))}
            </div>
          )}

          {data.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                {STRINGS.pagination.previous}
              </button>
              <span>
                {STRINGS.pagination.pageOf(data.page, data.totalPages)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages}
              >
                {STRINGS.pagination.next}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
