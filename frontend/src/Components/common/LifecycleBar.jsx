import React from "react";
import { CheckCircle2, Clock, ShieldAlert, ArrowRight } from "lucide-react";

const steps = [
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "ACTIVE", label: "Handover / Active" },
  { id: "RETURN_REQUESTED", label: "Return Requested" },
  { id: "INSPECTED", label: "Inspected" },
  { id: "COMPLETED", label: "Completed" },
];

const LifecycleBar = ({ currentStatus }) => {
  const getStepIndex = (status) => {
    switch (status) {
      case "PENDING":
      case "CONFIRMED":
        return 0;
      case "ACTIVE":
        return 1;
      case "RETURN_REQUESTED":
        return 2;
      case "INSPECTED":
      case "DISPUTED":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  if (currentStatus === "CANCELLED") {
    return (
      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold flex items-center justify-center gap-2">
        <ShieldAlert className="h-4 w-4 text-red-400" /> Booking Cancelled & Refunded
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isDone = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition duration-300 ${
                    isDone
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  } ${isCurrent ? "ring-4 ring-indigo-500/20 scale-110" : ""}`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-extrabold mt-2 tracking-tight ${
                    isCurrent ? "text-indigo-400 font-black" : isDone ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition duration-300 ${
                    idx < activeIndex ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LifecycleBar;
