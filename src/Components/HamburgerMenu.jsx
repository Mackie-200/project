import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="hamburger-nav">
      <button
        className={`hamburger-icon${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`hamburger-menu${open ? ' show' : ''}`}>
        {!user ? (
          <>
            <Link to="/features" onClick={() => setOpen(false)}>Features</Link>
            <Link to="/about" onClick={() => setOpen(false)}>About</Link>
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
          </>
        ) : (
          <>
            <span className="hamburger-user">Hello, {user.name} ({user.role})</span>
            <button className="logout-btn" onClick={() => { setOpen(false); onLogout && onLogout(); }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default HamburgerMenu; 