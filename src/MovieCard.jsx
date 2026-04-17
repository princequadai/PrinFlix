const PLACEHOLDER = "https://placehold.co/300x445/1e2433/94a3b8?text=No+Poster";

export default function MovieCard({ movie, onClick }) {
  const poster = !movie.Poster || movie.Poster === "N/A" ? PLACEHOLDER : movie.Poster;

  return (
    <article className="movie-card" onClick={() => onClick(movie.imdbID)}>
      <div className="card-poster-wrap">
        <img
          className="card-poster"
          src={poster}
          alt={movie.Title}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
        <div className="card-overlay">
          <span className="card-view-btn">View Details</span>
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{movie.Title}</h3>
        <div className="card-meta">
          <span className="card-year">{movie.Year}</span>
          <span className="card-type">{movie.Type}</span>
        </div>
      </div>
    </article>
  );
}