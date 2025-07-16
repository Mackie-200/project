import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import HamburgerMenu from "../Components/HamburgerMenu";

const LandingPage = () => {
  return (
    <>
      <div className="landing-page-container">
        {/* Video Background */}
        <div className="video-background">
          <video autoPlay loop muted playsInline className="video-bg" poster="/background.jpg">
            <source src="/parking-lot.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Hero Section */}
        <div className="hero-content">
          <h1>Welcome to ParkEase</h1>
          <Link to="/searchmap" className="cta-btn">Find Parking</Link>
        </div>
        <div className="hero-tagline-features" style={{ position: 'absolute', top: 'calc(2.7rem + 140px)', left: '2.5rem', zIndex: 2, color: '#fff', maxWidth: 600 }}>
          {/* Tagline removed as requested */}
          {/* Feature list removed as requested */}
        </div>
        {/* Info section moved outside the main hero container to ensure it appears below the hero area */}
      </div>
      <div className="info-section">
        <h2>Why Choose ParkEase?</h2>
        <p>
          ParkEase makes parking simple, fast, and stress-free. Discover available spaces in real time, reserve your spot in advance, and enjoy secure, cashless payments—all from your phone. Whether you’re a driver, lot owner, or city admin, ParkEase is designed to save you time and make parking effortless.
        </p>
        <div className="info-features-row">
          <div className="info-feature-box">
            <div className="info-feature-icon">🚗</div>
            <div className="info-feature-title">Real-Time Availability</div>
            <div className="info-feature-desc">See open spaces instantly and avoid the hassle of searching.</div>
          </div>
          <div className="info-feature-box">
            <div className="info-feature-icon">📱</div>
            <div className="info-feature-title">Book & Pay Easily</div>
            <div className="info-feature-desc">Reserve and pay for your spot in seconds, securely and cash-free.</div>
          </div>
          <div className="info-feature-box">
            <div className="info-feature-icon">🌍</div>
            <div className="info-feature-title">For Everyone</div>
            <div className="info-feature-desc">Drivers, owners, and cities all benefit from a smarter parking experience.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage; 