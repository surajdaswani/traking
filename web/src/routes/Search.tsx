import { useState } from "react";
import { useSearchMovies } from "../features/movies/hooks";
import { MovieCard } from "../features/movies/components/MovieCard";

export function Search() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useSearchMovies(query, page);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div>
      <h1>Buscar</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        placeholder="Busca una película..."
      />

      {isLoading && <p>Buscando...</p>}
      {isError && <p>Ha ocurrido un error en la búsqueda.</p>}

      {data && (
        <>
          <div>
            {data.results.map((result) => (
              <MovieCard
                key={result.tmdbId}
                movie={{ title: result.title, posterPath: result.posterPath }}
                status={result.status}
              />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <span>
                Página {data.page} de {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
