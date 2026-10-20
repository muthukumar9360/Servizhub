import React, { useState, useEffect } from "react";
import { Search, Mic, MapPin, User as UserIcon, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SettingsSidebar from "../Components/SettingsSidebar";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";

const EquipmentRentalHeaderSection = () => {
  const [city, setCity] = useState("Chennai");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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

  const handleSearch = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await axiosInstance.get(`/equipments?q=${text}&limit=5`);
      setResults(res.data.data?.equipments || []);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setShowResults(false);
    }
  };

  const handleFormSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm relative border-b border-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between mx-6 py-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1 text-4xl font-extrabold tracking-tight">
            <span className="text-blue-600 font-black">Equip</span>
            <span className="text-orange-500 font-black">ora</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col justify-center w-full md:w-1/2 relative">
          <p className="text-sm font-bold text-gray-800 mb-1">
            Search across <span className="text-blue-600 font-extrabold">1,250+</span> Verified Equipment Depots
          </p>

          <form onSubmit={handleFormSearch} className="flex items-center">
            <MapPin size={24} className="text-orange-500 mr-2 shrink-0" />

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City Location"
              className="border border-gray-300 rounded-l-xl py-2 px-3 w-1/3 focus:outline-none text-sm font-semibold text-gray-800"
            />

            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search excavators, cinema cameras, sound systems, generators..."
                className="border-y border-r border-gray-300 py-2 px-3 w-full focus:outline-none text-sm font-medium"
              />

              {/* Results Dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute top-11 left-0 right-0 bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 max-h-72 overflow-y-auto">
                  {results.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setShowResults(false);
                        setQuery("");
                        navigate(`/equipment/${item._id}`);
                      }}
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs text-gray-900">{item.name}</p>
                        <span className="text-[10px] text-green-700 font-semibold">{item.category?.mainCategory}</span>
                      </div>
                      <span className="text-xs font-black text-indigo-600">₹{item.rentalPrice}/day</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="button" className="bg-white border-y border-r border-gray-300 px-3 py-2 flex items-center text-blue-600">
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-xl flex items-center transition font-bold"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* User Session */}
        <div className="flex text-xs text-gray-700 gap-4 items-center">
          <select className="border rounded-lg px-2 py-1 bg-white font-medium">
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>

          <Link to="/provider/dashboard" className="font-bold text-green-600 hover:underline">
            Depot Portal
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-gray-900">{user?.fullName?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="border px-3 py-1 rounded-lg hover:bg-red-50 text-red-600 font-bold transition"
              >
                Logout
              </button>
              <img
                src={user?.profileImage?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                alt="Profile"
                className="rounded-full w-8 h-8 object-cover border cursor-pointer hover:ring-2 hover:ring-orange-400"
                onClick={() => setIsSidebarOpen(true)}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <button className="border-2 border-gray-900 px-3 py-1 rounded-lg font-bold hover:bg-gray-900 hover:text-white transition">
                  Sign in
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-orange-500 text-white font-bold px-3 py-1 rounded-lg hover:bg-orange-600 transition">
                  Join
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <SettingsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default EquipmentRentalHeaderSection;
