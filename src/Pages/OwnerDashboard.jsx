import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { toast } from "react-toastify";
import ParkingLotForm from "../Components/ParkingLotForm";
import ParkingSpaceForm from "../Components/ParkingSpaceForm";

function OwnerDashboard() {
  const { user } = useAuth();
  const { lots, addLot, spaces, addParkingSpace, editParkingSpace, deleteParkingSpace, bookings, updateBookingStatus, users } = useData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [search, setSearch] = useState("");
  const [editSpaceId, setEditSpaceId] = useState(null);
  const [editFields, setEditFields] = useState({});

  if (!user) return null;

  const ownerLots = lots.filter(lot => lot.host_id === user.name);
  const ownerLotIds = ownerLots.map(lot => lot.id);
  const ownerSpaces = spaces.filter(space => ownerLotIds.includes(space.lot_id));

  const spacesByLot = ownerLots.map(lot => ({
    lot,
    spaces: ownerSpaces.filter(space => space.lot_id === lot.id)
  }));

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

  const handleEditClick = (space) => {
    setEditSpaceId(space.id);
    setEditFields({
      space_number: space.space_number,
      space_type: space.space_type,
      is_available: space.is_available,
      rate_per_hour: space.rate_per_hour,
    });
  };

  const handleEditFieldChange = (field, value) => {
    setEditFields(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = (spaceId) => {
    editParkingSpace(spaceId, {
      ...editFields,
      rate_per_hour: parseFloat(editFields.rate_per_hour),
      is_available: editFields.is_available === "true" || editFields.is_available === true,
    });
    setEditSpaceId(null);
    setEditFields({});
    toast.success("Parking space updated!");
  };

  const handleEditCancel = () => {
    setEditSpaceId(null);
    setEditFields({});
  };

  const handleDeleteSpace = (spaceId) => {
    if (window.confirm("Are you sure you want to delete this parking space?")) {
      deleteParkingSpace(spaceId);
      toast.success("Parking space deleted!");
    }
  };

  return (
    <div className="page-bg" style={{ padding: 0, margin: 0 }}>
      <div className="dashboard-container dashboard-owner" style={{ padding: 0, margin: 0, maxWidth: '100vw', width: '100vw', borderRadius: 0 }}>
        <h2>Owner Dashboard</h2>
        <p style={{ marginBottom: '1.5rem', color: '#fff' }}>Welcome! Here you can manage your parking lots and spaces.</p>
        <section style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
          <ParkingLotForm onAddLot={addLot} currentUser={user} />
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h3>Your Parking Lots</h3>
          <ul>
            {ownerLots.length === 0 ? (
              <li>No lots yet.</li>
            ) : (
              ownerLots.map(lot => (
                <li key={lot.id}>
                  <strong>{lot.name}</strong>: {lot.description}
                  <span style={{ marginLeft: "1rem", color: "#888", fontSize: "0.95em" }}>
                    Created: {new Date(lot.created_at).toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <ParkingSpaceForm lots={ownerLots} onAddSpace={addParkingSpace} />
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h3>Your Parking Spaces by Lot</h3>
          {spacesByLot.length === 0 ? (
            <p>No lots or spaces yet.</p>
          ) : (
            spacesByLot.map(({ lot, spaces }) => (
              <div key={lot.id} style={{ marginBottom: "1.5rem" }}>
                <h4>{lot.name}</h4>
                {spaces.length === 0 ? (
                  <p style={{ color: '#888' }}>No spaces for this lot.</p>
                ) : (
                  <ul>
                    {spaces.map(space => (
                      <li key={space.id}>
                        {editSpaceId === space.id ? (
                          <>
                            <input
                              type="text"
                              value={editFields.space_number}
                              onChange={e => handleEditFieldChange("space_number", e.target.value)}
                              style={{ width: 60, marginRight: 8 }}
                            />
                            <select
                              value={editFields.space_type}
                              onChange={e => handleEditFieldChange("space_type", e.target.value)}
                              style={{ marginRight: 8 }}
                            >
                              <option value="regular">regular</option>
                              <option value="compact">compact</option>
                              <option value="EV">EV</option>
                              <option value="accessible">accessible</option>
                            </select>
                            <select
                              value={editFields.is_available ? "true" : "false"}
                              onChange={e => handleEditFieldChange("is_available", e.target.value)}
                              style={{ marginRight: 8 }}
                            >
                              <option value="true">Available</option>
                              <option value="false">Unavailable</option>
                            </select>
                            <input
                              type="number"
                              value={editFields.rate_per_hour}
                              onChange={e => handleEditFieldChange("rate_per_hour", e.target.value)}
                              style={{ width: 80, marginRight: 8 }}
                              min="0"
                              step="0.01"
                            />
                            <button onClick={() => handleEditSave(space.id)} style={{ marginRight: 4 }}>Save</button>
                            <button onClick={handleEditCancel}>Cancel</button>
                          </>
                        ) : (
                          <>
                            Space #{space.space_number} ({space.space_type}) - {space.is_available ? 'Available' : 'Unavailable'} - ${space.rate_per_hour}/hr
                            <button onClick={() => handleEditClick(space)} style={{ marginLeft: 8 }}>Edit</button>
                            <button onClick={() => handleDeleteSpace(space.id)} style={{ marginLeft: 4, color: 'red' }}>Delete</button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>
        <section style={{ marginTop: "2rem" }}>
          <h3>Your Parking Spaces</h3>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "60%", margin: '0 auto 1rem auto', display: 'block', textAlign: 'center' }}
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
    </div>
  );
}
export default OwnerDashboard; 