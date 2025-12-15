// src/components/layout/Header.jsx
import React from "react";

function Header() {
  return (
    <header className="app-header" role="banner">
      {/* Skip link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div className="app-logo-row">
        <img
          src="/gottago-logo.png"
          alt="GottaGo - Find accessible facilities"
          className="app-logo"
        />
        <div className="app-title-block">
          <p>Find restrooms, water, free food & air — with dignity.</p>
        </div>
      </div>
    </header>
  );
}

export default Header;