import React from "react";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import "../Pages/LandingPage.css";

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-logo">ParkEase</div>
    <HamburgerMenu />
    <ul className="navbar-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/features">Features</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/signup">Signup</Link></li>
    </ul>
  </nav>
);

export default Navbar; 