import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { toast } from "react-toastify";

const paymentMethods = ["card", "mobile money", "cash"];

function UserDashboard() {
  const { user } = useAuth();
  const { spaces, bookings, addBooking, deleteBooking, payments, addPayment } = useData();
  const [search, setSearch] = useState("");
  const [bookingSpaceId, setBookingSpaceId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [payReservationId, setPayReservationId] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(paymentMethods[0]);

  if (!user) return null;

  // Show spaces not owned by the user and only active
  const availableSpaces = spaces.filter((s) => s.owner !== user.name && s.status === 'active');
  // Filter by search
  const filteredSpaces = availableSpaces.filter(
    (space) =>
      (space.name?.toLowerCase().includes(search.toLowerCase()) || "") ||
      (space.location?.toLowerCase().includes(search.toLowerCase()) || "")
  );
  // Show bookings for this user
  const userBookings = bookings.filter((b) => b.user_id === user.id);

  // Helper: get payment for a reservation
  const getPaymentForReservation = (reservation_id) => payments.find(p => p.reservation_id === reservation_id);

  const handleBook = (spaceId) => {
    setBookingSpaceId(spaceId);
    setStartTime("");
    setEndTime("");
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      toast.error("Please select start and end time.");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      toast.error("End time must be after start time.");
      return;
    }
    // Prevent overlapping bookings for the same space
    const overlap = bookings.some(
      (b) =>
        b.space_id === bookingSpaceId &&
        ((new Date(startTime) < new Date(b.end_time)) && (new Date(endTime) > new Date(b.start_time)))
    );
    if (overlap) {
      toast.error("This space is already booked for the selected time.");
      return;
    }
    addBooking({
      user_id: user.id,
      space_id: bookingSpaceId,
      start_time: startTime,
      end_time: endTime,
      status: 'pending',
    });
    toast.success("Parking space booked!");
    setBookingSpaceId(null);
    setStartTime("");
    setEndTime("");
  };

  const handleBookCancel = () => {
    setBookingSpaceId(null);
    setStartTime("");
    setEndTime("");
  };

  const handleCancelBooking = (space_id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      deleteBooking(user.id, space_id);
      toast.success("Booking cancelled.");
    }
  };

  // Payment logic
  const handlePayClick = (reservation) => {
    setPayReservationId(reservation.id);
    // Suggest amount: duration (hours) * rate_per_hour
    const space = spaces.find(s => s.id === reservation.space_id);
    if (space) {
      const start = new Date(reservation.start_time);
      const end = new Date(reservation.end_time);
      const hours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
      setAmount((hours * (space.rate_per_hour || 0)).toFixed(2));
    } else {
      setAmount("");
    }
    setMethod(paymentMethods[0]);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!amount || !method) {
      toast.error("Please enter amount and select payment method.");
      return;
    }
    addPayment({
      reservation_id: payReservationId,
      amount,
      method,
    });
    toast.success("Payment successful!");
    setPayReservationId(null);
    setAmount("");
    setMethod(paymentMethods[0]);
  };

  const handlePayCancel = () => {
    setPayReservationId(null);
    setAmount("");
    setMethod(paymentMethods[0]);
  };

  return (
    <div className="page-bg">
      <div className="dashboard-container dashboard-user">
        <h2>User Dashboard</h2>
        <p>Welcome! Here you can search and book parking spaces.</p>
        <section style={{ marginTop: "2rem" }}>
          <h3>Available Parking Spaces</h3>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <ul>
            {filteredSpaces.length === 0 ? (
              <li>No available spaces.</li>
            ) : (
              filteredSpaces.map((space) => (
                <li key={space.id}>
                  {space.name} ({space.location})
                  <button
                    onClick={() => handleBook(space.id)}
                    style={{ marginLeft: "1rem" }}
                  >
                    Book
                  </button>
                  {bookingSpaceId === space.id && (
                    <form onSubmit={handleBookSubmit} className="booking-time-form">
                      <label>
                        Start Time:
                        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                      </label>
                      <label>
                        End Time:
                        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit">Confirm</button>
                        <button type="button" onClick={handleBookCancel} style={{ background: '#ccc', color: '#222' }}>Cancel</button>
                      </div>
                    </form>
                  )}
                </li>
              ))
            )}
          </ul>
        </section>
        <section style={{ marginTop: "2rem" }}>
          <h3>Your Booking History</h3>
          <ul>
            {userBookings.length === 0 ? (
              <li>No bookings yet.</li>
            ) : (
              userBookings.map((booking, idx) => {
                const space = spaces.find((s) => s.id === booking.space_id);
                const payment = getPaymentForReservation(booking.id);
                return (
                  <li key={booking.id}>
                    {space ? `${space.name} (${space.location})` : "Unknown Space"}
                    <span style={{ marginLeft: '1rem', fontWeight: 600 }}>
                      {booking.start_time && booking.end_time ? `${new Date(booking.start_time).toLocaleString()} - ${new Date(booking.end_time).toLocaleString()}` : ''}
                    </span>
                    <span className={`status-badge ${booking.status || 'pending'}`} style={{ marginLeft: '1rem' }}>
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                    </span>
                    {payment ? (
                      <span style={{ marginLeft: '1rem', color: 'green', fontWeight: 600 }}>
                        Paid: ${payment.amount} ({payment.method}) at {new Date(payment.paid_at).toLocaleString()}
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayClick(booking)}
                        style={{ marginLeft: "1rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#43cea2", color: "#fff", cursor: "pointer" }}
                      >
                        Pay
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelBooking(booking.space_id)}
                      style={{ marginLeft: "1rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#dc3545", color: "#fff", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    {/* Payment form modal */}
                    {payReservationId === booking.id && !payment && (
                      <form onSubmit={handlePaySubmit} style={{ marginTop: 8, background: '#f8fafc', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(30,40,60,0.10)' }}>
                        <div style={{ marginBottom: 8 }}>
                          <label>
                            Amount:
                            <input
                              type="number"
                              value={amount}
                              onChange={e => setAmount(e.target.value)}
                              min="0"
                              step="0.01"
                              required
                              style={{ marginLeft: 8 }}
                            />
                          </label>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <label>
                            Method:
                            <select value={method} onChange={e => setMethod(e.target.value)} style={{ marginLeft: 8 }}>
                              {paymentMethods.map(m => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="submit">Pay</button>
                          <button type="button" onClick={handlePayCancel} style={{ background: '#ccc', color: '#222' }}>Cancel</button>
                        </div>
                      </form>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
export default UserDashboard; 