import { useState } from "react";

import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
}

const MIN_QUERY_LENGTH = 3;

export default function SearchBar({
  value,
  onChange,
  onSubmit,
}: SearchBarProps) {
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = value.trim();

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setError(
        `Please enter at least ${MIN_QUERY_LENGTH} characters.`
      );
      return;
    }

    setError("");
    onSubmit(trimmedQuery);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;

    onChange(newValue);

    if (error && newValue.trim().length >= MIN_QUERY_LENGTH) {
      setError("");
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${
            error ? styles.inputError : ""
          }`}
          type="search"
          name="query"
          value={value}
          onChange={handleChange}
          placeholder="Search movies..."
          autoComplete="off"
          aria-label="Search movies"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "search-error" : undefined}
        />

        {error && (
          <p
            className={styles.error}
            id="search-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  );
}