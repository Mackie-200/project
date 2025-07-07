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
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email" style={{ display: "none" }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <label htmlFor="password" style={{ display: "none" }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
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