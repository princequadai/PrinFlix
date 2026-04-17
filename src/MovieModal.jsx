import { useEffect } from "react";
import MovieCard from "./MovieCard";

const PLACEHOLDER = "https://placehold.co/300x445/1e2433/94a3b8?text=No+Poster";

export default function MovieModal({ movie, loading, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const poster = !movie.Poster || movie.Poster === "N/A" ? PLACEHOLDER : movie.Poster;

  const getRatingSource = (ratings = [], source) =>
    ratings.find((r) => r.Source === source)?.Value || "N/A";

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-glass">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {loading ? (
          <div className="modal-loader">
            <div className="spinner"/>
            <p>Loading details…</p>
          </div>
        ) : (
          <div className="modal-body">
            <div className="modal-left">
              <img
                className="modal-poster"
                src={poster}
                alt={movie.Title}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="modal-ratings">
                {[
                  { label: "IMDb", value: movie.imdbRating },
                  { label: "RT", value: getRatingSource(movie.Ratings, "Rotten Tomatoes") },
                  { label: "MC", value: getRatingSource(movie.Ratings, "Metacritic") },
                ].map(({ label, value }) => (
                  <div className="rating-pill" key={label}>
                    <span className="rating-label">{label}</span>
                    <span className="rating-value">{value !== "N/A" ? value : "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-right">
              <div className="modal-genre-row">
                {(movie.Genre || "").split(", ").map((g) => (
                  <span className="genre-tag" key={g}>{g}</span>
                ))}
              </div>
              <h2 className="modal-title">{movie.Title}</h2>
              <p className="modal-meta-line">
                {movie.Year} &nbsp;·&nbsp; {movie.Rated} &nbsp;·&nbsp; {movie.Runtime}
              </p>
              <p className="modal-plot">{movie.Plot}</p>

              <div className="modal-details">
                {[
                  { label: "Director", value: movie.Director },
                  { label: "Cast", value: movie.Actors },
                  { label: "Language", value: movie.Language },
                  { label: "Country", value: movie.Country },
                  { label: "Awards", value: movie.Awards },
                ].map(({ label, value }) =>
                  value && value !== "N/A" ? (
                    <div className="detail-row" key={label}>
                      <span className="detail-label">{label}</span>
                      <span className="detail-value">{value}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}