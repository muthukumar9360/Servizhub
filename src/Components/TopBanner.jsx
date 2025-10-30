// src/components/TopBanner.jsx
import React, { useEffect } from "react";

export default function TopBanner({ message, duration = 2000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // automatically hide after duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed mt-28 right-4 font-extrabold bg-red-500 text-white px-4 py-3 rounded-2xl shadow-2xl animate-slide-in text-3xl">
      {message}
    </div>
  );
}
