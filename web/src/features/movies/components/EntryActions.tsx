import { useMarkMovie, useUnmarkMovie } from "../hooks";
import { STRINGS } from "../../../lib/strings";
import styles from "./EntryActions.module.css";

interface EntryActionsProps {
  tmdbId: number;
  releaseDate: string | null;
  status: "watched" | "watchlist" | null;
}

export function EntryActions({
  tmdbId,
  releaseDate,
  status,
}: EntryActionsProps) {
  const markMovie = useMarkMovie();
  const unmarkMovie = useUnmarkMovie();

  const today = new Date().toISOString().slice(0, 10);
  const isReleased = !releaseDate || releaseDate <= today;

  return (
    <div className={styles.actions}>
      {status === null && (
        <>
          <button
            onClick={() =>
              markMovie.mutate({ tmdbId, watchStatus: "watchlist" })
            }
            disabled={markMovie.isPending}
          >
            {STRINGS.entryActions.markWatchlist}
          </button>
          {isReleased && (
            <button
              onClick={() =>
                markMovie.mutate({ tmdbId, watchStatus: "watched" })
              }
              disabled={markMovie.isPending}
            >
              {STRINGS.entryActions.markWatched}
            </button>
          )}
        </>
      )}

      {status === "watchlist" && (
        <>
          {isReleased && (
            <button
              onClick={() =>
                markMovie.mutate({ tmdbId, watchStatus: "watched" })
              }
              disabled={markMovie.isPending}
            >
              {STRINGS.entryActions.markWatched}
            </button>
          )}
          <button
            onClick={() => unmarkMovie.mutate(tmdbId)}
            disabled={unmarkMovie.isPending}
          >
            {STRINGS.entryActions.unmarkWatchlist}
          </button>
        </>
      )}

      {status === "watched" && (
        <>
          <button
            onClick={() =>
              markMovie.mutate({ tmdbId, watchStatus: "watchlist" })
            }
            disabled={markMovie.isPending}
          >
            {STRINGS.entryActions.markWatchlist}
          </button>
          <button
            onClick={() => unmarkMovie.mutate(tmdbId)}
            disabled={unmarkMovie.isPending}
          >
            {STRINGS.entryActions.unmarkWatched}
          </button>
        </>
      )}

      {(markMovie.isError || unmarkMovie.isError) && (
        <p className={styles.error}>{STRINGS.errors.genericAction}</p>
      )}
    </div>
  );
}
