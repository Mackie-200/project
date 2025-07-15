import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast.error("All fields are required.");
      return;
    }
    
    const userData = { email, password, role };
    const result = login(userData); 
    if (result && result.role) {
      toast.success("Logged in successfully!");
      if (result.role === "admin") navigate("/dashboard/admin");
      else if (result.role === "owner") navigate("/dashboard/owner");
      else navigate("/dashboard/user");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="page-bg">
      <div className="login-container centered-flex">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#2563eb"/>
            <circle cx="12" cy="10" r="4" fill="#fff"/>
            <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" fill="#fff"/>
          </svg>
        </div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{ paddingLeft: 40, background: '#f8fafc', border: '1.5px solid #b6e0fe', borderRadius: 8, position: 'relative', zIndex: 1 }}
            />
            <span style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2, background: 'transparent' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="1.5" fill="#fff"/><path d="M3 7l9 6 9-6" stroke="#2563eb" strokeWidth="1.5" fill="none"/></svg>
            </span>
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ paddingLeft: 40, background: '#f8fafc', border: '1.5px solid #b6e0fe', borderRadius: 8, position: 'relative', zIndex: 1 }}
            />
            <span style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2, background: 'transparent' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5"><rect x="6" y="11" width="12" height="7" rx="2" stroke="#2563eb" strokeWidth="1.5" fill="#fff"/><circle cx="12" cy="8" r="3" stroke="#2563eb" strokeWidth="1.5" fill="#fff"/></svg>
            </span>
          </div>
          <label htmlFor="role" style={{ display: "none" }}>Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select user role please</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login; 