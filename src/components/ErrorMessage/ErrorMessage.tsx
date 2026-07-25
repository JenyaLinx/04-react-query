import css from "./ErrorMessage.module.css";

export default function ErrorMessage() {
  return (
    <div className={css.error}>
      <div className={css.icon}>!</div>

      <div>
        <h3>Something went wrong</h3>

        <p>
          We couldn't load the movies.
          <br />
          Please try again in a moment.
        </p>
      </div>
    </div>
  );
}