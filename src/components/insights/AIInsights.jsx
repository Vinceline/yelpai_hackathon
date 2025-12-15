// src/components/insights/AIInsights.jsx
import React from "react";

/**
 * Shows AI-powered insights and how urgency/conversation affects results
 * This makes the "agentic" nature of the app visible to judges
 */
function AIInsights({ urgency, activeTab, resultsCount, chatId }) {
  const getUrgencyInsight = () => {
    switch (urgency) {
      case "now":
        return {
          icon: "🚨",
          text: "Emergency mode: Prioritizing 24/7 locations and places currently open",
          color: "#dc2626",
        };
      case "soon":
        return {
          icon: "⏰",
          text: "Near-term mode: Focusing on closest options within walking distance",
          color: "#f59e0b",
        };
      default:
        return {
          icon: "😊",
          text: "Browsing mode: Showing best-rated options in your area",
          color: "#10b981",
        };
    }
  };

  const getCategoryInsight = () => {
    const insights = {
      restrooms: {
        icon: "🚻",
        text: "AI analyzing cleanliness, accessibility, and availability from reviews",
      },
      water: {
        icon: "💧",
        text: "AI identifying free refill stations and water fountain locations",
      },
      food: {
        icon: "🍲",
        text: "AI finding community resources and mutual aid locations",
      },
      air: {
        icon: "🔧",
        text: "AI locating free tire inflation and bike pump services",
      },
      access: {
        icon: "♿",
        text: "AI evaluating wheelchair access, ramps, and ADA compliance",
      },
    };
    return insights[activeTab];
  };

  const insight = getUrgencyInsight();
  const categoryInsight = getCategoryInsight();

  return (
    <div className="ai-insights">
      <div className="insight-header">
        <span className="insight-badge">🤖 AI Active</span>
        {chatId && (
          <span className="conversation-badge">
            💬 Conversation: {chatId.slice(0, 8)}...
          </span>
        )}
      </div>

      <div className="insight-card" style={{ borderLeftColor: insight.color }}>
        <div className="insight-icon">{insight.icon}</div>
        <div className="insight-content">
          <div className="insight-label">Urgency Mode</div>
          <div className="insight-text">{insight.text}</div>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-icon">{categoryInsight.icon}</div>
        <div className="insight-content">
          <div className="insight-label">Category Intelligence</div>
          <div className="insight-text">{categoryInsight.text}</div>
        </div>
      </div>

      {resultsCount > 0 && (
        <div className="results-summary">
          <span className="summary-icon">✨</span>
          <span className="summary-text">
            Found {resultsCount} AI-curated {activeTab} near you
          </span>
        </div>
      )}

      {chatId && (
        <div className="conversation-hint">
          <span className="hint-icon">💡</span>
          <span className="hint-text">
            Ask follow-up questions to refine these results further
          </span>
        </div>
      )}
    </div>
  );
}

export default AIInsights;