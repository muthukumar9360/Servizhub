import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User Pages
import LandingPage from "./pages/user/LandingPage";
import BrowseEquipment from "./pages/user/BrowseEquipment";
import EquipmentDetails from "./pages/user/EquipmentDetails";
import MyBookings from "./pages/user/MyBookings";
import VerificationCenter from "./pages/user/VerificationCenter";

// Provider Pages
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import AddEquipment from "./pages/provider/AddEquipment";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

import axiosInstance from "./api/axiosInstance";
import { loginSuccess } from "./store/slices/authSlice";

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore authenticated session on app load if token exists
    const checkAuthSession = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        if (response.data?.data) {
          const token = localStorage.getItem("accessToken");
          dispatch(loginSuccess({ user: response.data.data, accessToken: token }));
        }
      } catch (e) {
        // Session expired
      }
    };
    if (localStorage.getItem("accessToken")) {
      checkAuthSession();
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-900 selection:bg-indigo-500 selection:text-white">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<BrowseEquipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Authenticated Renter Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <VerificationCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verification"
              element={
                <ProtectedRoute>
                  <VerificationCenter />
                </ProtectedRoute>
              }
            />

            {/* Provider Routes */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={["PROVIDER", "ADMIN", "SUPER_ADMIN"]}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/add-equipment"
              element={
                <ProtectedRoute allowedRoles={["PROVIDER", "ADMIN", "SUPER_ADMIN"]}>
                  <AddEquipment />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
