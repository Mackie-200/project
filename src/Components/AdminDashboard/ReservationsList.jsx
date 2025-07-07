import React from "react";

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
                <strong>Space:</strong> {spaceObj ? (spaceObj.name || spaceObj.space_number || spaceObj.id) : booking.space_id}
                {" | "}
                <strong>Time:</strong> {booking.start_time && booking.end_time ? `${new Date(booking.start_time).toLocaleString()} - ${new Date(booking.end_time).toLocaleString()}` : ''}
                {" | "}
                <strong>Status:</strong> {editReservationId === booking.id ? (
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
                    {booking.status}
                    <button onClick={() => { setEditReservationId(booking.id); setEditReservationStatus(booking.status); }} style={{ marginLeft: 8 }}>Edit</button>
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