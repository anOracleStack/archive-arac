"use client";

import { useCallback, useState, type FC } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { exportReportMarkdown, saveToVault } from "@/lib/reportStore";
import { analyzeShareUrl, shareUrlFromResult } from "@/lib/reportShare";
import { CopyToast } from "@/components/CopyToast";

interface Props {
  result: AnalysisResult;
}

export const ReportActions: FC<Props> = ({ result }) => {
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const handleSave = () => {
    const entry = saveToVault(result);
    setToast(`Saved to Vault as “${entry.label}”`);
  };

  const handleCopy = async () => {
    const md = exportReportMarkdown(result);
    await navigator.clipboard.writeText(md);
    setToast("Report copied as Markdown");
  };

  const handleShareReport = async () => {
    const link = shareUrlFromResult(result, window.location.origin);
    await navigator.clipboard.writeText(link);
    setToast("Report link copied — opens summary view");
  };

  const handleShareAnalyze = async () => {
    const link = analyzeShareUrl(result, window.location.origin);
    await navigator.clipboard.writeText(link);
    setToast("Analyze link copied — re-runs on open");
  };

  return (
    <>
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
          onClick={handleShareReport}
          className="px-4 py-2 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest text-[#2C2A29] hover:border-[#E67E22] transition-colors"
        >
          Copy report link
        </button>
        <button
          type="button"
          onClick={handleShareAnalyze}
          className="px-4 py-2 rounded-xl bg-[#E67E22]/10 border border-[#E67E22]/30 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:bg-[#E67E22]/20 transition-colors"
        >
          Copy analyze link
        </button>
        <a
          href="/vault"
          className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#5A5653] hover:text-[#E67E22] transition-colors"
        >
          Open vault →
        </a>
      </div>
      <CopyToast message={toast} onClear={clearToast} />
    </>
  );
};
