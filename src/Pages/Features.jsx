import React from "react";
import "./LandingPage.css";

const Features = () => (
  <div className="features-section responsive-features">
    <div className="features-text responsive-features-content">
      <h2 className="features-title">Features</h2>
      <ul className="features-list">
        <li>Find available parking spaces in real time, with up-to-date availability and location details.</li>
        <li>Reserve spots in advance with just a few clicks, ensuring you always have a place to park.</li>
        <li>Easy management for lot owners, including space tracking, booking approvals, and analytics.</li>
        <li>Secure payments and instant notifications for every reservation and transaction.</li>
        <li>User-friendly dashboard for drivers, owners, and admins, accessible from any device.</li>
        <li>Interactive map view to explore parking lots and spaces visually.</li>
        <li>Automated reminders and alerts so you never miss your booking window.</li>
        <li>Role-based access: separate dashboards and controls for users, owners, and admins.</li>
        <li>Comprehensive booking history and payment records for transparency and convenience.</li>
        <li>Responsive design for seamless experience on desktop, tablet, and mobile.</li>
      </ul>
      <p className="features-description">
        ParkEase is designed to make parking stress-free, efficient, and accessible for everyone. Whether you’re a daily commuter, a business owner, or a city administrator, our platform adapts to your needs and helps you save time, reduce hassle, and maximize value.
      </p>
    </div>
  </div>
);

export default Features; 