import React from "react";

function Header() {
  return (
    <header className="app-header">
      <div className="app-logo-row">
        <img
          src="/gottago-logo.png"
          alt="GottaGo logo"
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
