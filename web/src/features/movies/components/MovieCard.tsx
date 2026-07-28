import type { Movie } from "../types";
import { STRINGS } from "../../../lib/strings";
import styles from "./MovieCard.module.css";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

interface MovieCardProps {
  movie: Pick<Movie, "title" | "posterPath">;
  status?: "watched" | "watchlist" | null;
}

export function MovieCard({ movie, status }: MovieCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.poster}>
        {movie.posterPath ? (
          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
            alt={movie.title}
          />
        ) : (
          <div className={styles.noPoster}>{STRINGS.movieCard.noPoster}</div>
        )}
      </div>
      {status && (
        <span
          className={`${styles.status} ${
            status === "watched" ? styles.statusWatched : styles.statusWatchlist
          }`}
        >
          {status === "watched"
            ? STRINGS.movieCard.statusWatched
            : STRINGS.movieCard.statusWatchlist}
        </span>
      )}
      <p className={styles.title}>{movie.title}</p>
    </div>
  );
}
