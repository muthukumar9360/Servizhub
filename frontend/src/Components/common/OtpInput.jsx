import React, { useRef } from "react";

const OtpInput = ({ length = 6, value = "", onChange }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = value.split("");
    newOtp[index] = val.slice(-1);
    const updatedValue = newOtp.join("");
    onChange(updatedValue);

    // Auto focus next box
    if (val && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 my-4">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-14 text-center text-xl font-extrabold text-indigo-600 bg-gray-50 border border-gray-300 rounded-xl focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition shadow-sm"
        />
      ))}
    </div>
  );
};

export default OtpInput;
