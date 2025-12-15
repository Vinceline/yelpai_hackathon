// src/components/accessibility/AccessibilityBadge.jsx
import React from "react";

/**
 * Displays accessibility features as prominent badges
 * Makes accessibility information immediately visible
 */
function AccessibilityBadge({ features }) {
  if (!features || features.length === 0) return null;

  const getIcon = (feature) => {
    const lower = feature.toLowerCase();
    if (lower.includes('wheelchair')) return '♿';
    if (lower.includes('gender') || lower.includes('neutral')) return '🚻';
    if (lower.includes('accessible')) return '♿';
    if (lower.includes('ramp')) return '🛤️';
    if (lower.includes('elevator')) return '🛗';
    if (lower.includes('braille')) return '👆';
    if (lower.includes('hearing')) return '👂';
    if (lower.includes('service animal')) return '🐕‍🦺';
    return '✓';
  };

  return (
    <div className="accessibility-badges">
      {features.map((feature, idx) => (
        <span key={idx} className="accessibility-badge">
          <span className="badge-icon">{getIcon(feature)}</span>
          {feature}
        </span>
      ))}
    </div>
  );
}

export default AccessibilityBadge;