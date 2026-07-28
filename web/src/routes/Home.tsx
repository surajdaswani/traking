import { Link } from "react-router";
import {
  useWatchedEntries,
  useWatchlistEntries,
  useCalendarEntries,
} from "../features/movies/hooks";
import type { UserMovieEntry } from "../features/movies/types";
import { MovieCard } from "../features/movies/components/MovieCard";
import { EntryActions } from "../features/movies/components/EntryActions";
import { Collapsible } from "../components/Collapsible/Collapsible";
import { STRINGS } from "../lib/strings";

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
    return <div>{STRINGS.loading.generic}</div>;
  }

  if (isError) {
    return <div>{STRINGS.errors.loadingData}</div>;
  }

  if (entries.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id}>
          <MovieCard movie={entry.movie} />
          <EntryActions
            tmdbId={entry.movie.tmdbId}
            releaseDate={entry.movie.releaseDate}
            status={entry.watchStatus}
          />
        </div>
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
      <h1>{STRINGS.app.name}</h1>

      <Collapsible title={STRINGS.home.sectionWatched}>
        <EntryList
          isLoading={watched.isLoading}
          isError={watched.isError}
          entries={watched.data?.data ?? []}
          emptyMessage={STRINGS.emptyStates.watched}
        />
        <Link to="/lists/watched">{STRINGS.home.viewAll}</Link>
      </Collapsible>

      <Collapsible title={STRINGS.home.sectionWatchlist}>
        <EntryList
          isLoading={watchlist.isLoading}
          isError={watchlist.isError}
          entries={watchlist.data?.data ?? []}
          emptyMessage={STRINGS.emptyStates.watchlist}
        />
        <Link to="/lists/watchlist">{STRINGS.home.viewAll}</Link>
      </Collapsible>

      <Collapsible title={STRINGS.home.sectionCalendar}>
        <EntryList
          isLoading={calendar.isLoading}
          isError={calendar.isError}
          entries={calendar.data?.data ?? []}
          emptyMessage={STRINGS.emptyStates.calendar}
        />
        <Link to="/lists/calendar">{STRINGS.home.viewAll}</Link>
      </Collapsible>
    </div>
  );
}
