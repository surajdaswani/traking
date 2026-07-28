import {
  useWatchedEntries,
  useWatchlistEntries,
  useCalendarEntries,
} from "../features/movies/hooks";
import type { UserMovieEntry } from "../features/movies/api";
import { MovieCard } from "../features/movies/components/MovieCard";
import { Collapsible } from "../components/Collapsible/Collapsible";

function EntryList({
  isLoading,
  isError,
  entries,
  emptyMessage,
}: {
  isLoading: boolean;
  isError: boolean;
  entries: UserMovieEntry[];
  emptyMessage: string;
}) {
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Ha ocurrido un error al cargar los datos.</div>;
  }

  if (entries.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <MovieCard key={entry.id} movie={entry.movie} />
      ))}
    </div>
  );
}

export function Home() {
  const watched = useWatchedEntries();
  const watchlist = useWatchlistEntries();
  const calendar = useCalendarEntries();

  return (
    <div>
      <h1>traking</h1>

      <Collapsible title="Historia">
        <EntryList
          isLoading={watched.isLoading}
          isError={watched.isError}
          entries={watched.data?.data ?? []}
          emptyMessage="Todavía no has marcado ninguna película como vista."
        />
      </Collapsible>

      <Collapsible title="Empezar a ver">
        <EntryList
          isLoading={watchlist.isLoading}
          isError={watchlist.isError}
          entries={watchlist.data?.data ?? []}
          emptyMessage="No tienes ninguna película en tu lista de pendientes."
        />
      </Collapsible>

      <Collapsible title="Calendario">
        <EntryList
          isLoading={calendar.isLoading}
          isError={calendar.isError}
          entries={calendar.data?.data ?? []}
          emptyMessage="No tienes próximos estrenos en tu lista."
        />
      </Collapsible>
    </div>
  );
}
