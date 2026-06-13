"use client";

import { useCallback, useState, type FC } from "react";
import type { AnalysisResult } from "@/types/analysis";
import type { SiteComparison } from "@/lib/compareSites";
import { BalancedText } from "@/components/BalancedText";
import { compareShareUrl } from "@/lib/compareUrlSync";
import { CopyToast } from "@/components/CopyToast";

interface Props {
  a: AnalysisResult;
  b: AnalysisResult;
  comparison: SiteComparison;
}

function DiffPill({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE] mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {items.map((item) => (
          <span
            key={item}
            className="px-2 py-0.5 rounded-md bg-[#F9F7F3] border border-[#E8E5DF] text-[10px] font-medium text-[#5A5653]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export const CompareResults: FC<Props> = ({ a, b, comparison }) => {
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const winner =
    comparison.scoreDelta > 5 ? b.hostname : comparison.scoreDelta < -5 ? a.hostname : null;

  const handleShareCompare = async () => {
    const link = compareShareUrl(a.url, b.url, window.location.origin);
    await navigator.clipboard.writeText(link);
    setToast("Compare link copied — opens both sites side-by-side");
  };

  return (
    <>
      <div className="max-w-5xl mx-auto mt-16 space-y-10 text-center">
        <div className="grid md:grid-cols-2 gap-6">
          {[a, b].map((site) => (
            <div
              key={site.url}
              className="p-6 rounded-2xl border border-[#E8E5DF] bg-white shadow-sm"
            >
              <h3 className="font-bold text-lg mb-1 truncate">{site.title}</h3>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#E67E22] hover:underline"
              >
                {site.hostname} ↗
              </a>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div
                  className={`text-3xl font-black ${
                    site.overview.score >= 70
                      ? "text-[#8BA896]"
                      : site.overview.score >= 45
                        ? "text-[#E67E22]"
                        : "text-red-400"
                  }`}
                >
                  {site.overview.score}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE]">
                    Vibe
                  </p>
                  <p className="text-sm text-[#5A5653]">{site.overview.vibe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-[#C4A882]/40 bg-[#C4A882]/5">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#6B543C] mb-4">
            Weave delta
          </h4>
          {winner && (
            <BalancedText
              text={`${winner} leads on innovation score${
                comparison.scoreDelta !== 0
                  ? ` (${comparison.scoreDelta > 0 ? "+" : ""}${comparison.scoreDelta} pts)`
                  : ""
              }`}
              className="text-lg font-bold text-[#2C2A29] mb-4"
            />
          )}
          <ul className="space-y-4 mb-6 list-none">
            {comparison.highlights.map((h) => (
              <li key={h}>
                <BalancedText text={h} className="text-sm text-[#5A5653]" />
              </li>
            ))}
          </ul>
          <div className="grid sm:grid-cols-2 gap-6">
            <DiffPill label={`Only on ${a.hostname}`} items={comparison.libraries.onlyA} />
            <DiffPill label={`Only on ${b.hostname}`} items={comparison.libraries.onlyB} />
            <DiffPill label="Shared libraries" items={comparison.libraries.shared} />
            <DiffPill label="Shared frameworks" items={comparison.frameworks.shared} />
          </div>
          <BalancedText
            text={`A11y: ${comparison.accessibility.a} vs ${comparison.accessibility.b} · DOM Δ ${
              comparison.performance.domDelta > 0 ? "+" : ""
            }${comparison.performance.domDelta}`}
            className="mt-6 text-xs text-[#B8B5AE] mx-auto"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => void handleShareCompare()}
            className="px-4 py-2 rounded-xl bg-[#E67E22]/10 border border-[#E67E22]/30 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:bg-[#E67E22]/20 transition-colors"
          >
            Copy compare link
          </button>
        </div>
      </div>
      <CopyToast message={toast} onClear={clearToast} />
    </>
  );
};
