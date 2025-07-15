import React from "react";

function DashboardStats({ totalUsers, totalSpaces, totalBookings, mostPopular }) {
  return (
    <section style={{ margin: 0, background: "none", display: "flex", flexWrap: "nowrap", gap: '1.5em', justifyContent: "space-between", width: '100vw', maxWidth: '100vw', borderRadius: 0, padding: 0 }}>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,40,60,0.10)', padding: '2em 0', textAlign: 'center', minWidth: 0, margin: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '2em', color: '#2563eb', marginBottom: 8 }}>{totalUsers}</div>
        <div style={{ color: '#888', fontSize: '1.1em', letterSpacing: 0.5, fontWeight: 500 }}>Total Users</div>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,40,60,0.10)', padding: '2em 0', textAlign: 'center', minWidth: 0, margin: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '2em', color: '#2563eb', marginBottom: 8 }}>{totalSpaces}</div>
        <div style={{ color: '#888', fontSize: '1.1em', letterSpacing: 0.5, fontWeight: 500 }}>Total Spaces</div>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,40,60,0.10)', padding: '2em 0', textAlign: 'center', minWidth: 0, margin: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '2em', color: '#2563eb', marginBottom: 8 }}>{totalBookings}</div>
        <div style={{ color: '#888', fontSize: '1.1em', letterSpacing: 0.5, fontWeight: 500 }}>Total Bookings</div>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,40,60,0.10)', padding: '2em 0', textAlign: 'center', minWidth: 0, margin: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '2em', color: '#2563eb', marginBottom: 8 }}>{mostPopular ? mostPopular.name : 'N/A'}</div>
        <div style={{ color: '#888', fontSize: '1.1em', letterSpacing: 0.5, fontWeight: 500 }}>{mostPopular ? `${mostPopular.count} bookings` : 'Most Popular'}</div>
      </div>
    </section>
  );
}

export default DashboardStats; 