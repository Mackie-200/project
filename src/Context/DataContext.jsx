import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

const initialLots = [
  { id: 1, name: "Downtown Lot", location: "Downtown", owner: "bob" },
  { id: 2, name: "Mall Lot", location: "Mall Area", owner: "bob" },
  { id: 3, name: "Airport Lot", location: "Airport", owner: "alice" },
];

const initialSpaces = [
  { id: 1, name: "Parking Space A", location: "Downtown", owner: "bob", status: "active", lotId: 1 },
  { id: 2, name: "Parking Space B", location: "Mall Area", owner: "bob", status: "active", lotId: 2 },
  { id: 3, name: "Parking Space C", location: "Airport", owner: "alice", status: "active", lotId: 3 },
];

const initialUsers = [
  { username: "alice", role: "user" },
  { username: "bob", role: "owner" },
  { username: "admin", role: "admin" },
];

export function DataProvider({ children }) {
  const [lots, setLots] = useState(initialLots);
  const [spaces, setSpaces] = useState(initialSpaces);
  const [bookings, setBookings] = useState([]); // {username, spaceId, startTime, endTime, status}
  const [users, setUsers] = useState(initialUsers);

  const addLot = (lot) => {
    setLots((prev) => [
      ...prev,
      { ...lot, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ]);
  };

  const editLot = (id, updates) => {
    setLots((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLot = (id) => {
    setLots((prev) => prev.filter((l) => l.id !== id));
    setSpaces((prev) => prev.map((s) => (s.lotId === id ? { ...s, lotId: null } : s)));
  };

  const addParkingSpace = (space) => {
    setSpaces((prev) => [
      ...prev,
      { ...space, id: prev.length ? prev[prev.length - 1].id + 1 : 1, status: space.status || "pending" },
    ]);
  };

  const editParkingSpace = (id, updates) => {
    setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteParkingSpace = (id) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  const addBooking = (booking) => {
    setBookings((prev) => [
      ...prev,
      {
        ...booking,
        status: booking.status || 'pending',
        startTime: booking.startTime,
        endTime: booking.endTime
      }
    ]);
  };

  const deleteBooking = (username, spaceId) => {
    setBookings((prev) => prev.filter((b) => !(b.username === username && b.spaceId === spaceId)));
  };

  const updateBookingStatus = (bookingIdx, status) => {
    setBookings((prev) => prev.map((b, idx) => idx === bookingIdx ? { ...b, status } : b));
  };

  const deleteUser = (username) => {
    setUsers((prev) => prev.filter((u) => u.username !== username));
  };

  return (
    <DataContext.Provider value={{
      lots, addLot, editLot, deleteLot,
      spaces, addParkingSpace, editParkingSpace, deleteParkingSpace,
      bookings, addBooking, deleteBooking,
      users, setUsers, deleteUser, updateBookingStatus
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
} 