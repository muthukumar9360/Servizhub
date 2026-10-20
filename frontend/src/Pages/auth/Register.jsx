import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { ShieldCheck, Mail, Phone, Lock, User, Wrench, ArrowRight } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import OtpInput from "../../components/common/OtpInput";
import axiosInstance from "../../api/axiosInstance";
import {
  setAuthLoading,
  setAuthError,
  clearAuthError,
  setTempRegistration,
  setPhoneVerificationStep,
  loginSuccess,
} from "../../store/slices/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, tempRegistrationId, registrationStep, devOtpInfo } =
    useSelector((state) => state.auth);

  const [otpValue, setOtpValue] = useState("");

  // Step 1 Form
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "USER",
    },
  });

  // Handle Step 1 Registration Submission
  const onStep1Submit = async (data) => {
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const response = await axiosInstance.post("/auth/register", data);
      dispatch(setTempRegistration(response.data.data));
    } catch (err) {
      dispatch(
        setAuthError(err.response?.data?.message || "Registration failed. Please check inputs.")
      );
    }
  };

  // Handle Email OTP Verification
  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) return;

    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const response = await axiosInstance.post("/auth/verify-email", {
        tempRegistrationId,
        otp: otpValue,
      });
      dispatch(setPhoneVerificationStep(response.data.data));
      setOtpValue("");
    } catch (err) {
      dispatch(
        setAuthError(err.response?.data?.message || "Invalid Email OTP code.")
      );
    }
  };

  // Handle Phone OTP Verification
  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) return;

    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const response = await axiosInstance.post("/auth/verify-phone", {
        tempRegistrationId,
        otp: otpValue,
      });
      dispatch(loginSuccess(response.data.data));
      navigate("/browse");
    } catch (err) {
      dispatch(
        setAuthError(err.response?.data?.message || "Invalid Phone OTP code.")
      );
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
          Servizio Equipment Rental
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your verified rental account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Development Mode Helper Badge */}
          {devOtpInfo && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-xs font-bold text-amber-800">
                [DEV MODE OTP CODE]: <span className="text-sm tracking-widest text-indigo-700">{devOtpInfo}</span>
              </span>
            </div>
          )}

          {/* STEP 1: INITIAL REGISTRATION */}
          {registrationStep === "IDLE" && (
            <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                placeholder="e.g. Karthik Muthu"
                required
                error={errors.fullName?.message}
                {...registerField("fullName", { required: "Full name is required" })}
              />

              <Input
                label="Username"
                icon={User}
                placeholder="e.g. karthik99"
                required
                error={errors.username?.message}
                {...registerField("username", { required: "Username is required" })}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="name@example.com"
                required
                error={errors.email?.message}
                {...registerField("email", { required: "Valid email required" })}
              />

              <Input
                label="Indian Phone Number"
                type="tel"
                icon={Phone}
                placeholder="e.g. 9876543210"
                required
                error={errors.phone?.message}
                {...registerField("phone", {
                  required: "Phone number required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "10-digit Indian phone starting with 6-9",
                  },
                })}
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                required
                error={errors.password?.message}
                {...registerField("password", {
                  required: "Password required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 font-semibold text-sm">
                    <input
                      type="radio"
                      value="USER"
                      className="mr-2 text-indigo-600"
                      {...registerField("role")}
                    />
                    Renter / User
                  </label>
                  <label className="flex items-center justify-center p-3 border rounded-xl cursor-pointer hover:bg-gray-50 font-semibold text-sm">
                    <input
                      type="radio"
                      value="PROVIDER"
                      className="mr-2 text-indigo-600"
                      {...registerField("role")}
                    />
                    Equipment Owner
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3 text-base font-bold"
              >
                Continue to Verification <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          )}

          {/* STEP 2: EMAIL OTP VERIFICATION */}
          {registrationStep === "EMAIL_VERIFICATION_PENDING" && (
            <form onSubmit={handleVerifyEmailOtp} className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verify Email Address</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit OTP code sent to your email.
              </p>

              <OtpInput length={6} value={otpValue} onChange={setOtpValue} />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={otpValue.length !== 6}
                className="w-full py-3 mt-4"
              >
                Verify Email OTP
              </Button>
            </form>
          )}

          {/* STEP 3: PHONE OTP VERIFICATION */}
          {registrationStep === "PHONE_VERIFICATION_PENDING" && (
            <form onSubmit={handleVerifyPhoneOtp} className="text-center">
              <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verify Phone Number</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit SMS OTP code sent to your mobile phone.
              </p>

              <OtpInput length={6} value={otpValue} onChange={setOtpValue} />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={otpValue.length !== 6}
                className="w-full py-3 mt-4"
              >
                Complete Registration
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
