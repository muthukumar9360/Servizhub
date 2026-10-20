import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = React.forwardRef(
  (
    {
      label,
      type = "text",
      error,
      icon: Icon,
      className = "",
      placeholder = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={`block w-full rounded-lg border text-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              Icon ? "pl-10" : "pl-3"
            } ${isPassword ? "pr-10" : "pr-3"} py-2.5 ${
              error
                ? "border-red-500 text-red-900 focus:border-red-500"
                : "border-gray-300 text-gray-900 focus:border-indigo-500"
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
