import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import bgVideo from "/Vibe_coding_video.mp4";

const OtpPage = ({ onVerified }) => {
  const storedData = JSON.parse(localStorage.getItem("pendingSignup") || "{}");
  const email = storedData.email;
  const username = storedData.username;
  const { providerId } = useParams();
  const { chat } = useParams();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("📩 Enter the OTP sent to your email");
  const [canVerify, setCanVerify] = useState(true); // controls verify button
  const firstInputRef = useRef(null);

  const api = import.meta.env.VITE_SERVER_URL;

  // Timer countdown
  useEffect(() => {
    if (timeLeft === 0) {
      setCanVerify(false); // disable verify when timer hits 0
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle OTP input
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && element.nextSibling) element.nextSibling.focus();
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canVerify) return;

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setStatusMessage("⚠️ Please enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("🔄 Verifying OTP...");

      const res = await fetch(`${api}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
        credentials: "include"
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Account Created Successfully!.");
        setStatusMessage("✅ OTP Verified! Redirecting...");
        localStorage.removeItem("pendingSignup");
        setTimeout(() => {
          onVerified && onVerified();
          if (chat === "true" && providerId) {
            window.location.href = `/chat/${providerId}`;
          }
          else {
            window.location.href = `/`;
          }
        }, 1500);
      } else {
        setStatusMessage("❌ Invalid OTP. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Verify OTP error:", err);
      setStatusMessage("🚨 Server error. Please try again.");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timeLeft > 0) return;
    try {
      setResending(true);
      setStatusMessage("📤 Resending OTP...");

      const res = await fetch(`${api}/otp/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setResending(false);

      if (res.ok) {
        setStatusMessage("✅ OTP resent successfully. Please check your email.");
        setTimeLeft(60);
        setOtp(new Array(6).fill(""));
        setCanVerify(true); // allow verify again after resend
        if (firstInputRef.current) firstInputRef.current.focus();
      } else {
        setStatusMessage("❌ " + data.message);
      }
    } catch (err) {
      setResending(false);
      console.error("Resend OTP error:", err);
      setStatusMessage("🚨 Server error while resending.");
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

      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      <div className="flex justify-center items-center h-full relative z-10 p-4">
        <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl p-8 w-full max-w-md text-white shadow-lg border-2 border-white text-center">
          <h2 className="text-3xl font-bold mb-2">Enter OTP</h2>

          <p className="mb-4">
            OTP sent to <b>{email}</b>
          </p>

          <p className="text-sm text-blue-300 mb-6 mt-3">{statusMessage}</p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={val}
                  ref={idx === 0 ? firstInputRef : null}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                      const prev = e.target.previousSibling;
                      if (prev) prev.focus(); // move cursor back
                    }
                  }}
                  className="w-12 h-14 text-xl text-center bg-transparent border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || !canVerify}
              className={`w-full py-2 rounded-md text-white font-semibold transition 
                ${loading || !canVerify
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <p className="mt-6 text-sm">
            ⏳ Expires in :{" "}
            <span className="text-red-400 font-semibold">{timeLeft}</span> s
          </p>

          <button
            onClick={handleResend}
            disabled={timeLeft > 0 || resending}
            className={`mt-5 text-white text-2xl hover:underline ${timeLeft > 0 || resending ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
          <span className="text-2xl text-white px-5">|</span>
          <a
            href="/loginsignup/login"
            className="text-2xl mt-5 hover:underline text-white"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
