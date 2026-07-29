export interface Movie {
  id: number;
  title: string;
  overview: string;

  poster_path: string | null;
  backdrop_path: string | null;

  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface MovieDetails extends Movie {
  runtime: number | null;
  genres: Genre[];
  production_countries: ProductionCountry[];
  original_language: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}