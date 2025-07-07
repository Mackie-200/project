import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import DashboardSelect from "./Pages/DashboardSelect";
import UserDashboard from "./Pages/UserDashboard";
import OwnerDashboard from "./Pages/OwnerDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import "./App.css";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { DataProvider } from "./Context/DataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import HamburgerMenu from "./Components/HamburgerMenu";

function AppContent() {
  const { user, logout } = useAuth();
  return (
    <div className="App">
      {/* <HamburgerMenu user={user} onLogout={logout} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardSelect />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        {/* fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App; 