import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [services, setServices] = useState([]);
  const [username, setUsername] = useState(null);

  const api = import.meta.env.VITE_SERVER_URL || "http://localhost:5024/api/v1";

  const handleLogout = () => {
    fetch(`${api}/auth/logout`, {
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
    fetch(`${api}/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setUsername(data.data.username || data.data.fullName);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));

    fetch(`${api}/categories`)
      .then((res) => res.json())
      .then((data) => setServices(data.data || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="relative text-white">
      {/* Background Video */}
      <video autoPlay muted loop className="video-bg">
        <source src="/Homevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Navbar */}
      <nav className="flex justify-evenly items-center py-4 bg-white text-black shadow-2xl border-b-2 border-gray-400 fixed top-0 left-0 w-full z-10">
        <div className="text-4xl font-extrabold text-green-600 tracking-tight">EQUIPORA</div>

        <div className="flex items-center space-x-8 text-sm font-semibold">
          <Link to="/browse" className="hover:underline">
            Explore Equipment
          </Link>
          <Link to="/browse" className="hover:underline">
            Categories
          </Link>
          <Link to="/provider/dashboard" className="hover:underline">
            List Equipment / Owner
          </Link>

          {username === "Guest" || !username ? (
            <>
              <Link to="/login">
                <button className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition font-bold">
                  Sign in
                </button>
              </Link>
              <Link to="/register">
                <button className="border-2 px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition font-bold">
                  Join
                </button>
              </Link>
              <h1 className="text-2xl font-bold">Guest</h1>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-green-600">{username}</h1>
              <button
                onClick={handleLogout}
                className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col justify-center h-[70vh] px-24 relative z-5 mt-16">
        <h1 className="text-7xl font-bold mb-4 drop-shadow-lg font-sans text-outline-white leading-tight">
          Rent the right equipment. <br /> When you need it.
        </h1>
        <p className="text-xl text-gray-200 font-semibold mb-6 max-w-2xl drop-shadow">
          Everything you need for construction, cinema, audio, farming, and power. Nothing you need to own.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-5xl flex bg-white rounded-2xl overflow-hidden shadow-lg mt-2">
          <input
            type="text"
            placeholder="Search excavators, 4K cameras, power tools, silent generators..."
            className="flex-grow px-8 py-4 text-black focus:outline-none text-base"
          />
          <button className="bg-black text-white px-6 py-4 flex items-center justify-center text-xl font-bold hover:bg-gray-900 transition">
            Search 🔍
          </button>
        </div>

        {/* Popular Categories */}
        <div className="mt-8 flex flex-wrap gap-3">
          {services.length > 0 ? (
            services.slice(0, 7).map((service, index) => (
              <Link key={index} to={`/browse?category=${service._id}`}>
                <button className="bg-black text-white text-base px-4 py-2 border-2 border-gray-700 rounded-2xl hover:bg-white hover:text-black hover:border-black transition font-semibold">
                  {service.mainCategory}
                </button>
              </Link>
            ))
          ) : (
            <p className="text-gray-300">Loading equipment categories...</p>
          )}
        </div>
      </section>

      {/* Brand Partners */}
      <section className="flex justify-start pl-24 -mt-16">
        <div className="flex justify-start gap-12 px-8 bg-black py-5 rounded-2xl shadow-lg border border-gray-800">
          <span>
            <img src="images/meta.png" alt="Meta" className="w-14 h-7" />
          </span>
          <span>
            <img src="images/google.png" alt="Google" className="w-14 h-8" />
          </span>
          <span>
            <img src="images/netflix.png" alt="Netflix" className="w-14 h-7" />
          </span>
          <span>
            <img src="images/p&g.png" alt="P&G" className="w-10 h-6" />
          </span>
          <span>
            <img src="images/paypal.png" alt="PayPal" className="w-14 h-8" />
          </span>
        </div>
      </section>

      {/* Custom Styles */}
      <style>{`
        .video-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 110%;
          object-fit: cover;
          z-index: -1;
        }
        .text-outline-white {
          -webkit-text-stroke: 2px white;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
