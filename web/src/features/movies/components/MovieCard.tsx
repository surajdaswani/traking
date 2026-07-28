import type { Movie } from "../api";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div>
      {movie.posterPath ? (
        <img
          src={`${TMDB_IMAGE_BASE_URL}${movie.posterPath}`}
          alt={movie.title}
          width={100}
        />
      ) : (
        <div>Sin póster</div>
      )}
      <p>{movie.title}</p>
    </div>
  );
}
