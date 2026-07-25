import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map((movie) => {
        const releaseYear = movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "Unknown";

        return (
          <li className={css.item} key={movie.id}>
            <button
              className={css.card}
              type="button"
              onClick={() => onSelect(movie)}
              aria-label={`Open details for ${movie.title}`}
            >
              <div className={css.imageWrapper}>
                <img
                  className={css.image}
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />

                <div className={css.overlay}>
                  <span className={css.detailsLabel}>View details</span>
                </div>
              </div>

              <div className={css.content}>
                <h2 className={css.title}>{movie.title}</h2>

                <p className={css.year}>{releaseYear}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}