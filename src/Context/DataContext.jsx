import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const DataContext = createContext();

const initialLots = [
  { id: 1, name: "Downtown Lot", description: "Central city parking", host_id: "bob", created_at: new Date().toISOString(), lat: 40.7128, lng: -74.0060 },
  { id: 2, name: "Mall Lot", description: "Mall Area parking", host_id: "bob", created_at: new Date().toISOString(), lat: 40.7580, lng: -73.9855 },
  { id: 3, name: "Airport Lot", description: "Airport parking", host_id: "alice", created_at: new Date().toISOString(), lat: 40.6413, lng: -73.7781 },
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
  const [bookings, setBookings] = useState([
    {
      id: '1',
      user_id: 'alice',
      space_id: 1, // Parking Space A
      start_time: '2024-06-01T10:00',
      end_time: '2024-06-01T11:00',
      status: 'confirmed',
    },
    {
      id: '2',
      user_id: 'bob',
      space_id: 1, // Parking Space A
      start_time: '2024-06-01T10:30',
      end_time: '2024-06-01T11:30',
      status: 'pending',
    },
  ]);
  const [users, setUsers] = useState(initialUsers);
  const [payments, setPayments] = useState([]);

  // API helper functions for backend integration
  const fetchFromAPI = async (endpoint, options = {}) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('psf_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
  const addLot = (lot) => {
    setLots((prev) => [
      ...prev,
      {
        ...lot,
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        created_at: new Date().toISOString(),
      },
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
        id: uuidv4(),
        user_id: booking.user_id,
        space_id: booking.space_id,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status || 'pending',
      },
    ]);
  };

  const deleteBooking = (user_id, space_id) => {
    setBookings((prev) => prev.filter((b) => !(b.user_id === user_id && b.space_id === space_id)));
  };

  const updateBookingStatus = (bookingIdx, status) => {
    setBookings((prev) => prev.map((b, idx) => idx === bookingIdx ? { ...b, status } : b));
  };

  const deleteUser = (username) => {
    setUsers((prev) => prev.filter((u) => u.username !== username));
  };

  const addPayment = (payment) => {
    setPayments((prev) => [
      ...prev,
      {
        id: uuidv4(),
        reservation_id: payment.reservation_id,
        amount: payment.amount,
        method: payment.method,
        paid_at: new Date().toISOString(),
      },
    ]);
  };

  return (
    <DataContext.Provider value={{
      lots, addLot, editLot, deleteLot,
      spaces, addParkingSpace, editParkingSpace, deleteParkingSpace,
      bookings, addBooking, deleteBooking,
      users, setUsers, deleteUser, updateBookingStatus,
      payments, addPayment,
      fetchFromAPI
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
} 