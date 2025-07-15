import React from "react";
import "../App.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-brand">Parking Space Finder</span>
        <nav className="footer-links">
          <a href="/" className="footer-link">Home</a>
          <a href="/login" className="footer-link">Login</a>
          <a href="/signup" className="footer-link">Sign Up</a>
        </nav>
        <span className="footer-copy">&copy; {new Date().getFullYear()} Parking Space Finder. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer; 