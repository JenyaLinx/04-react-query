import { createPortal } from "react-dom";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";


import type { Movie } from "../../types/movie";

import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root");

export default function MovieModal({ movie, onClose }: MovieModalProps) {
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

  const handleBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
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

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "Not rated";

  const imagePath = movie.backdrop_path || movie.poster_path;

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

        {imagePath && (
          <img
            className={css.image}
            src={`https://image.tmdb.org/t/p/w780${imagePath}`}
            alt={movie.title}
          />
        )}

        <div className={css.content}>
          <h2 id="movie-modal-title" className={css.title}>
            {movie.title}
          </h2>

          <div className={css.details}>
            <span>{releaseYear}</span>
            <span aria-hidden="true">•</span>
            <span>★ {rating}</span>
          </div>

          <p className={css.overview}>
            {movie.overview || "No description is available for this movie."}
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}