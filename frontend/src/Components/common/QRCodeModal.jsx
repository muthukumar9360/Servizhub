import React from "react";
import Modal from "./Modal";
import { QrCode, ShieldCheck, Copy, Check } from "lucide-react";
import Button from "./Button";

const QRCodeModal = ({ isOpen, onClose, equipment }) => {
  const [copied, setCopied] = React.useState(false);

  if (!equipment) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(equipment.qrCodeIdentifier || `EQUIP-ASSET-${equipment._id.slice(-6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asset QR Identification Tag" maxWidth="max-w-md">
      <div className="text-center py-4 space-y-4">
        <div className="mx-auto w-48 h-48 bg-white p-4 rounded-3xl border-4 border-indigo-600 shadow-2xl flex flex-col items-center justify-center relative">
          <QrCode className="h-32 w-32 text-slate-900" />
          <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase mt-1">
            {equipment.qrCodeIdentifier || `EQUIP-ASSET-${equipment._id.slice(-6)}`}
          </span>
        </div>

        <div>
          <h4 className="font-extrabold text-base text-gray-900">{equipment.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">Serial No: <span className="font-bold text-gray-800">{equipment.serialNumber || "SN-2026-990012"}</span></p>
        </div>

        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium truncate max-w-[200px]">
            {equipment.qrCodeIdentifier || `EQUIP-ASSET-${equipment._id.slice(-6)}`}
          </span>
          <button
            onClick={handleCopy}
            className="text-indigo-600 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Tag"}
          </button>
        </div>

        <p className="text-[11px] text-gray-400">
          Depot personnel can scan this QR tag during handover and return inspections to verify asset authenticity.
        </p>

        <Button onClick={onClose} variant="secondary" className="w-full py-2.5 text-xs font-bold">
          Close QR Tag
        </Button>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
