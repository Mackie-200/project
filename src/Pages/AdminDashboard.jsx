import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";
import { toast } from "react-toastify";
import DashboardStats from "../Components/AdminDashboard/DashboardStats";
import UsersList from "../Components/AdminDashboard/UsersList";
import SpacesList from "../Components/AdminDashboard/SpacesList";
import LotsList from "../Components/AdminDashboard/LotsList";
import ReservationsList from "../Components/AdminDashboard/ReservationsList";
import PaymentsList from "../Components/AdminDashboard/PaymentsList";
import LotAnalytics from "../Components/AdminDashboard/LotAnalytics";

function AdminDashboard() {
  const { user } = useAuth();
  const { users, spaces, bookings, editParkingSpace, deleteParkingSpace, deleteUser, setUsers, lots, addLot, editLot, deleteLot, updateBookingStatus, payments, setPayments } = useData();
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
  const [editLotDescription, setEditLotDescription] = useState("");
  const [editLotOwner, setEditLotOwner] = useState("");
  const [editSpaceId, setEditSpaceId] = useState(null);
  const [editSpaceFields, setEditSpaceFields] = useState({});
  const [editReservationId, setEditReservationId] = useState(null);
  const [editReservationStatus, setEditReservationStatus] = useState("");

  
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
    setEditLotDescription(lot.description);
    setEditLotOwner(lot.owner);
  };

  const handleEditLotSubmit = (e) => {
    e.preventDefault();
    if (!editLotName || !editLotDescription || !editLotOwner) {
      toast.error("Please fill in all fields.");
      return;
    }
    editLot(editLotId, { name: editLotName, description: editLotDescription, owner: editLotOwner });
    toast.success("Parking lot updated!");
    setEditLotId(null);
    setEditLotName("");
    setEditLotDescription("");
    setEditLotOwner("");
  };

  const handleDeleteLot = (id) => {
    if (window.confirm("Are you sure you want to delete this parking lot?")) {
      deleteLot(id);
      toast.success("Parking lot deleted!");
    }
  };

  
  const getUserById = (id) => users.find(u => u.id === id || u.username === id || u.email === id);
  
  const getSpaceById = (id) => spaces.find(s => s.id === id);

  return (
    <div className="page-bg" style={{ padding: 0, margin: 0 }}>
      <div className="dashboard-container dashboard-admin" style={{ padding: 0, margin: 0, maxWidth: '100vw', width: '100vw', borderRadius: 0 }}>
        <h2>Admin Dashboard</h2>
        <p style={{ color: '#fff' }}>Welcome! Here you can manage users and parking spaces.</p>
        <DashboardStats
          totalUsers={totalUsers}
          totalSpaces={totalSpaces}
          totalBookings={totalBookings}
          mostPopular={mostPopular}
        />
        <UsersList
          users={users}
          user={user}
          newUsername={newUsername}
          setNewUsername={setNewUsername}
          newRole={newRole}
          setNewRole={setNewRole}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          userRoleFilter={userRoleFilter}
          setUserRoleFilter={setUserRoleFilter}
          filteredUsers={filteredUsers}
          handleAddUser={handleAddUser}
          handleRoleChange={handleRoleChange}
          handleDeleteUser={handleDeleteUser}
        />
        <SpacesList
          spaces={filteredSpaces}
          spaceSearch={spaceSearch}
          setSpaceSearch={setSpaceSearch}
          spaceOwnerFilter={spaceOwnerFilter}
          setSpaceOwnerFilter={setSpaceOwnerFilter}
          uniqueOwners={uniqueOwners}
          editSpaceId={editSpaceId}
          setEditSpaceId={setEditSpaceId}
          editSpaceFields={editSpaceFields}
          setEditSpaceFields={setEditSpaceFields}
          editParkingSpace={editParkingSpace}
          deleteParkingSpace={deleteParkingSpace}
          toast={toast}
        />
        <LotAnalytics
          lots={lots}
          spaces={spaces}
          bookings={bookings}
          payments={payments}
        />
        <LotsList
          lots={lots}
          editLotId={editLotId}
          setEditLotId={setEditLotId}
          editLotName={editLotName}
          setEditLotName={setEditLotName}
          editLotDescription={editLotDescription}
          setEditLotDescription={setEditLotDescription}
          editLot={editLot}
          deleteLot={deleteLot}
          toast={toast}
        />
        <ReservationsList
          bookings={bookings}
          getUserById={getUserById}
          getSpaceById={getSpaceById}
          editReservationId={editReservationId}
          setEditReservationId={setEditReservationId}
          editReservationStatus={editReservationStatus}
          setEditReservationStatus={setEditReservationStatus}
          updateBookingStatus={updateBookingStatus}
          toast={toast}
        />
        <PaymentsList
          payments={payments}
          bookings={bookings}
          getUserById={getUserById}
          setPayments={setPayments}
          toast={toast}
        />
      </div>
    </div>
  );
}
export default AdminDashboard; 