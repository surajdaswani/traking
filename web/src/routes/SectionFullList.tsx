import { useParams, useSearchParams, useNavigate } from "react-router";
import {
  useWatchedEntries,
  useWatchlistEntries,
  useCalendarEntries,
} from "../features/movies/hooks";
import { MovieCard } from "../features/movies/components/MovieCard";

const SECTION_TITLES: Record<string, string> = {
  watched: "Historia",
  watchlist: "Empezar a ver",
  calendar: "Calendario",
};

export function SectionFullList() {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = Number(searchParams.get("page")) || 1;

  const watched = useWatchedEntries(page);
  const watchlist = useWatchlistEntries(page);
  const calendar = useCalendarEntries(page);

  const queries = { watched, watchlist, calendar };
  const currentQuery = queries[type as keyof typeof queries];

  if (!currentQuery) {
    return <div>Sección no encontrada.</div>;
  }

  const title = SECTION_TITLES[type as string];
  const pagination = currentQuery.data?.meta.pagination;

  const goToPage = (newPage: number) => {
    navigate(`/lists/${type}?page=${newPage}`);
  };

  return (
    <div>
      <h1>{title}</h1>
      {currentQuery.isLoading && <p>Cargando...</p>}
      {currentQuery.isError && <p>Ha ocurrido un error.</p>}
      {currentQuery.data && (
        <>
          <div>
            {currentQuery.data.data.map((entry) => (
              <MovieCard key={entry.id} movie={entry.movie} />
            ))}
          </div>

          {pagination && (
            <div>
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                Anterior
              </button>
              <span>
                Página {pagination.page} de {pagination.pageCount}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= pagination.pageCount}
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
