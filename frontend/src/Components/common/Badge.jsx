import React from "react";

const Badge = ({ children, status, className = "" }) => {
  const statusStyles = {
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    AVAILABLE: "bg-green-100 text-green-800 border-green-200",
    ACTIVE: "bg-blue-100 text-blue-800 border-blue-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PENDING_APPROVAL: "bg-amber-100 text-amber-800 border-amber-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    DAMAGED: "bg-rose-100 text-rose-800 border-rose-200",
    DISPUTED: "bg-purple-100 text-purple-800 border-purple-200",
    REPORTED: "bg-orange-100 text-orange-800 border-orange-200",
    USER_RESPONSIBLE: "bg-red-100 text-red-800 border-red-200",
    RESOLVED: "bg-teal-100 text-teal-800 border-teal-200",
  };

  const style =
    statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      {children || status}
    </span>
  );
};

export default Badge;
