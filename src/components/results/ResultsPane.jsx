import React from "react";
import ResultCard from "./ResultsCard";

function getTitleForTab(activeTab) {
  if (activeTab === "restrooms") return "Nearby Restrooms";
  if (activeTab === "water") return "Water Refill Spots";
  if (activeTab === "food") return "Free / Community Food";
  if (activeTab === "air") return "Free Air for Tires";
  if (activeTab === "access") return "Accessible Comfort Spots";
  return "";
}

function ResultsPane({ activeTab, results, isLoading }) {
  const title = getTitleForTab(activeTab);

  return (
    <section className="results-pane">
      <div className="results-header">
        <h2>{title}</h2>
        <span className="results-count">
          {isLoading
            ? "Searching…"
            : results.length > 0
            ? `${results.length} suggested places`
            : "No results yet – try searching."}
        </span>
      </div>

      <div className="results-list">
        {results.map((place) => (
          <ResultCard key={place.id} place={place} />
        ))}
      </div>
    </section>
  );
}

export default ResultsPane;
