// src/components/layout/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <span>
        <strong>GottaGo</strong> · Built for Yelp AI Hackathon 2025
      </span>
      <span className="footer-right">
        <span className="dot" aria-hidden="true" />
        Restrooms · Water · Free Food · Free Air · Access
      </span>
    </footer>
  );
}

export default Footer;
