import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const homeBg = {
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    background: `linear-gradient(rgba(30,40,60,0.25), rgba(30,40,60,0.25)), url('/image.jpeg')`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100vw 100vh',
  };

  return (
    <div style={homeBg}>
      <div className="home-container">
        <h1>Welcome to Parking Space Finder</h1>
        <p>Find and book parking spaces easily, or manage your own spaces as an owner or admin.</p>
        <div className="home-links enhanced-box" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(30,40,60,0.18)',
          minWidth: '240px',
          maxWidth: '90vw',
          transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s',
        }}>
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: "1rem" }}>Hello, {user.name} ({user.role})</span>
              <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: "#0d577a", color: "#fff", cursor: "pointer" }}>Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home; 