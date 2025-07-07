import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { toast } from "react-toastify";

function AdminDashboard() {
  const { user } = useAuth();
  const { users, spaces, bookings, editParkingSpace, deleteParkingSpace, deleteUser, setUsers, lots, addLot, editLot, deleteLot, updateBookingStatus } = useData();
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [spaceSearch, setSpaceSearch] = useState("");
  const [spaceOwnerFilter, setSpaceOwnerFilter] = useState("");
  
  const [lotName, setLotName] = useState("");
  const [lotLocation, setLotLocation] = useState("");
  const [lotOwner, setLotOwner] = useState("");
  const [editLotId, setEditLotId] = useState(null);
  const [editLotName, setEditLotName] = useState("");
  const [editLotLocation, setEditLotLocation] = useState("");
  const [editLotOwner, setEditLotOwner] = useState("");

  
  const totalUsers = users.length;
  const totalSpaces = spaces.length;
  const totalBookings = bookings.length;
  
  const spaceBookingCounts = spaces.map(space => ({
    ...space,
    count: bookings.filter(b => b.spaceId === space.id).length
  }));
  const mostPopular = spaceBookingCounts.reduce((max, curr) => curr.count > (max?.count || 0) ? curr : max, null);

  
  const allBookings = bookings.map((b, idx) => ({ ...b, idx }));

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

  const handleDeleteSpace = (id) => {
    if (window.confirm("Are you sure you want to delete this parking space?")) {
      deleteParkingSpace(id);
      toast.success("Parking space deleted!");
    }
  };

  const handleDeleteUser = (username) => {
    if (user && user.name === username) {
      toast.error("You cannot delete yourself.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(username);
      toast.success("User deleted!");
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername || !newRole) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (users.some((u) => u.username === newUsername)) {
      toast.error("Username already exists.");
      return;
    }
    setUsers((prev) => [...prev, { username: newUsername, role: newRole }]);
    toast.success("User added!");
    setNewUsername("");
    setNewRole("");
  };

  
  const filteredUsers = users.filter(
    (u) =>
      (u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase())) &&
      (userRoleFilter ? u.role === userRoleFilter : true)
  );

  
  const filteredSpaces = spaces.filter(
    (space) =>
      (space.name.toLowerCase().includes(spaceSearch.toLowerCase()) ||
        space.location.toLowerCase().includes(spaceSearch.toLowerCase()) ||
        space.owner.toLowerCase().includes(spaceSearch.toLowerCase())) &&
      (spaceOwnerFilter ? space.owner === spaceOwnerFilter : true)
  );

  
  const uniqueOwners = Array.from(new Set(spaces.map((s) => s.owner)));

  
  const handleApproveSpace = (id) => {
    editParkingSpace(id, { status: 'active' });
    toast.success('Parking space approved!');
  };

  
  const handleRoleChange = (username, newRole) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.username === username ? { ...u, role: newRole } : u
      )
    );
    toast.success("User role updated!");
  };

  const handleAddLot = (e) => {
    e.preventDefault();
    if (!lotName || !lotLocation || !lotOwner) {
      toast.error("Please fill in all fields.");
      return;
    }
    addLot({ name: lotName, location: lotLocation, owner: lotOwner });
    toast.success("Parking lot added!");
    setLotName("");
    setLotLocation("");
    setLotOwner("");
  };

  const handleEditLot = (lot) => {
    setEditLotId(lot.id);
    setEditLotName(lot.name);
    setEditLotLocation(lot.location);
    setEditLotOwner(lot.owner);
  };

  const handleEditLotSubmit = (e) => {
    e.preventDefault();
    if (!editLotName || !editLotLocation || !editLotOwner) {
      toast.error("Please fill in all fields.");
      return;
    }
    editLot(editLotId, { name: editLotName, location: editLotLocation, owner: editLotOwner });
    toast.success("Parking lot updated!");
    setEditLotId(null);
    setEditLotName("");
    setEditLotLocation("");
    setEditLotOwner("");
  };

  const handleDeleteLot = (id) => {
    if (window.confirm("Are you sure you want to delete this parking lot?")) {
      deleteLot(id);
      toast.success("Parking lot deleted!");
    }
  };

  return (
    <div className="dashboard-container dashboard-admin">
      <h2>Admin Dashboard</h2>
      <p>Welcome! Here you can manage users and parking spaces.</p>
      <section style={{ marginTop: "2rem", marginBottom: "2rem", background: "#eaf6ff", border: "1px solid #b6e0fe", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between" }}>
        <div><strong>Total Users:</strong> {totalUsers}</div>
        <div><strong>Total Spaces:</strong> {totalSpaces}</div>
        <div><strong>Total Bookings:</strong> {totalBookings}</div>
        <div><strong>Most Popular:</strong> {mostPopular ? `${mostPopular.name} (${mostPopular.count} bookings)` : "N/A"}</div>
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h3>All Users</h3>
        <form onSubmit={handleAddUser} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            style={{ marginRight: "0.5rem" }}
            required
          >
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={{ padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#0d577a", color: "#fff", cursor: "pointer" }}>Add User</button>
        </form>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value)}
            style={{ minWidth: "120px" }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <ul>
          {filteredUsers.length === 0 ? (
            <li>No users found.</li>
          ) : (
            filteredUsers.map((u, idx) => (
              <li key={idx}>
                {u.username} ({u.role})
                {user && user.name !== u.username && (
                  <>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.username, e.target.value)}
                      style={{ marginLeft: "1rem", minWidth: "100px" }}
                    >
                      <option value="user">User</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(u.username)}
                      style={{ marginLeft: "0.5rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#dc3545", color: "#fff", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h3>All Parking Spaces</h3>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search by name or location or owner..."
            value={spaceSearch}
            onChange={(e) => setSpaceSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            value={spaceOwnerFilter}
            onChange={(e) => setSpaceOwnerFilter(e.target.value)}
            style={{ minWidth: "120px" }}
          >
            <option value="">All Owners</option>
            {uniqueOwners.map((owner, idx) => (
              <option key={idx} value={owner}>{owner}</option>
            ))}
          </select>
        </div>
        <ul>
          {filteredSpaces.length === 0 ? (
            <li>No spaces found.</li>
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
                    {space.name} ({space.location}) - Owner: {space.owner}
                    <span className={`status-badge ${space.status}`}>{space.status === 'pending' ? 'Pending' : 'Active'}</span>
                    {space.status === 'pending' && (
                      <button onClick={() => handleApproveSpace(space.id)} style={{ marginLeft: '1rem', padding: '0.3rem 0.8rem', borderRadius: '6px', border: 'none', background: '#43cea2', color: '#fff', cursor: 'pointer' }}>Approve</button>
                    )}
                    <button onClick={() => handleEdit(space)} style={{ marginLeft: "1rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#ffc107", color: "#222", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDeleteSpace(space.id)} style={{ marginLeft: "0.5rem", padding: "0.3rem 0.8rem", borderRadius: "6px", border: "none", background: "#dc3545", color: "#fff", cursor: "pointer" }}>Delete</button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h3>Parking Lots</h3>
        <form onSubmit={handleAddLot} style={{ marginBottom: "1rem", display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Lot Name" value={lotName} onChange={e => setLotName(e.target.value)} />
          <input type="text" placeholder="Location" value={lotLocation} onChange={e => setLotLocation(e.target.value)} />
          <select value={lotOwner} onChange={e => setLotOwner(e.target.value)}>
            <option value="">Select Owner</option>
            {users.filter(u => u.role === 'owner').map((u, idx) => (
              <option key={idx} value={u.username}>{u.username}</option>
            ))}
          </select>
          <button type="submit">Add Lot</button>
        </form>
        <ul>
          {lots.length === 0 ? (
            <li>No parking lots found.</li>
          ) : (
            lots.map((lot) => (
              <li key={lot.id}>
                {editLotId === lot.id ? (
                  <form onSubmit={handleEditLotSubmit} style={{ display: 'inline-block' }}>
                    <input type="text" value={editLotName} onChange={e => setEditLotName(e.target.value)} style={{ marginRight: '0.5rem' }} />
                    <input type="text" value={editLotLocation} onChange={e => setEditLotLocation(e.target.value)} style={{ marginRight: '0.5rem' }} />
                    <select value={editLotOwner} onChange={e => setEditLotOwner(e.target.value)} style={{ marginRight: '0.5rem' }}>
                      <option value="">Select Owner</option>
                      {users.filter(u => u.role === 'owner').map((u, idx) => (
                        <option key={idx} value={u.username}>{u.username}</option>
                      ))}
                    </select>
                    <button type="submit" style={{ marginRight: '0.5rem' }}>Save</button>
                    <button type="button" onClick={() => setEditLotId(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <strong>{lot.name}</strong> ({lot.location}) - Owner: {lot.owner} - Spaces: {spaces.filter(s => s.lotId === lot.id).length}
                    <button onClick={() => handleEditLot(lot)} style={{ marginLeft: '1rem' }}>Edit</button>
                    <button onClick={() => handleDeleteLot(lot.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h3>All Reservations</h3>
        <ul>
          {allBookings.length === 0 ? (
            <li>No reservations found.</li>
          ) : (
            allBookings.map((booking) => {
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
export default AdminDashboard; 