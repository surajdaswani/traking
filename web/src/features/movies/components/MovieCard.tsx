import type { Movie } from "../types";
import { STRINGS } from "../../../lib/strings";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

interface MovieCardProps {
  movie: Pick<Movie, "title" | "posterPath">;
  status?: "watched" | "watchlist" | null;
}

export function MovieCard({ movie, status }: MovieCardProps) {
  return (
    <div>
      {movie.posterPath ? (
        <img
          src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
          alt={movie.title}
          width={100}
        />
      ) : (
        <div>{STRINGS.movieCard.noPoster}</div>
      )}
      <p>{movie.title}</p>
      {status && (
        <span>
          {status === "watched"
            ? STRINGS.movieCard.statusWatched
            : STRINGS.movieCard.statusWatchlist}
        </span>
      )}
    </div>
  );
}
