import React, { useState } from "react";
import bgVideo from "/Vibe_coding_video.mp4";
import { useLocation } from "react-router-dom";

const LoginForm = () => {

  const api = import.meta.env.VITE_SERVER_URL;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const chat = query.get("chat");
  const providerId = query.get("providerId");
  const offline = query.get("offline");

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phno: "",
    email: "",
    userType: "",
    password: "",
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${api}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phno: formData.phno
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.message}`);
        if(offline==="true"){
          window.location.href = "/JustDialPages";
        }
        else if (chat === "true" && providerId) {
          window.location.href = `/userprofile/${providerId}`;
        } else {
          window.location.href = "/";
        }
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Login Form */}
      <div className="flex justify-center items-center h-full relative z-10 p-6">
        <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl p-4 lg:p-8 w-full max-w-md text-white shadow-lg border-2 border-white">
          <h2 className="text-3xl font-bold text-center mt-5 lg:mt-0 mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="p-2 bg-transparent border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <input
                type="tel"
                name="phno"
                placeholder="Phone Number"
                value={formData.phno}
                onChange={handleChange}
                required
                className="p-2 bg-transparent border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-2 bg-transparent border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white"
              />
            </div>

            {/* User Type */}
            <div className="space-y-1">
              <label className="text-sm">User Type</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={formData.userType === "user"}
                    onChange={handleChange}
                    required
                    className="mr-2"
                  />
                  User
                </label>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="provider"
                    checked={formData.userType === "provider"}
                    onChange={handleChange}
                    required
                    className="mr-2"
                  />
                  Provider
                </label>
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 bg-transparent border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white"
              />
              <span
                onClick={togglePassword}
                className="absolute top-2.5 right-3 cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md text-white font-semibold"
            >
              Login
            </button>

            {/* Links */}
            <p className="text-center text-sm mt-6">
              New User?{" "}
              <a
                href="/loginsignup/signup"
                className="text-blue-300 hover:underline"
              >
                Sign up
              </a>
            </p>
            <p className="text-center text-sm mt-3">
              Forget Password?{" "}
              <a
                href="/loginsignup/forgot"
                className="text-blue-300 hover:underline"
              >
                Click Here
              </a>
            </p>
            <p className="text-center text-sm mt-3">
              Home Page?{" "}
              <a
                href="/"
                className="text-blue-300 hover:underline"
              >
                Click Here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
