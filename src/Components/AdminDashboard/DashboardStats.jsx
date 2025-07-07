import React from "react";

function DashboardStats({ totalUsers, totalSpaces, totalBookings, mostPopular }) {
  return (
    <section style={{ marginTop: "2rem", marginBottom: "2rem", background: "#eaf6ff", border: "1px solid #b6e0fe", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between" }}>
      <div><strong>Total Users:</strong> {totalUsers}</div>
      <div><strong>Total Spaces:</strong> {totalSpaces}</div>
      <div><strong>Total Bookings:</strong> {totalBookings}</div>
      <div><strong>Most Popular:</strong> {mostPopular ? `${mostPopular.name} (${mostPopular.count} bookings)` : "N/A"}</div>
    </section>
  );
}

export default DashboardStats; 