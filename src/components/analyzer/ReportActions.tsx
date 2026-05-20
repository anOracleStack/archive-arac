"use client";

import { useState, type FC } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { exportReportMarkdown, saveToVault } from "@/lib/reportStore";
import { shareUrlFromResult } from "@/lib/reportShare";

interface Props {
  result: AnalysisResult;
}

export const ReportActions: FC<Props> = ({ result }) => {
  const [status, setStatus] = useState<string | null>(null);

  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2800);
  };

  const handleSave = () => {
    const entry = saveToVault(result);
    flash(`Saved to Vault as “${entry.label}”`);
  };

  const handleCopy = async () => {
    const md = exportReportMarkdown(result);
    await navigator.clipboard.writeText(md);
    flash("Report copied as Markdown");
  };

  const handleShare = async () => {
    const link = shareUrlFromResult(result, window.location.origin);
    await navigator.clipboard.writeText(link);
    flash("Share link copied");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-[#E8E5DF]">
      <button
        type="button"
        onClick={handleSave}
        className="px-4 py-2 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest text-[#2C2A29] hover:border-[#E67E22] transition-colors"
      >
        Save to vault
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="px-4 py-2 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest text-[#2C2A29] hover:border-[#E67E22] transition-colors"
      >
        Copy report
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="px-4 py-2 rounded-xl bg-[#E67E22]/10 border border-[#E67E22]/30 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:bg-[#E67E22]/20 transition-colors"
      >
        Copy share link
      </button>
      <a
        href="/vault"
        className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#5A5653] hover:text-[#E67E22] transition-colors"
      >
        Open vault →
      </a>
      {status && (
        <span className="text-xs text-[#8BA896] font-medium animate-pulse">{status}</span>
      )}
    </div>
  );
};
