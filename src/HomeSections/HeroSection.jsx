import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [services, setServices] = useState([]);
  const [username, setUsername] = useState(null);

  const api=import.meta.env.VITE_SERVER_URL;


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
    // Fetch logged-in user
    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          console.log("Logged in user data:", data.user);
          setUsername(data.user.username);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));

    // Fetch services
    fetch(`${api}/services`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));
    

  }, []); // <--- single closing bracket for useEffect

  return (
    <div className="relative text-white">
      {/* Background Video */}
      <video autoPlay muted loop className="video-bg">
        <source src="/Homevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Navbar */}
      <nav className="flex justify-evenly items-center py-4 bg-white text-black shadow-2xl border-b-2 border-gray-400 fixed top-0 left-0 w-full z-10">
        <div className="text-4xl font-bold text-green-600">Servizio</div>

        <div className="flex items-center space-x-8 text-sm font-semibold">
          <Link to="#" className="hover:underline">
            Activate Pro
          </Link>
          <Link to="#" className="hover:underline">
            Explore
          </Link>
          <Link to="#" className="hover:underline">
            Become a Seller
          </Link>

          {username === "Guest" || !username ? (
            <>
              <Link to="/loginsignup">
                <button className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition">
                  Sign in
                </button>
              </Link>
              <Link to="/loginsignup">
                <button className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition">
                  Join
                </button>
              </Link>
              <h1 className="text-2xl font-bold">Guest</h1>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-red-500">{username}</h1>
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
        <h1 className="text-8xl font-bold mb-6 drop-shadow-lg font-sans text-outline-white">
          Our freelancers <br /> will take it from here
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-5xl flex bg-white rounded-2xl overflow-hidden shadow-lg mt-4">
          <input
            type="text"
            placeholder="Search for any service..."
            className="flex-grow px-8 py-3 text-black focus:outline-none"
          />
          <button className="bg-black text-white px-4 py-2 flex items-center justify-center text-xl">
            🔍
          </button>
        </div>

        {/* Popular Services */}
        <div className="mt-8 flex flex-wrap gap-3">
          {services.length > 0 ? (
            services.map((service, index) => (
              <button
                key={index}
                className="bg-black text-white text-xl px-4 py-2 border-2 rounded-2xl hover:bg-white hover:text-black hover:border-black"
              >
                {service.title}
              </button>
            ))
          ) : (
            <p className="text-gray-500">Loading services...</p>
          )}
        </div>
      </section>

      {/* Brand Logos */}
      <section className="flex justify-start pl-24 -mt-16">
        <div className="flex justify-start gap-12 px-8 bg-black py-5 rounded-2xl shadow-lg">
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
