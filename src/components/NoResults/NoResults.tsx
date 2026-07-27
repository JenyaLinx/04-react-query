import css from "./NoResults.module.css";

interface NoResultsProps {
  onClearSearch: () => void;
}

export default function NoResults({ onClearSearch }: NoResultsProps) {
  return (
    <section className={css.section} aria-live="polite">
      <div className={css.card}>
        <div className={css.imageWrapper}>
          <img
            className={css.image}
            src="/no-results.png"
            alt="Magnifying glass searching through a movie filmstrip"
          />
        </div>

        <div className={css.content}>
          <p className={css.label}>Nothing to watch here</p>

          <h2 className={css.title}>Oops! No movies found</h2>

          <p className={css.description}>
            Try another movie title or check the spelling.
          </p>

          <button
            className={css.button}
            type="button"
            onClick={onClearSearch}
          >
            Clear Search
          </button>
        </div>
      </div>
    </section>
  );
}