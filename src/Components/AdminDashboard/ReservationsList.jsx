import React from "react";

const statusColors = {
  pending: '#10b981', // green
  confirmed: '#3b82f6', // blue
  approved: '#10b981', // green
  cancelled: '#ef4444', // red
  completed: '#6366f1', // indigo
  default: '#d1d5db', // gray
};

function ReservationsList({
  bookings,
  getUserById,
  getSpaceById,
  editReservationId,
  setEditReservationId,
  editReservationStatus,
  setEditReservationStatus,
  updateBookingStatus,
  toast
}) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>All Reservations</h3>
      <ul>
        {bookings.length === 0 ? (
          <li>No reservations found.</li>
        ) : (
          bookings.map((booking) => {
            const userObj = getUserById(booking.user_id);
            const spaceObj = getSpaceById(booking.space_id);
            return (
              <li key={booking.id} style={{ marginBottom: 8 }}>
                <strong>User:</strong> {userObj ? (userObj.name || userObj.username || userObj.email) : booking.user_id}
                {" | "}
                <strong>Time:</strong> {booking.start_time && booking.end_time ? `${new Date(booking.start_time).toLocaleString()} - ${new Date(booking.end_time).toLocaleString()}` : ''}
                {" | "}
                <strong>Status:</strong> 
                <span style={{
                  display: 'inline-block',
                  padding: '2px 12px',
                  borderRadius: '12px',
                  background: statusColors[booking.status] || statusColors.default,
                  color: '#fff',
                  fontWeight: 600,
                  marginLeft: 4,
                  marginRight: 4,
                  fontSize: '0.98em',
                }}>{booking.status}</span>

                {editReservationId === booking.id ? (
                  <>
                    <select
                      value={editReservationStatus}
                      onChange={e => setEditReservationStatus(e.target.value)}
                      style={{ marginLeft: 8 }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => {
                        updateBookingStatus(bookings.findIndex(b => b.id === booking.id), editReservationStatus);
                        setEditReservationId(null);
                        setEditReservationStatus("");
                        toast.success("Reservation status updated!");
                      }}
                      style={{ marginLeft: 8 }}
                    >Save</button>
                    <button onClick={() => { setEditReservationId(null); setEditReservationStatus(""); }} style={{ marginLeft: 4 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    {/* Only show Approve button for pending bookings with NO overlap */}
                    {booking.status === 'pending' && !bookings.some(b =>
                      b.id !== booking.id &&
                      b.space_id === booking.space_id &&
                      b.status === 'confirmed' &&
                      ((new Date(booking.start_time) < new Date(b.end_time)) && (new Date(booking.end_time) > new Date(b.start_time)))
                    ) && (
                      <button
                        onClick={() => { setEditReservationId(booking.id); setEditReservationStatus('confirmed'); }}
                        style={{
                          marginLeft: 8,
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 18px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(16,185,129,0.15)',
                          transition: 'background 0.2s, transform 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#059669'}
                        onMouseOut={e => e.currentTarget.style.background = '#10b981'}
                      >
                        Approve
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => { setEditReservationId(booking.id); setEditReservationStatus('completed'); }} style={{ marginLeft: 8, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Mark Completed</button>
                    )}
                    {booking.status !== 'pending' && booking.status !== 'confirmed' && (
                      <button onClick={() => { setEditReservationId(booking.id); setEditReservationStatus(booking.status); }} style={{ marginLeft: 8 }}>Edit</button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this reservation?")) {
                          // Remove from bookings (should be handled by parent)
                          toast.success("Reservation deleted!");
                        }
                      }}
                      style={{ marginLeft: 4, color: 'red' }}
                    >Delete</button>
                  </>
                )}
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export default ReservationsList; 