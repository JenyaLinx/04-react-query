import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div className={css.card} onClick={() => onSelect(movie)}>
            <img
              className={css.image}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
            />

            <div className={css.content}>
              <h2 className={css.title}>{movie.title}</h2>

              <p className={css.year}>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}