import React, { useState } from "react";

function UserReservations({ reservations, spaces, lots, payments, user, onPay }) {
  const [payingId, setPayingId] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const now = new Date();
  // Helper: get space and lot for a reservation
  const getSpace = (id) => spaces.find(s => s.id === id);
  const getLot = (id) => lots.find(l => l.id === id);
  const getPayment = (reservationId) => payments.find(p => p.reservation_id === reservationId);

  // Filter reservations for this user
  const userReservations = reservations.filter(r => r.user_id === user.id || r.userId === user.id || r.username === user.username);
  const upcoming = userReservations.filter(r => new Date(r.end_time) > now);
  const past = userReservations.filter(r => new Date(r.end_time) <= now);

  const renderReservation = (r, center = false) => {
    const space = getSpace(r.space_id || r.spaceId);
    const lot = space ? getLot(space.lotId || space.lot_id) : null;
    const payment = getPayment(r.id);
    const isPending = r.status?.toLowerCase() === 'pending';
    return (
      <li key={r.id} style={{
        marginBottom: 16,
        padding: '14px 18px',
        borderRadius: 10,
        border: '1px solid #e0e0e0',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left',
        boxShadow: '0 2px 8px rgba(30,40,60,0.04)'
      }}>
        <div style={{ marginBottom: 12 }}><strong>Lot:</strong> {lot ? lot.name : "Unknown"} &nbsp; | &nbsp; <strong>Space:</strong> {space ? (space.space_number || space.name) : r.space_id}</div>
        <div style={{ marginBottom: 12 }}><strong>Time:</strong> {r.start_time ? new Date(r.start_time).toLocaleString() : "-"} - {r.end_time ? new Date(r.end_time).toLocaleString() : "-"}</div>
        <div style={{ marginBottom: 12 }}>
          <strong>Status:</strong> <span style={{ color: ['pending', 'confirmed'].includes(r.status?.toLowerCase()) ? '#22c55e' : undefined }}>{r.status}</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Payment:</strong> {payment ? `$${payment.amount} (${payment.method}) at ${new Date(payment.paid_at).toLocaleString()}` : "Not paid"}
        </div>
        {isPending && !payment && (
          payingId === r.id ? (
            <form onSubmit={e => { e.preventDefault(); onPay && onPay(r, amount, method); setPayingId(null); setAmount(""); setMethod("card"); }} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required style={{ padding: '0.5em', borderRadius: 6, border: '1px solid #b6e0fe' }} />
              <select value={method} onChange={e => setMethod(e.target.value)} style={{ padding: '0.5em', borderRadius: 6, border: '1px solid #b6e0fe' }}>
                <option value="card">Card</option>
                <option value="mobile money">Mobile Money</option>
                <option value="cash">Cash</option>
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5em 1.2em', fontWeight: 600 }}>Pay</button>
                <button type="button" onClick={() => { setPayingId(null); setAmount(""); setMethod("card"); }} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5em 1.2em', fontWeight: 600 }}>Cancel</button>
              </div>
            </form>
          ) : (
            <button onClick={() => { setPayingId(r.id); setAmount(""); setMethod("card"); }} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5em 1.2em', fontWeight: 600 }}>Pay</button>
          )
        )}
      </li>
    );
  };

  return (
    <section style={{ marginTop: 24 }}>
      <h3>Your Upcoming Reservations</h3>
      <ul>
        {upcoming.length === 0 ? <li style={{ color: '#888', fontStyle: 'italic' }}>No upcoming reservations. Book a space to see it here!</li> : upcoming.map(r => renderReservation(r, true))}
      </ul>
      <h3 style={{ marginTop: 24, textAlign: 'center' }}>Your Past Reservations</h3>
      <ul style={{ textAlign: 'center' }}>
        {past.length === 0 ? <li style={{ color: '#888', fontStyle: 'italic' }}>No past reservations yet. Your previous bookings will appear here.</li> : past.map(r => renderReservation(r, true))}
      </ul>
    </section>
  );
}

export default UserReservations; 