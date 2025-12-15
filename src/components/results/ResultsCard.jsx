// src/components/results/ResultsCard.jsx
import React, { useState } from "react";
import AccessibilityBadge from "../accessibility/AccessibilityBadge";

function ResultCard({ place }) {
  const [showSummary, setShowSummary] = useState(false);

  const handleViewSummary = () => {
    setShowSummary(true);
  };

  const closeSummary = () => {
    setShowSummary(false);
  };

  // Extract accessibility features
  const accessibilityFeatures = place.tags.filter(tag => {
    const lower = tag.toLowerCase();
    return lower.includes('wheelchair') || 
           lower.includes('accessible') || 
           lower.includes('gender-neutral') ||
           lower.includes('ramp') ||
           lower.includes('elevator') ||
           lower.includes('braille');
  });

  const otherTags = place.tags.filter(tag => !accessibilityFeatures.includes(tag));

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
            {place.distance && (
              <span className="result-distance">{place.distance}</span>
            )}
            <span className="result-score">{place.score.toFixed(1)} ⭐</span>
          </div>
        </header>

        <p className="result-address">{place.address}</p>

        {/* Accessibility features prominently displayed */}
        {accessibilityFeatures.length > 0 && (
          <AccessibilityBadge features={accessibilityFeatures} />
        )}

        {/* Other tags */}
        {otherTags.length > 0 && (
          <div className="result-tags">
            {otherTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

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
              View details
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
              Yelp page
            </a>
          )}
        </footer>
      </article>

      {/* AI Summary Modal */}
      {showSummary && (
        <div className="modal-overlay" onClick={closeSummary}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{place.name}</h3>
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
                  <h4>About This Place</h4>
                  <p>{contextInfo}</p>
                </div>
              )}
              
              {accessibilityFeatures.length > 0 && (
                <div className="summary-section">
                  <h4>♿ Accessibility Features</h4>
                  <ul>
                    {accessibilityFeatures.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
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
                <p className="no-summary">No additional details available.</p>
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