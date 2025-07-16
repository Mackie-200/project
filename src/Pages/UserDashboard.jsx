import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { toast } from "react-toastify";
import UserReservations from "../Components/UserDashboard/UserReservations";
import SpaceAvailabilityCalendar from "../Components/UserDashboard/SpaceAvailabilityCalendar";
import { useNotifications } from "../Context/NotificationContext";
import LotsMap from "../Components/UserDashboard/LotsMap";

const paymentMethods = ["card", "mobile money", "cash"];

function UserDashboard() {
  const { user, logout } = useAuth();
  const { spaces, bookings, addBooking, deleteBooking, payments, addPayment, lots } = useData();
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState("");
  const [bookingSpaceId, setBookingSpaceId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [payReservationId, setPayReservationId] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(paymentMethods[0]);
  const [calendarSpaceId, setCalendarSpaceId] = useState(null);
  const [calendarDate, setCalendarDate] = useState("");
  const [locationFilter, setLocationFilter] = useState("Harare");
  const [selectedPrice, setSelectedPrice] = useState('3.29');

  if (!user) return null;

  
  // Filter lots and spaces by location
  const filteredLots = lots.filter(lot =>
    locationFilter === "Harare"
      ? lot.location?.toLowerCase().includes("harare")
      : !lot.location?.toLowerCase().includes("harare")
  );
  const filteredSpaces = spaces.filter(space =>
    filteredLots.some(lot => lot.id === space.lotId) && space.status === 'active'
  );
  const spacesWithCoords = filteredSpaces.map(space => {
    const lot = filteredLots.find(lot => lot.id === space.lotId);
    return lot ? { ...space, lat: lot.lat, lng: lot.lng } : space;
  });
  
  const userBookings = bookings.filter((b) => b.user_id === user.id);

  
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
    if (!selectedPrice) {
      toast.error("Please select a price.");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      toast.error("End time must be after start time.");
      return;
    }
    
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
      price: selectedPrice,
    });
    toast.success("Parking space booked!");
    setBookingSpaceId(null);
    setStartTime("");
    setEndTime("");
    setSelectedPrice('3.29');
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
    addNotification({
      message: `Payment of $${amount} (${method}) for your reservation was successful!`,
      type: "success",
    });
    setPayReservationId(null);
    setAmount("");
    setMethod(paymentMethods[0]);
  };

  const handlePayCancel = () => {
    setPayReservationId(null);
    setAmount("");
    setMethod(paymentMethods[0]);
  };

  // Quick stats
  const activeBookings = bookings.filter(b => b.user_id === user.id && new Date(b.end_time) > new Date());
  const unpaidReservations = bookings.filter(b => b.user_id === user.id && b.status === 'pending');

  // Status badge helper
  const getStatusBadge = (status) => {
    let color = '#888';
    if (status === 'pending') color = '#f59e42';
    if (status === 'confirmed') color = '#43cea2';
    if (status === 'cancelled') color = '#ef4444';
    return <span style={{ background: color, color: '#fff', borderRadius: 8, padding: '2px 10px', marginLeft: 8, fontSize: '0.95em' }}>{status}</span>;
  };

  // Add a temporary test space if none exist
  let testSpaces = filteredSpaces;
  if (testSpaces.length === 0) {
    testSpaces = [{
      id: 'test1',
      name: 'Test Space',
      location: 'Test Location',
    }];
  }

  return (
    <div className="page-bg" style={{ padding: 0, margin: 0 }}>
      <div className="dashboard-container dashboard-user" style={{ padding: 0, margin: 0, maxWidth: '100vw', width: '100vw', borderRadius: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '2rem 2.5rem 0 2.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2em' }}>{user.name}</div>
            <div style={{ color: '#2563eb', fontSize: '1em' }}>{user.email}</div>
            <div style={{ color: '#fff', fontSize: '0.98em' }}>Role: {user.role}</div>
          </div>
          <button
            onClick={logout}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.5em 1.2em',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(30,40,60,0.08)',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1746b3')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
          >
            Logout
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1.5em', marginBottom: 32, width: '100vw', maxWidth: '100vw', borderRadius: 0 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,40,60,0.10)', padding: '2em 0', textAlign: 'center', minWidth: 0, margin: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '2em', color: '#2563eb', marginBottom: 8 }}>{activeBookings.length}</div>
            <div style={{ color: '#888', fontSize: '1.1em', letterSpacing: 0.5, fontWeight: 500 }}>Active Bookings</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,40,60,0.10)', padding: '2em 0', textAlign: 'center', minWidth: 0, margin: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '2em', color: '#2563eb', marginBottom: 8 }}>{userBookings.length}</div>
            <div style={{ color: '#888', fontSize: '1.1em', letterSpacing: 0.5, fontWeight: 500 }}>Total Bookings</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,40,60,0.10)', padding: '2em 0', textAlign: 'center', minWidth: 0, margin: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '2em', color: '#ef4444', marginBottom: 8 }}>{unpaidReservations.length}</div>
            <div style={{ color: '#888', fontSize: '1.1em', letterSpacing: 0.5, fontWeight: 500 }}>Unpaid Reservations</div>
          </div>
        </div>
        <h2>User Dashboard</h2>
        <p style={{ color: '#fff' }}>Welcome! Here you can search and book parking spaces.</p>
        <section style={{ marginTop: "2rem" }}>
          <h3>Available Parking Spaces</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label>
              Show spaces in:
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ marginLeft: 8 }}>
                <option value="Harare">Harare</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <LotsMap lots={filteredLots} spaces={spacesWithCoords} onBook={handleBook} addBooking={addBooking} user={user} bookings={bookings} searchTerm={search} />
          <ul>
            {testSpaces.length === 0 ? (
              <li>No available spaces.</li>
            ) : (
              testSpaces.map((space) => (
                <li key={space.id}>
                  {space.name} ({space.location})
                  <button
                    onClick={() => handleBook(space.id)}
                    style={{ marginLeft: "1rem" }}
                  >
                    Book
                  </button>
                  <button
                    onClick={() => setCalendarSpaceId(calendarSpaceId === space.id ? null : space.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    {calendarSpaceId === space.id ? "Hide Calendar" : "Show Availability"}
                  </button>
                  {calendarSpaceId === space.id && (
                    <div style={{ marginTop: 8 }}>
                      <label>
                        Date: <input type="date" value={calendarDate} onChange={e => setCalendarDate(e.target.value)} />
                      </label>
                      <SpaceAvailabilityCalendar
                        space={space}
                        bookings={bookings}
                        date={calendarDate}
                      />
                    </div>
                  )}
                  {bookingSpaceId === space.id && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <form onSubmit={handleBookSubmit} className="booking-time-form" style={{ display: 'flex', alignItems: 'center', gap: '1em', marginTop: '1em' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          Start Time:
                          <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          End Time:
                          <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                        </label>
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          Price:
                          <select value={selectedPrice} onChange={e => setSelectedPrice(e.target.value)} required>
                            <option value="3.29">$3.29</option>
                            <option value="2.40">$2.40</option>
                            <option value="3.00">$3.00</option>
                            <option value="5.00">$5.00</option>
                            <option value="8.00">$8.00</option>
                          </select>
                        </label>
                        <button type="submit">Confirm Booking</button>
                        <button type="button" onClick={handleBookCancel} style={{ marginLeft: 8 }}>Cancel</button>
                      </form>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </section>
        <section style={{ marginTop: "2rem" }}>
          <h3>Your Booking History</h3>
          <UserReservations
            reservations={bookings}
            spaces={spaces}
            lots={[]}
            payments={payments}
            user={user}
            onPay={(reservation, amount, method) => {
              if (!amount || !method) {
                toast.error("Please enter amount and select payment method.");
                return;
              }
              addPayment({
                reservation_id: reservation.id,
                amount,
                method,
              });
              toast.success("Payment successful!");
              addNotification({
                message: `Payment of $${amount} (${method}) for your reservation was successful!`,
                type: "success",
              });
            }}
          />
        </section>
      </div>
    </div>
  );
}
export default UserDashboard; 