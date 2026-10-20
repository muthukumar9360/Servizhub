import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { User, Lock, Wrench, ArrowRight } from "lucide-react";
import Input from "../../Components/common/Input";
import Button from "../../Components/common/Button";
import axiosInstance from "../../api/axiosInstance";
import {
  setAuthLoading,
  setAuthError,
  clearAuthError,
  loginSuccess,
} from "../../store/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const response = await axiosInstance.post("/auth/login", data);
      dispatch(loginSuccess(response.data.data));

      const role = response.data.data.user?.role;
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "PROVIDER") {
        navigate("/provider/dashboard");
      } else {
        navigate("/browse");
      }
    } catch (err) {
      dispatch(
        setAuthError(err.response?.data?.message || "Invalid login credentials.")
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
          Welcome Back to Servizio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your equipment rental account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email, Username or Phone"
              icon={User}
              placeholder="Enter your registered login ID"
              required
              error={errors.login?.message}
              {...register("login", { required: "Login ID is required" })}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              required
              error={errors.password?.message}
              {...register("password", { required: "Password is required" })}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2 text-indigo-600 rounded" defaultChecked />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-bold text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3 text-base font-bold"
            >
              Sign In <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Quick Demo Test Logins */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center font-bold text-gray-500 mb-3">
              [DEMO QUICK LOGIN CREDENTIALS]
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onSubmit({ login: "user@servizio.com", password: "User@123" });
                }}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-semibold"
              >
                Renter User
              </button>
              <button
                type="button"
                onClick={() => {
                  onSubmit({ login: "provider@servizio.com", password: "Provider@123" });
                }}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-semibold"
              >
                Equipment Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  onSubmit({ login: "admin@servizio.com", password: "Admin@123" });
                }}
                className="p-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-semibold"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  onSubmit({ login: "superadmin@servizio.com", password: "SuperAdmin@123" });
                }}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-700 font-semibold"
              >
                Super Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
