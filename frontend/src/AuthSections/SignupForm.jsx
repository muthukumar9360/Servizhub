import { useState, useEffect } from "react";
import bgVideo from "/Vibe_coding_video.mp4";
import { useLocation } from "react-router-dom";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const api=import.meta.env.VITE_SERVER_URL;


  const location = useLocation();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phno: "",
    email: "",
    username: "",
    dob: "",
    userType: "",
    gender: "",
    password: "",
    confirmPassword: "",
    isGoogleAccount: false,
    googleId: "",
  });

  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  useEffect(() => {
    // Prefill Google data if available in URL params
    const params = new URLSearchParams(location.search);
    const googleEmail = params.get("email");
    const googleId = params.get("googleId");
    const googleFirstname = params.get("firstname");
    const googleLastname = params.get("lastname");
    const cleanedLastname = googleLastname && googleLastname !== "undefined" ? googleLastname : "";
    const googleDob = params.get("dob");

    if (googleEmail && googleId) {
      setFormData((prev) => ({
        ...prev,
        email: googleEmail,
        firstname: googleFirstname || "",
        lastname: cleanedLastname,
        dob: googleDob || "",
        isGoogleAccount: true,
        googleId: googleId,
      }));

      setIsGoogleSignup(true);
    }
  }, [location]);

  const [currentStep, setCurrentStep] = useState("Fill in your details");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isGoogleSignup) {
      try {
        const res = await fetch(`${api}/auth/google-signup`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          alert("✅ Account Created Successfully with Google!");
          window.location.href = "/";
        } else {
          alert(`❌ ${data.message}`);
        }
      } catch (error) {
        console.error("Google Signup error:", error);
        alert("❌ Something went wrong. Please try again.");
      }
    } else {
      setCurrentStep("Verifying Data...");

      try {
        const res = await fetch(`${api}/otp/send-otp`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          setCurrentStep("✅ OTP sent! Redirecting to OTP page...");
          localStorage.setItem("pendingSignup", JSON.stringify(formData));
          setTimeout(() => (window.location.href = "/loginsignup/otp"), 1500);
        } else {
          if (data.message === "User already exists") {
            setUserExists(true);
          } else {
            alert(`❌ ${data.message}`);
          }
          setCurrentStep(`❌ ${data.message}`);
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("❌ Something went wrong. Please try again.");
        setCurrentStep("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="relative h-screen lg:overflow-hidden overflow-visible">
      <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-[-1]">
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      <div className="flex justify-center items-center h-full relative z-10 p-6 lg:p-4">
        <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl p-4 lg:p-8 w-full max-w-md text-white shadow-lg border-2 border-white">
          <h2 className="text-3xl font-bold text-center lg:mb-3 mb-0">Create Account</h2>
          <p className="text-center text-yellow-300 font-semibold mb-3 lg:mb-6">{currentStep}</p>

          <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4" noValidate>
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                required
                readOnly={isGoogleSignup}
                className={`p-2 bg-transparent border border-white rounded-md placeholder-white ${isGoogleSignup ? "bg-gray-200 text-yellow-200" : ""}`}
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                required
                readOnly={isGoogleSignup && !!formData.lastname}
                className={`p-2 bg-transparent border border-white rounded-md placeholder-white ${isGoogleSignup ? "bg-gray-200 text-yellow-200" : ""}`}
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              <input
                type="tel"
                name="phno"
                placeholder="Phone Number"
                value={formData.phno}
                onChange={handleChange}
                className="p-2 bg-transparent border border-white rounded-md placeholder-white"
                required={!isGoogleSignup}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly={isGoogleSignup}
                className={`p-2 bg-transparent border border-white rounded-md placeholder-white ${isGoogleSignup ? "bg-gray-200 text-yellow-200" : ""}`}
              />
            </div>

            {/* Username & DOB */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="p-2 bg-transparent border border-white rounded-md placeholder-white"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required={!isGoogleSignup}
                className="p-2 bg-transparent border border-white rounded-md text-white [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>

            {/* User Type */}
            <div className="lg:space-y-1">
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

            {/* Gender */}
            <div className="lg:space-y-1">
              <label className="text-sm">Gender</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    required
                    className="mr-2"
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    required
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Passwords for normal signup */}
            {!isGoogleSignup && (
              <>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2.5 right-3 cursor-pointer select-none"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white"
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-2.5 right-3 cursor-pointer select-none"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md text-white font-semibold"
            >
              Sign Up
            </button>

            {/* Links */}
            <p className="text-center text-sm mt-6">
              Registered User?{" "}
              <a
                href="/loginsignup/login"
                className="text-blue-300 hover:underline"
              >
                Login
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

            {userExists && (
              <div className="mt-4 text-center">
                <p className="text-yellow-300 mb-2">User already exists. Please login.</p>
                <button
                  onClick={() => (window.location.href = "/loginsignup/login")}
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold"
                >
                  Go to Login
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
