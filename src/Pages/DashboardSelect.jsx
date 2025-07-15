import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function DashboardSelect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "user") {
      navigate("/dashboard/user");
    } else if (user.role === "owner") {
      navigate("/dashboard/owner");
    } else if (user.role === "admin") {
      navigate("/dashboard/admin");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="page-bg">
      <div className="dashboard-select-container">
        <h2>Redirecting to your dashboard...</h2>
        {!(user.role === "user" || user.role === "owner" || user.role === "admin") && (
          <div style={{ color: "red", marginTop: 24 }}>Unknown role: {user.role}</div>
        )}
      </div>
    </div>
  );
}

export default DashboardSelect; 