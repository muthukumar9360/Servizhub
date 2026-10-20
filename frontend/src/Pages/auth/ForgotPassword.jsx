import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Wrench, ArrowRight } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import OtpInput from "../../components/common/OtpInput";
import axiosInstance from "../../api/axiosInstance";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("EMAIL"); // EMAIL -> OTP_RESET
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      setMessage("Password reset OTP sent to your email!");
      if (response.data.data?.devResetOtp) {
        setDevOtp(response.data.data.devResetOtp);
      }
      setStep("OTP_RESET");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert("Password reset successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg">
            <Wrench className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Reset Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl">{message}</div>}
          {devOtp && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-xl font-bold text-center">
              [DEV RESET OTP]: {devOtp}
            </div>
          )}

          {step === "EMAIL" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
              <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
                Send Reset Code <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Enter the 6-digit OTP code sent to {email}</p>
              <OtpInput length={6} value={otp} onChange={setOtp} />

              <Input
                label="New Password"
                type="password"
                icon={Lock}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Button type="submit" variant="primary" loading={loading} disabled={otp.length !== 6} className="w-full py-3">
                Confirm Password Reset
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            Remembered your password?{" "}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
