import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await login({ email, password });
      if (result.success) {
        // Navigate based on user role
        const userRole = result.user.role;
        if (userRole === "admin") {
          navigate("/dashboard/admin");
        } else if (userRole === "owner") {
          navigate("/dashboard/owner");
        } else {
          navigate("/dashboard/user");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-bg">
      <div className="login-container centered-flex">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6em', marginBottom: '1.5rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#2563eb"/>
            <circle cx="12" cy="10" r="4" fill="#fff"/>
            <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" fill="#fff"/>
          </svg>
          <h2 style={{ margin: 0, color: '#185a9d', fontWeight: 'bold', letterSpacing: '1px' }}>Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1rem', background: '#f8fafc', border: '1.5px solid #b6e0fe', borderRadius: 8 }}>
            <span style={{ marginLeft: 10, marginRight: 8, display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="1.5" fill="#fff"/><path d="M3 7l9 6 9-6" stroke="#2563eb" strokeWidth="1.5" fill="none"/></svg>
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: '#185a9d', fontSize: '1rem', padding: '0.7rem 0' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1rem', background: '#f8fafc', border: '1.5px solid #b6e0fe', borderRadius: 8 }}>
            <span style={{ marginLeft: 10, marginRight: 8, display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="6" y="11" width="12" height="7" rx="2" stroke="#2563eb" strokeWidth="1.5" fill="#fff"/><circle cx="12" cy="8" r="3" stroke="#2563eb" strokeWidth="1.5" fill="#fff"/></svg>
            </span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: '#185a9d', fontSize: '1rem', padding: '0.7rem 0' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#94a3b8' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 