import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoClose, IoTimeOutline, IoLocationOutline } from "react-icons/io5";

import type { Movie } from "../../types/movie";
import { fetchMovieDetails } from "../../services/movieService";

import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root");

export default function MovieModal({
  movie,
  onClose,
}: MovieModalProps) {
  const {
    data: movieDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie-details", movie.id],
    queryFn: () => fetchMovieDetails(movie.id),
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdrop = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!modalRoot) {
    return null;
  }

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const rating =
    movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "N/A";

  const voteCount = movieDetails?.vote_count ?? movie.vote_count ?? 0;

  const imagePath = movie.backdrop_path || movie.poster_path;

  const runtime = movieDetails?.runtime
    ? `${Math.floor(movieDetails.runtime / 60)}h ${
        movieDetails.runtime % 60
      }m`
    : null;

  const countries =
    movieDetails?.production_countries
      .map((country) => country.name)
      .slice(0, 2)
      .join(", ") || null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdrop}
      role="presentation"
    >
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
      >
        <button
          className={css.closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
        >
          <IoClose size={24} />
        </button>

        {imagePath ? (
          <div className={css.imageWrapper}>
            <img
              className={css.image}
              src={`https://image.tmdb.org/t/p/w780${imagePath}`}
              alt={movie.title}
            />

            <div className={css.imageOverlay} />
          </div>
        ) : (
          <div className={css.imagePlaceholder}>
            No image available
          </div>
        )}

        <div className={css.content}>
          <div className={css.heading}>
            <h2
              id="movie-modal-title"
              className={css.title}
            >
              {movie.title}
            </h2>

            <div className={css.primaryBadges}>
              <span className={css.yearBadge}>
                {releaseYear}
              </span>

              <span className={css.ratingBadge}>
                <span aria-hidden="true">★</span>
                {rating}
                <small>/ 10</small>
              </span>
            </div>
          </div>

          {isLoading && (
            <div className={css.detailsLoader}>
              <span className={css.loaderDot} />
              Loading movie details...
            </div>
          )}

          {isError && (
            <p className={css.detailsError}>
              Additional movie details are unavailable.
            </p>
          )}

          {movieDetails && (
            <>
              {movieDetails.genres.length > 0 && (
                <div
                  className={css.genres}
                  aria-label="Movie genres"
                >
                  {movieDetails.genres.map((genre) => (
                    <span
                      className={css.genreBadge}
                      key={genre.id}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className={css.meta}>
                {runtime && (
                  <div className={css.metaItem}>
                    <IoTimeOutline aria-hidden="true" />
                    <span>{runtime}</span>
                  </div>
                )}

                {countries && (
                  <div className={css.metaItem}>
                    <IoLocationOutline aria-hidden="true" />
                    <span>{countries}</span>
                  </div>
                )}

                {voteCount > 0 && (
                  <div className={css.metaItem}>
                    <span aria-hidden="true">★</span>
                    <span>
                      {voteCount.toLocaleString("en-GB")} ratings
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className={css.divider} />

          <div>
            <p className={css.overviewLabel}>Overview</p>

            <p className={css.overview}>
              {movie.overview ||
                "No description is available for this movie."}
            </p>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
}