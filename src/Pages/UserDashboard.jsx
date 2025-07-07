import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { toast } from "react-toastify";

function UserDashboard() {
  const { user } = useAuth();
  const { spaces, bookings, addBooking, deleteBooking } = useData();
  const [search, setSearch] = useState("");
  const [bookingSpaceId, setBookingSpaceId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  if (!user) return null;

  // Show spaces not owned by the user and only active
  const availableSpaces = spaces.filter((s) => s.owner !== user.name && s.status === 'active');
  // Filter by search
  const filteredSpaces = availableSpaces.filter(
    (space) =>
      space.name.toLowerCase().includes(search.toLowerCase()) ||
      space.location.toLowerCase().includes(search.toLowerCase())
  );
  // Show bookings for this user
  const userBookings = bookings.filter((b) => b.username === user.name);

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
        b.spaceId === bookingSpaceId &&
        ((new Date(startTime) < new Date(b.endTime)) && (new Date(endTime) > new Date(b.startTime)))
    );
    if (overlap) {
      toast.error("This space is already booked for the selected time.");
      return;
    }
    addBooking({ username: user.name, spaceId: bookingSpaceId, startTime, endTime });
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

  const handleCancelBooking = (spaceId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      deleteBooking(user.name, spaceId);
      toast.success("Booking cancelled.");
    }
  };

  return (
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
              const space = spaces.find((s) => s.id === booking.spaceId);
              return (
                <li key={idx}>
                  {space ? `${space.name} (${space.location})` : "Unknown Space"}
                  <span style={{ marginLeft: '1rem', fontWeight: 600 }}>
                    {booking.startTime && booking.endTime ? `${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleString()}` : ''}
                  </span>
                  <span className={`status-badge ${booking.status || 'pending'}`} style={{ marginLeft: '1rem' }}>
                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                  </span>
                  <button
                    onClick={() => handleCancelBooking(booking.spaceId)}
                    style={{ marginLeft: "1rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#dc3545", color: "#fff", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
export default UserDashboard; 