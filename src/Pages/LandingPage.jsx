import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{
        minHeight: '100vh',
        width: '100vw',
      background: 'linear-gradient(120deg, #e0eafc 0%, #43cea2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        padding: 0,
        margin: 0,
        position: 'relative',
    }}>
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'rgba(255,255,255,0.95)',
          borderRadius: 0,
          boxShadow: 'none',
        padding: '3em 2em 2em 2em',
          display: 'flex',
          flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 1.1s',
        maxWidth: 700,
        margin: '0 auto',
      }}>
        <div style={{ fontSize: '3.5em', marginBottom: '0.5em', fontWeight: 900, letterSpacing: '2px', color: '#2563eb', textAlign: 'center' }}>🅿️</div>
        <h1 style={{ fontSize: '2.2em', fontWeight: 800, marginBottom: '0.7em', letterSpacing: '1px', lineHeight: 1.1, color: '#2563eb', textAlign: 'center', maxWidth: 600 }}>Welcome to <span style={{ color: '#43cea2' }}>Parking Space Finder</span></h1>
        <div style={{ fontSize: '2em', fontWeight: 900, color: '#2563eb', margin: '1.2em 0 0.7em 0', textAlign: 'center', letterSpacing: '1px', lineHeight: 1.1, maxWidth: 600 }}>
          About Parking Space Finder
        </div>
        <p style={{ fontSize: '1.15em', color: '#185a9d', marginBottom: '1.2em', textAlign: 'center', fontWeight: 500, lineHeight: 1.5, maxWidth: 600 }}>
          Parking Space Finder is your smart companion for stress-free parking. Whether you’re heading to work, shopping, or exploring the city, our app helps you quickly find and reserve available parking spaces nearby. Enjoy real-time availability, secure bookings, and easy navigation to your spot—all in one place. Save time, avoid the hassle, and park with confidence every day.
        </p>
        <h2 style={{ fontWeight: 700, fontSize: '1.2em', color: '#2563eb', marginBottom: '1em', letterSpacing: '0.5px', textAlign: 'center', maxWidth: 600 }}>
          Find Your Perfect Parking Spot
        </h2>
        <button className="primary-btn animated-btn" style={{ minWidth: 180, fontSize: '1.12em', padding: '0.8em 1.7em', borderRadius: '0.8em', fontWeight: 700, background: '#43cea2', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(30,40,60,0.08)', transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s', cursor: 'pointer', marginBottom: '2em', letterSpacing: '0.5px', alignSelf: 'center' }} onClick={() => navigate('/searchmap')}>
          Find Parking Near Me
        </button>
        <button className="get-started-btn" style={{ minWidth: 180, fontSize: '1.12em', padding: '0.8em 1.7em', borderRadius: '0.8em', fontWeight: 700, background: '#2563eb', color: '#fff', border: 'none', boxShadow: '0 4px 16px rgba(30,40,60,0.14)', transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s', cursor: 'pointer', marginBottom: '2em', letterSpacing: '0.5px', alignSelf: 'center', animation: 'fadeInScale 1.2s 0.2s cubic-bezier(0.23, 1, 0.32, 1) both' }} onClick={() => navigate('/login')}>
          Get Started
        </button>
        <div style={{
          background: 'rgba(37,99,235,0.07)',
          borderRadius: '1em',
          padding: '1.2em 1em',
          width: '100%',
          color: '#185a9d',
          textAlign: 'center',
          fontSize: '1em',
          boxShadow: '0 2px 8px rgba(30,40,60,0.06)',
          maxWidth: 600,
          margin: '0 auto',
        }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1em', marginBottom: '0.6em', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', textAlign: 'center' }}>
            <span role="img" aria-label="car">🚗</span> Why Choose Us?
          </h3>
          <ul style={{
            margin: '0.5em 0 0 0',
            color: '#185a9d',
            fontSize: '1em',
            padding: 0,
            listStyle: 'none',
            textAlign: 'center',
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7em', marginBottom: '0.5em' }}>
              <span style={{ fontSize: '1.2em', lineHeight: 1, display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}>✅</span>
              <span>Real-time parking availability</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7em', marginBottom: '0.5em' }}>
              <span style={{ fontSize: '1.2em', lineHeight: 1, display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}>✅</span>
              <span>Easy booking & secure payment</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7em', marginBottom: '0.5em' }}>
              <span style={{ fontSize: '1.2em', lineHeight: 1, display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}>✅</span>
              <span>Directions to your parking spot</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7em', marginBottom: '0.5em' }}>
              <span style={{ fontSize: '1.2em', lineHeight: 1, display: 'flex', alignItems: 'center', verticalAlign: 'middle' }}>✅</span>
              <span>User-friendly, modern design</span>
            </li>
          </ul>
        </div>
        {/* How it Works Section */}
        <div style={{
          marginTop: '2.5em',
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
        }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.2em', color: '#2563eb', marginBottom: '1em', letterSpacing: '0.5px' }}>
            How it Works
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5em', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100, maxWidth: 180 }}>
              <span style={{ fontSize: '2em', marginBottom: '0.3em' }}>🔍</span>
              <span style={{ fontWeight: 600, color: '#185a9d', marginBottom: '0.2em' }}>Search</span>
              <span style={{ fontSize: '0.98em', color: '#444' }}>Find available parking spaces near you.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100, maxWidth: 180 }}>
              <span style={{ fontSize: '2em', marginBottom: '0.3em' }}>📝</span>
              <span style={{ fontWeight: 600, color: '#185a9d', marginBottom: '0.2em' }}>Book</span>
              <span style={{ fontSize: '0.98em', color: '#444' }}>Reserve your spot instantly and securely.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100, maxWidth: 180 }}>
              <span style={{ fontSize: '2em', marginBottom: '0.3em' }}>🅿️</span>
              <span style={{ fontWeight: 600, color: '#185a9d', marginBottom: '0.2em' }}>Park</span>
              <span style={{ fontSize: '0.98em', color: '#444' }}>Arrive and park with confidence.</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer style={{
          marginTop: '3em',
          width: '100%',
          textAlign: 'center',
          color: '#888',
          fontSize: '0.98em',
          opacity: 0.8,
        }}>
          &copy; {new Date().getFullYear()} Parking Space Finder. All rights reserved. | Contact: <a href="mailto:support@parkingspacefinder.com" style={{ color: '#2563eb', textDecoration: 'none' }}>support@parkingspacefinder.com</a>
        </footer>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.85); }
            to { opacity: 1; transform: scale(1); }
          }
          .animated-btn:hover {
            transform: scale(1.07);
            box-shadow: 0 6px 24px rgba(30,40,60,0.18);
          }
          .get-started-btn:hover {
            background: #1746b3;
            transform: scale(1.08);
            box-shadow: 0 8px 32px rgba(30,40,60,0.18);
          }
          @media (max-width: 900px) {
            div[style*='maxWidth: 700px'] {
              padding: 1.5em 0.7em !important;
              margin: 1.2em 0;
            }
            .how-it-works {
              flex-direction: column !important;
              gap: 1.5em !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default LandingPage; 