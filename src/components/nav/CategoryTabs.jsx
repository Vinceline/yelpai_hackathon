import React from "react";

function CategoryTabs({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-btn ${
            activeTab === tab.id ? "tab-btn--active" : ""
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default CategoryTabs;
