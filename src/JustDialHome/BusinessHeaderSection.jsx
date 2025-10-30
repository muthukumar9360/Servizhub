import React, { useState, useEffect } from "react";
import { Search, Mic, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import sampleImg from "../JustDialHome/assets/b2bperson1.jpg"
import SettingsSidebar from "../Components/SettingsSidebar";

const BusinessHeaderSection = () => {
  const [city, setCity] = useState("Mumbai"); // default placeholder
  const [error, setError] = useState("");
  const [username, setUsername] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const api = import.meta.env.VITE_SERVER_URL;

  const handleLogout = () => {
    fetch(`${api}/session/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        alert("Logged out successfully...");
        setUsername("Guest");
      })
      .catch((err) => console.error("Error logging out:", err));
  };

  useEffect(() => {

    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          console.log("Logged in user data:", data.user);
          setUsername(data.user.username);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));

      setCity("Tirunelveli");
    // Check if geolocation is available
    /*if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse Geocoding using OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          // Nominatim returns city in different properties
          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county;

          if (cityName) setCity(cityName);
        } catch (err) {
          console.error("Failed to get city name:", err);
        }
      },
      (err) => {
        console.error("Error getting location:", err);
        setError(err.message);
      },
      { enableHighAccuracy: true }
    );*/
  }, []);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-around mx-5 py-5">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold">
            <span className="text-blue-600">Serv</span>
            <span className="text-orange-500">izio</span>
          </h1>
        </div>

        {/* Middle Section - Search */}
        <div className="flex flex-col ml-8 justify-center">
          <p className="text-lg font-semibold">
            Search across <span className="text-blue-600">4.9 Crore+</span>{" "}
            Businesses
          </p>
          <div className="flex mt-2 items-center">
            {/* Location Input */}
            <label htmlFor="location">
              <MapPin size={28} className="text-orange-400 mr-3" />
            </label>
            <div className="w-3/4">
              <input
                type="text"
                placeholder={city}
                id="location"
                className="border rounded-l-md py-1 pl-5 w-1/3 focus:outline-none text-xl"
              />
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search for Spa & Salons"
                className=" border-x-black border-y-black border-1 py-1 pl-5 flex-1 focus:outline-none text-xl"
              />
            </div>
            {/* Mic + Search Button */}
            <button className="bg-white border-y border-l px-3 py-2 flex items-center">
              <Mic className="text-blue-600 w-6 h-6" />
            </button>
            <button className="bg-orange-500 text-white px-3 py-2 rounded-r-md flex items-center">
              <Search className="w-6 h-6" />
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Right Section */}
        <div className="flex text-md text-gray-700 justify-start gap-5 items-center">
          <select id="language" name="language">
            <option value="java" selected>
              English
            </option>
            <option value="python">Hindi</option>
            <option value="c">Tamil</option>
          </select>
          <a href="#">We are Hiring</a>
          {username === "Guest" || !username ? (
            <>
              <Link to="/loginsignup?offline=true">
                <button className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition">
                  Sign in
                </button>
              </Link>
              <Link to="/loginsignup?offline=true">
                <button className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition">
                  Join
                </button>
              </Link>
              <h1 className="text-2xl font-bold">Guest</h1>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-red-500 pb-1">{username}</h1>
              <button
                onClick={handleLogout}
                className="text-sm border-2 px-3 py-1 rounded hover:bg-green-600 hover:text-white transition"
              >
                Logout
              </button>
              <img
                src={sampleImg}
                alt="Profile"
                className="rounded-full w-8 h-8 cursor-pointer hover:ring-2 hover:ring-red-400"
                onClick={() => setIsSidebarOpen(true)}
              />
            </>
          )}
        </div>
        {/* Sidebar Overlay */}
        <SettingsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </header>
  );
};

export default BusinessHeaderSection;
