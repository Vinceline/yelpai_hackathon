import React from "react";

function ResultCard({ place }) {
  return (
    <article className="result-card">
      <header className="result-header">
        <div>
          <h3>{place.name}</h3>
          <p className="result-category">{place.categoryLabel}</p>
        </div>
        <div className="result-meta">
          <span className="result-distance">{place.distance}</span>
          <span className="result-score">{place.score.toFixed(1)}</span>
        </div>
      </header>

      <p className="result-address">{place.address}</p>

      <div className="result-tags">
        {place.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <footer className="result-footer">
        <span
          className={`status-pill ${
            place.isOpen ? "status-pill--open" : "status-pill--closed"
          }`}
        >
          {place.isOpen ? "Open now" : "Closed"}
        </span>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => console.log("TODO: show AI summary")}
        >
          View AI summary
        </button>
      </footer>
    </article>
  );
}

export default ResultCard;
