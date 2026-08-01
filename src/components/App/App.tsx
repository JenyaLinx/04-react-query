import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import type { Movie } from "../../types/movie";
import {
  fetchMovies,
  fetchTrendingMovies,
} from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import NoResults from "../NoResults/NoResults";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data: searchData,
    isError: isSearchError,
    isFetching: isSearchFetching,
  } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const {
    data: trendingData,
    isError: isTrendingError,
    isFetching: isTrendingFetching,
  } = useQuery({
    queryKey: ["trending-movies", "day"],
    queryFn: fetchTrendingMovies,
    staleTime: 15 * 60 * 1000,
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleClearSearch = () => {
    setQuery("");
    setPage(1);
    setSelectedMovie(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePageChange = ({
    selected,
  }: {
    selected: number;
  }) => {
    setPage(selected + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isSearchMode = query !== "";

  const movies = isSearchMode
    ? searchData?.results ?? []
    : trendingData?.results ?? [];

  const totalPages = Math.min(searchData?.total_pages ?? 0, 500);
  const totalResults = searchData?.total_results ?? 0;

  const movieLabel = totalResults === 1 ? "movie" : "movies";

  const isLoading = isSearchMode
    ? isSearchFetching
    : isTrendingFetching;

  const isError = isSearchMode
    ? isSearchError
    : isTrendingError;

  const showNoResults =
    isSearchMode &&
    !isSearchFetching &&
    !isSearchError &&
    searchData !== undefined &&
    movies.length === 0;

  return (
    <div className={css.app}>
      <header className={css.header}>
        <div className={css.headerContainer}>
          <a
            className={css.logo}
            href="/"
            aria-label="FilmFinder home"
          >
            <span className={css.logoIcon} aria-hidden="true">
              F
            </span>

            <span className={css.logoText}>
              Film<span>Finder</span>
            </span>
          </a>

          <div className={css.headerInfo}>
            <span className={css.headerLabel}>
              Discover your next movie
            </span>

            <a
              className={css.tmdbLink}
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
            >
              Powered by <span>TMDB</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className={css.hero}>
          <div className={css.heroGlow} />

          <div className={css.heroContainer}>
            <p className={css.eyebrow}>
              Explore the world of cinema
            </p>

            <h1 className={css.title}>
              Find a movie for
              <span> every mood</span>
            </h1>

            <p className={css.description}>
              Search thousands of movies and discover something worth
              watching.
            </p>

            <div className={css.searchWrapper}>
              <SearchBar onSubmit={handleSearch} />
            </div>
          </div>
        </section>

        <section className={css.content}>
          <div className={css.contentContainer}>
            {!isSearchMode && movies.length > 0 && !isError && (
              <div className={css.resultsHeader}>
                <div>
                  <p className={css.resultsLabel}>
                    Discover now
                  </p>

                  <h2 className={css.resultsTitle}>
                    🔥 Trending Today
                  </h2>
                </div>
              </div>
            )}

            {isSearchMode && movies.length > 0 && !isError && (
              <div className={css.resultsHeader}>
                <div>
                  <p className={css.resultsLabel}>
                    Search results
                  </p>

                  <h2 className={css.resultsTitle}>
                    {totalResults.toLocaleString("en-GB")}{" "}
                    {movieLabel} found for “{query}”
                  </h2>
                </div>

                <span className={css.pageIndicator}>
                  Page {page} of {totalPages}
                </span>
              </div>
            )}

            {isLoading && movies.length === 0 && <Loader />}

            {isError && <ErrorMessage />}

            {showNoResults && (
              <NoResults onClearSearch={handleClearSearch} />
            )}

            {movies.length > 0 && !isError && (
              <>
                <MovieGrid
                  movies={movies}
                  onSelect={setSelectedMovie}
                />

                {isSearchMode && totalPages > 1 && (
                  <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    pageClassName={css.pageItem}
                    pageLinkClassName={css.pageLink}
                    previousClassName={css.navigationItem}
                    nextClassName={css.navigationItem}
                    previousLinkClassName={css.navigationLink}
                    nextLinkClassName={css.navigationLink}
                    activeClassName={css.active}
                    disabledClassName={css.disabled}
                    breakClassName={css.breakItem}
                    nextLabel="→"
                    previousLabel="←"
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className={css.footer}>
        <div className={css.footerContainer}>
          <p>© 2026 FilmFinder</p>

          <p className={css.tmdbText}>
            This product uses the TMDB API but is not endorsed or
            certified by TMDB.
          </p>

          <a
            className={css.footerTmdb}
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            Powered by <span>TMDB</span>
          </a>
        </div>
      </footer>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}