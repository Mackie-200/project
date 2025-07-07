import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      toast.error("All fields are required.");
      return;
    }
    
    const userData = { name: username, role };
    login(userData);
    toast.success("Logged in successfully!");
    if (role === "admin") navigate("/dashboard/admin");
    else if (role === "owner") navigate("/dashboard/owner");
    else navigate("/dashboard/user");
  };

  const loginBg = {
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    background: `linear-gradient(rgba(30,40,60,0.75), rgba(30,40,60,0.75)), url('/image.jpeg') no-repeat center center fixed`,
    backgroundSize: "cover",
  };

  return (
    <div style={loginBg}>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username" style={{ display: "none" }}>Username or Email</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
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