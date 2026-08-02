import { useState } from "react";

import type { Movie } from "../../types/movie";

import css from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

interface MoviePosterProps {
  movie: Movie;
}

function MoviePoster({ movie }: MoviePosterProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const hasPoster = Boolean(movie.poster_path) && !hasImageError;

  if (!hasPoster) {
    return (
      <div className={css.fallback}>
        <div className={css.fallbackIcon} aria-hidden="true">
          🎬
        </div>

        <p className={css.fallbackTitle}>Poster unavailable</p>

        <span className={css.fallbackMovieTitle}>{movie.title}</span>
      </div>
    );
  }

  return (
    <img
      className={css.image}
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={`${movie.title} poster`}
      loading="lazy"
      onError={() => setHasImageError(true)}
    />
  );
}

export default function MovieGrid({
  movies,
  onSelect,
}: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map((movie) => {
        const releaseYear = movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : "Unknown";

        const rating =
          movie.vote_average > 0
            ? movie.vote_average.toFixed(1)
            : null;

        return (
          <li className={css.item} key={movie.id}>
            <button
              className={css.card}
              type="button"
              onClick={() => onSelect(movie)}
              aria-label={`Open details for ${movie.title}`}
            >
              <div className={css.imageWrapper}>
                <MoviePoster movie={movie} />

                {rating && (
                  <div
                    className={css.ratingBadge}
                    aria-label={`Rating ${rating} out of 10`}
                  >
                    <span className={css.ratingStar} aria-hidden="true">
                      ★
                    </span>

                    <span>{rating}</span>

                    <small>/10</small>
                  </div>
                )}

                
              </div>

              <div className={css.content}>
                <h2 className={css.title}>{movie.title}</h2>

                <span className={css.yearBadge}>
                  {releaseYear}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}