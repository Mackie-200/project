import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleMenuToggle = () => {
    setOpen(!open);
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout && onLogout();
  };

  return (
    <>
      {/* Backdrop overlay */}
      {open && <div className="hamburger-backdrop" onClick={() => setOpen(false)} />}
      
      <nav className="hamburger-nav" ref={menuRef}>
        <button
          className={`hamburger-icon${open ? ' open' : ''}`}
          onClick={handleMenuToggle}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="hamburger-menu"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        
        <div 
          id="hamburger-menu"
          className={`hamburger-menu${open ? ' show' : ''}`}
          role="menu"
          aria-hidden={!open}
        >
          {!user ? (
            <>
              <Link 
                to="/" 
                onClick={handleLinkClick}
                role="menuitem"
                className="menu-item"
              >
                <span className="menu-icon">🏠</span>
                Home
              </Link>
              <Link 
                to="/features" 
                onClick={handleLinkClick}
                role="menuitem"
                className="menu-item"
              >
                <span className="menu-icon">⭐</span>
                Features
              </Link>
              <Link 
                to="/about" 
                onClick={handleLinkClick}
                role="menuitem"
                className="menu-item"
              >
                <span className="menu-icon">ℹ️</span>
                About
              </Link>
              <div className="menu-divider" />
              <Link 
                to="/login" 
                onClick={handleLinkClick}
                role="menuitem"
                className="menu-item login-item"
              >
                <span className="menu-icon">🔐</span>
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={handleLinkClick}
                role="menuitem"
                className="menu-item signup-item"
              >
                <span className="menu-icon">📝</span>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="hamburger-user-info">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              <div className="menu-divider" />
              <Link 
                to="/dashboard" 
                onClick={handleLinkClick}
                role="menuitem"
                className="menu-item"
              >
                <span className="menu-icon">📊</span>
                Dashboard
              </Link>
              {user.role === 'owner' && (
                <Link 
                  to="/dashboard/owner" 
                  onClick={handleLinkClick}
                  role="menuitem"
                  className="menu-item"
                >
                  <span className="menu-icon">🏢</span>
                  My Spaces
                </Link>
              )}
              {user.role === 'admin' && (
                <Link 
                  to="/dashboard/admin" 
                  onClick={handleLinkClick}
                  role="menuitem"
                  className="menu-item"
                >
                  <span className="menu-icon">⚙️</span>
                  Admin Panel
                </Link>
              )}
              <div className="menu-divider" />
              <button 
                className="logout-btn menu-item" 
                onClick={handleLogout}
                role="menuitem"
              >
                <span className="menu-icon">🚪</span>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default HamburgerMenu; 