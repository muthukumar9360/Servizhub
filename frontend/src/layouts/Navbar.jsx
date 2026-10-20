import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Wrench,
  Heart,
  Bell,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  PlusCircle,
  Package,
} from "lucide-react";
import { logoutUser } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl tracking-tight">
            <span className="text-green-600 font-black">EQUIPORA</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search excavators, cinema gear, generators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/browse"
              className="text-xs font-bold text-gray-800 hover:text-green-600 transition"
            >
              Explore Equipment
            </Link>

            {isAuthenticated && (user?.role === "PROVIDER" || user?.role === "ADMIN") && (
              <Link
                to="/provider/add-equipment"
                className="hidden sm:inline-flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-green-200"
              >
                <PlusCircle className="h-4 w-4" />
                List Equipment
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-full transition"
                  title="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Link>

                <Link
                  to="/notifications"
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-full transition"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 border border-gray-200 rounded-full hover:shadow-sm transition"
                  >
                    <img
                      src={user?.profileImage?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                      alt={user?.fullName}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-extrabold rounded-md">
                          {user?.role}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-semibold"
                      >
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        My Profile & KYC
                      </Link>

                      <Link
                        to="/my-bookings"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-semibold"
                      >
                        <Package className="h-4 w-4 text-gray-400" />
                        My Rentals
                      </Link>

                      {(user?.role === "PROVIDER" || user?.role === "ADMIN") && (
                        <Link
                          to="/provider/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-green-700 font-bold hover:bg-green-50 transition"
                        >
                          <LayoutDashboard className="h-4 w-4 text-green-600" />
                          Provider Dashboard
                        </Link>
                      )}

                      {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-700 font-bold hover:bg-purple-50 transition"
                        >
                          <ShieldCheck className="h-4 w-4 text-purple-600" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-bold text-left"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-gray-700 hover:text-green-600 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
