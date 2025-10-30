import React, { useState, useEffect } from "react";
import videoBg from "/Vibe_coding_video.mp4";

const ForgetForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setPhno] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [firstAttempt, setFirstAttempt] = useState(true);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState("Start By Entering Details");

  const api=import.meta.env.VITE_SERVER_URL;

  // Timer
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Send or Resend OTP (combined)
  const sendOTP = async () => {
    if (!username || !email || !phno) {
      setCurrentStep("All fields are required!");
      return;
    }

    try {
      if (firstAttempt) {
        setCurrentStep("Sending OTP...");
      } else {
        setCurrentStep("Resending OTP...");
      }

      const res = await fetch(`${api}/forget/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phno }),
      });
      const data = await res.json();

      if (res.ok) {
        if (firstAttempt) {
          setMessage("✅ OTP sent successfully!");
          setCurrentStep("✅ OTP Sent. Check Your Email");
          setFirstAttempt(false); // flip after first successful send
        } else {
          setMessage("🔄 New OTP sent!");
          setCurrentStep("🔄 New OTP Sent. Check Your Email.");
        }
        setOtpSent(true);
        setTimeLeft(60); // reset countdown
      } else {
        setMessage("❌ " + data.message);
        setCurrentStep("❌ Failed to send OTP.");
      }
    } catch (err) {
      setMessage("❌ Server error!");
      setCurrentStep("❌ Error while sending OTP.");
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp) {
      setCurrentStep("Please Enter OTP!");
      return;
    }
    try {
      setCurrentStep("Verifying OTP...");
      const res = await fetch(`${api}/forget/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ OTP Verified!");
        setCurrentStep("✅ OTP verified. Enter New Password.");
        setOtpVerified(true);
        setTimeLeft(0);
      } else {
        setMessage("❌ " + data.message);
        setCurrentStep("❌ OTP verification failed.");
      }
    } catch (err) {
      setMessage("❌ Server error!");
      setCurrentStep("❌ Error while verifying OTP.");
    }
  };

  // Reset Password
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setCurrentStep("Password fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setCurrentStep("Passwords do not match!");
      return;
    }
    try {
      setCurrentStep("Resetting password...");
      const res = await fetch(`${api}/forget/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successful!");
        setCurrentStep("✅ Password reset successful!.");
        setTimeout(() => (window.location.href = "/loginsignup/login"), 1500);
      } else {
        setMessage("❌ " + data.message);
        setCurrentStep("❌ Password reset failed.");
      }
    } catch (err) {
      setMessage("❌ Server error!");
      setCurrentStep("❌ Error while resetting password.");
    }
  };

  const togglePassword = (id) => {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
  };

  return (
    <div className="relative h-screen overflow-y-auto text-white">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Main Form */}
      <div className="flex justify-center items-center min-h-screen relative z-10 py-10">
        <div className="bg-black bg-opacity-60 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border-2 border-white shadow-lg space-y-6">
          <h2 className="text-3xl font-bold text-center mb-2">
            Forgot Password
          </h2>
          {/* Status Tracker */}
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-yellow-300">{currentStep}</p>
          </div>

          {/* Step 1: Username, Email, Phone */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={otpVerified}   // 🔒 disable after OTP verified
              className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white disabled:opacity-50"
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpVerified}   // 🔒
              className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white disabled:opacity-50"
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phno}
              onChange={(e) => setPhno(e.target.value)}
              disabled={otpVerified}   // 🔒
              className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white disabled:opacity-50"
            />

            {/* Send / Resend OTP */}
            <button
              onClick={sendOTP}
              disabled={otpVerified || timeLeft > 0}
              className={`w-full py-2 rounded-md font-semibold 
    ${timeLeft > 0 || otpVerified
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {timeLeft > 0
                ? `Resend in ${timeLeft}s`
                : firstAttempt
                  ? "Send OTP"
                  : "Resend OTP"}
            </button>

          </div>

          {/* Step 2: OTP */}
          {otpSent && (
            <div className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={otpVerified} // 🔒 disable after verified
                className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white disabled:opacity-50"
              />
              <button
                onClick={verifyOTP}
                disabled={otpVerified} // 🔒 disable after verified
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50"
              >
                Verify OTP
              </button>
            </div>
          )}


          {/* Step 3: Password Reset */}
          {otpVerified && (
            <div className="space-y-4 mt-6">
              <div className="relative">
                <input
                  type="password"
                  id="newpassword"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white"
                />
                <span
                  className="absolute top-2.5 right-3 cursor-pointer"
                  onClick={() => togglePassword("newpassword")}
                >
                  👁️
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="confirmpassword"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 bg-transparent border border-white rounded-md placeholder-white"
                />
                <span
                  className="absolute top-2.5 right-3 cursor-pointer"
                  onClick={() => togglePassword("confirmpassword")}
                >
                  👁️
                </span>
              </div>
              <button
                onClick={resetPassword}
                className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold"
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetForm;
