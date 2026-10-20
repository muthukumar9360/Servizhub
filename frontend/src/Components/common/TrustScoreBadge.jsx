import React from "react";
import { ShieldCheck, Star } from "lucide-react";

const TrustScoreBadge = ({ trustScore = 92, trustTier = "TRUSTED" }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
      <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-xs">
        <ShieldCheck className="h-4 w-4" />
        <span>{trustScore} / 100</span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
        ★ {trustTier.replace(/_/g, " ")}
      </span>
    </div>
  );
};

export default TrustScoreBadge;
