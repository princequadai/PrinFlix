import { useState, useEffect, useCallback } from "react";
import MovieCard from ".//MovieCard";
import MovieModal from ".//MovieModal";
import "./App.css";

const API_KEY = "e95418b7";
const BASE_URL = "https://www.omdbapi.com/";
const DEFAULT_QUERY = "marvel";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchMovies = useCallback(async (searchTerm) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`);
      const data = await res.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No results found.");
      }
    } catch {
      setError("Network error. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(DEFAULT_QUERY);
  }, [fetchMovies]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetchMovies(query.trim());
  };

  const handleCardClick = async (imdbID) => {
    setModalLoading(true);
    setSelectedMovie({ loading: true });
    try {
      const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
      const data = await res.json();
      setSelectedMovie(data);
    } catch {
      setSelectedMovie(null);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => setSelectedMovie(null);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            {/* <span className="logo-icon">▶</span> */}
            <span className="logo-text">IMDB</span>
          </div>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <span className="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <input
                className="search-input"
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="search-btn" type="submit">Search</button>
            </div>
          </form>
        </div>
      </header>

      <main className="main-content">
        {loading && (
          <div className="loader-container">
            <div className="spinner"/>
            <p className="loader-text">Fetching movies…</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-state">
            <span className="error-icon">⚠</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} onClick={handleCardClick} />
            ))}
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          loading={modalLoading}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
