import React from "react";
import Modal from "./Modal";
import { ShieldCheck, AlertTriangle, CheckCircle } from "lucide-react";
import Button from "./Button";
import Badge from "./Badge";

const InspectionComparisonModal = ({ isOpen, onClose, handover, returnInspection }) => {
  if (!handover && !returnInspection) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Handover vs Return Inspection Comparison" maxWidth="max-w-3xl">
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Handover Side */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="font-extrabold text-xs text-indigo-600 uppercase tracking-wider">
                Pre-Rental Handover Inspection
              </span>
              <Badge status={handover?.condition || "EXCELLENT"} />
            </div>

            <div className="h-44 bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={handover?.inspectionImages[0]?.url || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"}
                alt="Handover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs space-y-1 text-gray-700">
              <p><span className="font-bold">Serial No Match:</span> {handover?.serialNumber || "SN-2026-990012"}</p>
              <p><span className="font-bold">Meter Reading:</span> {handover?.meterReading || "120 Hours"}</p>
              <p className="text-gray-500 italic mt-1">"{handover?.notes || "No issues pre-rental."}"</p>
            </div>
          </div>

          {/* Return Side */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="font-extrabold text-xs text-purple-600 uppercase tracking-wider">
                Post-Rental Return Inspection
              </span>
              <Badge status={returnInspection?.condition || "EXCELLENT"} />
            </div>

            <div className="h-44 bg-gray-200 rounded-xl overflow-hidden">
              <img
                src={returnInspection?.returnImages[0]?.url || handover?.inspectionImages[0]?.url}
                alt="Return"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs space-y-1 text-gray-700">
              <p>
                <span className="font-bold">Damage Detected:</span>{" "}
                {returnInspection?.damageDetected ? (
                  <span className="text-red-600 font-extrabold inline-flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> YES
                  </span>
                ) : (
                  <span className="text-green-600 font-extrabold inline-flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> NO DAMAGE
                  </span>
                )}
              </p>
              <p className="text-gray-500 italic mt-1">"{returnInspection?.notes || "Clean return inspection."}"</p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full py-2.5 text-xs font-bold">
          Close Inspection Comparison
        </Button>
      </div>
    </Modal>
  );
};

export default InspectionComparisonModal;
