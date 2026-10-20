import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OfflineToggleButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname === "/") {
      navigate("/JustDialPages");
    } else {
      navigate("/");
    }
  };

  // Button name derived directly from pathname
  const name =
    location.pathname === "/"
      ? "Offline Services"
      : location.pathname === "/JustDialPages"
      ? "Online Services"
      : "Offline Services";

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-16 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 z-50"
    >
      {name}
    </button>
  );
};

export default OfflineToggleButton;
