import React, { useState, useEffect } from "react";
import { Search, Mic, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import sampleImg from "../JustDialHome/assets/b2bperson1.jpg";
import SettingsSidebar from "../Components/SettingsSidebar";

const BusinessHeaderSection = () => {
  const [city, setCity] = useState("Mumbai");
  const [error, setError] = useState("");
  const [username, setUsername] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const api = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  // 🔐 Logout
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

  // 👤 Session + city
  useEffect(() => {
    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUsername(data.user.username);
      })
      .catch(() => setUsername("Guest"));

    setCity("Tirunelveli");
  }, []);

  // ❌ Close dropdown on outside click
  useEffect(() => {
    const close = () => setShowResults(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // 🔍 Search handler
  const handleSearch = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const res = await fetch(`${api}/search/business?q=${text}`);

      if (!res.ok) throw new Error("Search API failed");

      const data = await res.json();
      setResults(data || []);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setShowResults(false);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm relative">
      <div className="flex items-center justify-between mx-5 py-5">

        {/* 🔵 Logo */}
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold">
            <span className="text-blue-600">Serv</span>
            <span className="text-orange-500">izio</span>
          </h1>
        </div>

        {/* 🔍 Search */}
        <div className="flex flex-col justify-center w-1/2 relative">
          <p className="text-lg font-semibold mb-1">
            Search across <span className="text-blue-600">4.9 Crore+</span> Businesses
          </p>

          <div className="flex items-center">
            <MapPin size={28} className="text-orange-400 mr-2" />

            <input
              type="text"
              placeholder={city}
              className="border rounded-l-md py-2 px-3 w-1/3 focus:outline-none text-lg"
            />

            <div
              className="relative flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for Spa, Banquet halls, Decorators..."
                className="border-y border-x py-2 px-3 w-full focus:outline-none text-lg"
              />

              {/* 🔽 Dropdown */}
              {showResults && results.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white shadow-lg rounded-lg z-50 max-h-72 overflow-y-auto">
                  {results.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setShowResults(false);
                        setQuery("");
                        navigate(`/SubcategoryDetails/${item._id}`);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <p className="font-semibold text-gray-800">
                        {item.name}
                      </p>

                      <div className="flex gap-2 items-center mt-1">
                        {item.subCategoryName && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {item.subCategoryName}
                          </span>
                        )}
                        {item.mainCategoryName && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                            {item.mainCategoryName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        {item.locationDetails?.area},{" "}
                        {item.locationDetails?.city}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="bg-white border-y border-l px-3 py-2 flex items-center">
              <Mic className="text-blue-600 w-6 h-6" />
            </button>
            <button
              className="bg-orange-500 text-white px-3 py-2 rounded-r-md flex items-center"
              onClick={() => handleSearch(query)}
            >
              <Search className="w-6 h-6" />
            </button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* 👤 User */}
        <div className="flex text-md text-gray-700 gap-5 items-center">
          <select defaultValue="java">
            <option value="java">English</option>
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
              <h1 className="text-xl font-bold">Guest</h1>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-red-500">
                {username}
              </h1>
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
      </div>

      {/* ⚙️ Sidebar */}
      <SettingsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
};

export default BusinessHeaderSection;
