import React from "react";

function UserReservations({ reservations, spaces, lots, payments, user }) {
  const now = new Date();
  // Helper: get space and lot for a reservation
  const getSpace = (id) => spaces.find(s => s.id === id);
  const getLot = (id) => lots.find(l => l.id === id);
  const getPayment = (reservationId) => payments.find(p => p.reservation_id === reservationId);

  // Filter reservations for this user
  const userReservations = reservations.filter(r => r.user_id === user.id || r.userId === user.id || r.username === user.username);
  const upcoming = userReservations.filter(r => new Date(r.end_time) > now);
  const past = userReservations.filter(r => new Date(r.end_time) <= now);

  const renderReservation = (r) => {
    const space = getSpace(r.space_id || r.spaceId);
    const lot = space ? getLot(space.lotId || space.lot_id) : null;
    const payment = getPayment(r.id);
    return (
      <li key={r.id} style={{
        marginBottom: 16,
        padding: '14px 18px',
        borderRadius: 10,
        border: '1px solid #e0e0e0',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: '0 2px 8px rgba(30,40,60,0.04)'
      }}>
        <div style={{ marginBottom: 4 }}><strong>Lot:</strong> {lot ? lot.name : "Unknown"} &nbsp; | &nbsp; <strong>Space:</strong> {space ? (space.space_number || space.name) : r.space_id}</div>
        <div style={{ marginBottom: 4 }}><strong>Time:</strong> {r.start_time ? new Date(r.start_time).toLocaleString() : "-"} - {r.end_time ? new Date(r.end_time).toLocaleString() : "-"}</div>
        <div style={{ marginBottom: 4 }}><strong>Status:</strong> {r.status}</div>
        <div><strong>Payment:</strong> {payment ? `$${payment.amount} (${payment.method}) at ${new Date(payment.paid_at).toLocaleString()}` : "Not paid"}</div>
      </li>
    );
  };

  return (
    <section style={{ marginTop: 24 }}>
      <h3>Your Upcoming Reservations</h3>
      <ul>
        {upcoming.length === 0 ? <li style={{ color: '#888', fontStyle: 'italic' }}>No upcoming reservations. Book a space to see it here!</li> : upcoming.map(renderReservation)}
      </ul>
      <h3 style={{ marginTop: 24 }}>Your Past Reservations</h3>
      <ul>
        {past.length === 0 ? <li style={{ color: '#888', fontStyle: 'italic' }}>No past reservations yet. Your previous bookings will appear here.</li> : past.map(renderReservation)}
      </ul>
    </section>
  );
}

export default UserReservations; 