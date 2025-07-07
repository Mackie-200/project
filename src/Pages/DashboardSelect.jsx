import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function DashboardSelect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-select-container">
      <h2>Choose Your Dashboard</h2>
      <div style={{ marginTop: "2rem" }}>
        {user.role === "user" && (
          <button onClick={() => navigate("/dashboard/user")} className="dashboard-btn">User Dashboard</button>
        )}
        {user.role === "owner" && (
          <button onClick={() => navigate("/dashboard/owner")} className="dashboard-btn">Owner Dashboard</button>
        )}
        {user.role === "admin" && (
          <button onClick={() => navigate("/dashboard/admin")} className="dashboard-btn">Admin Dashboard</button>
        )}
      </div>
    </div>
  );
}

export default DashboardSelect; 