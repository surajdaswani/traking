import { useParams, useSearchParams, useNavigate } from "react-router";
import {
  useWatchedEntries,
  useWatchlistEntries,
  useCalendarEntries,
} from "../features/movies/hooks";
import { MovieCard } from "../features/movies/components/MovieCard";
import { EntryActions } from "../features/movies/components/EntryActions";
import { STRINGS } from "../lib/strings";

const SECTION_TITLES: Record<string, string> = {
  watched: STRINGS.home.sectionWatched,
  watchlist: STRINGS.home.sectionWatchlist,
  calendar: STRINGS.home.sectionCalendar,
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
    return <div>{STRINGS.notFound.section}</div>;
  }

  const title = SECTION_TITLES[type as string];
  const pagination = currentQuery.data?.meta.pagination;

  const goToPage = (newPage: number) => {
    navigate(`/lists/${type}?page=${newPage}`);
  };

  return (
    <div>
      <h1>{title}</h1>
      {currentQuery.isLoading && <p>{STRINGS.loading.generic}</p>}
      {currentQuery.isError && <p>{STRINGS.errors.loadingData}</p>}
      {currentQuery.data && (
        <>
          <div>
            {currentQuery.data.data.map((entry) => (
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

          {pagination && (
            <div>
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                {STRINGS.pagination.previous}
              </button>
              <span>
                {STRINGS.pagination.pageOf(
                  pagination.page,
                  pagination.pageCount,
                )}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= pagination.pageCount}
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
