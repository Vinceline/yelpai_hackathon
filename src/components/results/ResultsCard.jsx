import React, { useState } from "react";

function ResultCard({ place }) {
  const [showSummary, setShowSummary] = useState(false);

  const handleViewSummary = () => {
    setShowSummary(true);
  };

  const closeSummary = () => {
    setShowSummary(false);
  };

  // Extract AI-generated summaries from Yelp response
  const hasSummary = place.summaries && place.summaries.length > 0;
  const contextInfo = place.contextual_info;

  return (
    <>
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
          {hasSummary && (
            <button
              type="button"
              className="ghost-btn"
              onClick={handleViewSummary}
            >
              View AI summary
            </button>
          )}
          {place.yelpUrl && (
            <a
              href={place.yelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-btn"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              View on Yelp
            </a>
          )}
        </footer>
      </article>

      {/* AI Summary Modal */}
      {showSummary && (
        <div className="modal-overlay" onClick={closeSummary}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{place.name} - AI Summary</h3>
              <button
                type="button"
                className="modal-close"
                onClick={closeSummary}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {contextInfo && (
                <div className="summary-section">
                  <h4>Context</h4>
                  <p>{contextInfo}</p>
                </div>
              )}
              {place.summaries && place.summaries.length > 0 && (
                <div className="summary-section">
                  <h4>Reviews Summary</h4>
                  {place.summaries.map((summary, idx) => (
                    <p key={idx} className="summary-text">
                      {summary.text}
                    </p>
                  ))}
                </div>
              )}
              {!hasSummary && !contextInfo && (
                <p className="no-summary">No AI summary available for this place.</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="primary-btn"
                onClick={closeSummary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResultCard;