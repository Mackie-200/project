import React from "react";

function UsersList({
  users,
  user,
  newUsername,
  setNewUsername,
  newRole,
  setNewRole,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  filteredUsers,
  handleAddUser,
  handleRoleChange,
  handleDeleteUser
}) {
  return (
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
  );
}

export default UsersList; 