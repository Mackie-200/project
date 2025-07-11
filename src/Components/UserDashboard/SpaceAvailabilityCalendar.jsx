import React from "react";

function SpaceAvailabilityCalendar({ space, bookings, date }) {
  // Default to today if no date provided
  const selectedDate = date ? new Date(date) : new Date();
  const yyyy = selectedDate.getFullYear();
  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const dd = String(selectedDate.getDate()).padStart(2, '0');
  const dayStr = `${yyyy}-${mm}-${dd}`;

  // Get bookings for this space and this day
  const dayBookings = bookings.filter(b => {
    if (b.space_id !== space.id) return false;
    const start = new Date(b.start_time);
    const end = new Date(b.end_time);
    return start.toISOString().slice(0, 10) === dayStr || end.toISOString().slice(0, 10) === dayStr;
  });

  // Sort bookings by start time
  dayBookings.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  return (
    <div style={{ border: '1px solid #b6e0fe', borderRadius: 8, padding: 16, marginTop: 16, background: '#f7fafd' }}>
      <h4>Availability for {space.name || space.space_number} on {dayStr}</h4>
      <ul>
        {dayBookings.length === 0 ? (
          <li>All day available</li>
        ) : (
          dayBookings.map((b, idx) => (
            <li key={b.id} style={{ color: '#b22222', fontWeight: 600 }}>
              Booked: {new Date(b.start_time).toLocaleTimeString()} - {new Date(b.end_time).toLocaleTimeString()} ({b.status})
            </li>
          ))
        )}
      </ul>
      {dayBookings.length > 0 && <div style={{ color: '#228B22', marginTop: 8 }}>Other times are available for booking.</div>}
    </div>
  );
}

export default SpaceAvailabilityCalendar; 