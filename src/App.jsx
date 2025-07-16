import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import DashboardSelect from "./Pages/DashboardSelect";
import UserDashboard from "./Pages/UserDashboard";
import OwnerDashboard from "./Pages/OwnerDashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import LandingPage from "./Pages/LandingPage";
import SearchMap from "./Pages/SearchMap";
import Features from "./Pages/Features";
import About from "./Pages/About";
import "./App.css";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { DataProvider } from "./Context/DataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from "./Context/NotificationContext";
import Notifications from "./Components/Notifications";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";


function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/dashboard" />;
  return children;
}

function AppContent() {
  const { user, logout } = useAuth();
  return (
    <div className="App">
      {/* <HamburgerMenu user={user} onLogout={logout} /> */}
      <Notifications />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<DashboardSelect />} />
        <Route path="/dashboard/user" element={
          <RequireRole role="user">
            <UserDashboard />
          </RequireRole>
        } />
        <Route path="/dashboard/owner" element={
          <RequireRole role="owner">
            <OwnerDashboard />
          </RequireRole>
        } />
        <Route path="/dashboard/admin" element={
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        } />
        <Route path="/searchmap" element={<SearchMap />} />
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
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App; 