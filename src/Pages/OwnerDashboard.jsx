import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { toast } from "react-toastify";

function OwnerDashboard() {
  const { user } = useAuth();
  const { spaces, addParkingSpace, editParkingSpace, deleteParkingSpace, bookings, updateBookingStatus, users } = useData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [search, setSearch] = useState("");

  if (!user) return null;

  const ownerSpaces = spaces.filter((s) => s.owner === user.name);
  const ownerSpaceIds = ownerSpaces.map(s => s.id);
  const ownerBookings = bookings
    .map((b, idx) => ({ ...b, idx }))
    .filter(b => ownerSpaceIds.includes(b.spaceId));
  const filteredSpaces = ownerSpaces.filter(
    (space) =>
      space.name.toLowerCase().includes(search.toLowerCase()) ||
      space.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSpace = (e) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error("Please fill in all fields.");
      return;
    }
    addParkingSpace({ name, location, owner: user.name });
    toast.success("Parking space added!");
    setName("");
    setLocation("");
    setShowForm(false);
  };

  const handleEdit = (space) => {
    setEditId(space.id);
    setEditName(space.name);
    setEditLocation(space.location);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName || !editLocation) {
      toast.error("Please fill in all fields.");
      return;
    }
    editParkingSpace(editId, { name: editName, location: editLocation });
    toast.success("Parking space updated!");
    setEditId(null);
    setEditName("");
    setEditLocation("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this parking space?")) {
      deleteParkingSpace(id);
      toast.success("Parking space deleted!");
    }
  };

  return (
    <div className="dashboard-container dashboard-owner">
      <h2>Owner Dashboard</h2>
      <p>Welcome! Here you can manage your parking spaces.</p>
      <section style={{ marginTop: "2rem" }}>
        <h3>Your Parking Spaces</h3>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <ul>
          {filteredSpaces.length === 0 ? (
            <li>No spaces yet.</li>
          ) : (
            filteredSpaces.map((space) => (
              <li key={space.id}>
                {editId === space.id ? (
                  <form onSubmit={handleEditSubmit} style={{ display: "inline-block" }}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <button type="submit" style={{ marginRight: "0.5rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#0d577a", color: "#fff", cursor: "pointer" }}>Save</button>
                    <button type="button" onClick={() => setEditId(null)} style={{ padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#ccc", color: "#222", cursor: "pointer" }}>Cancel</button>
                  </form>
                ) : (
                  <>
                    {space.name} ({space.location})
                    <span className={`status-badge ${space.status}`}>{space.status === 'pending' ? 'Pending' : 'Active'}</span>
                    <button onClick={() => handleEdit(space)} style={{ marginLeft: "1rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#ffc107", color: "#222", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(space.id)} style={{ marginLeft: "0.5rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#dc3545", color: "#fff", cursor: "pointer" }}>Delete</button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
        {showForm ? (
          <form onSubmit={handleAddSpace} style={{ marginTop: "1rem" }}>
            <input
              type="text"
              placeholder="Space Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <button type="submit" style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: "#0d577a", color: "#fff", cursor: "pointer" }}>Add</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: "#ccc", color: "#222", cursor: "pointer" }}>Cancel</button>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} style={{ marginTop: "1rem", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: "#0d577a", color: "#fff", cursor: "pointer" }}>Add New Parking Space</button>
        )}
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h3>Reservations for Your Spaces</h3>
        <ul>
          {ownerBookings.length === 0 ? (
            <li>No reservations for your spaces.</li>
          ) : (
            ownerBookings.map((booking) => {
              const space = spaces.find(s => s.id === booking.spaceId);
              const userObj = users.find(u => u.username === booking.username);
              return (
                <li key={booking.idx}>
                  <strong>{space ? `${space.name} (${space.location})` : 'Unknown Space'}</strong>
                  <span style={{ marginLeft: '1rem' }}>User: {booking.username}</span>
                  <span style={{ marginLeft: '1rem' }}>{booking.startTime && booking.endTime ? `${new Date(booking.startTime).toLocaleString()} - ${new Date(booking.endTime).toLocaleString()}` : ''}</span>
                  <span className={`status-badge ${booking.status || 'pending'}`} style={{ marginLeft: '1rem' }}>
                    {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                  </span>
                  {booking.status === 'pending' && (
                    <button onClick={() => updateBookingStatus(booking.idx, 'confirmed')}>Approve</button>
                  )}
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <button onClick={() => updateBookingStatus(booking.idx, 'cancelled')} style={{ background: '#dc3545', color: '#fff' }}>Cancel</button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button onClick={() => updateBookingStatus(booking.idx, 'completed')} style={{ background: '#43cea2', color: '#fff' }}>Complete</button>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
export default OwnerDashboard; 