"use client";

import type { FC } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { recommendStrands } from "@/lib/strandMatcher";
import { BalancedText } from "@/components/BalancedText";

interface Props {
  result: AnalysisResult;
}

export const StrandRecommendations: FC<Props> = ({ result }) => {
  const matches = recommendStrands(result);

  return (
    <div className="mt-12 p-6 rounded-2xl border border-[#C4A882]/40 bg-gradient-to-br from-[#F9F7F3] to-[#C4A882]/10 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#6B543C]">
          Recommended strands
        </h4>
      </div>
      <BalancedText
        text="Based on this site's stack, motion, and layout — threads from the Araneae Index that would elevate it next."
        className="text-sm text-[#5A5653] mb-6 max-w-2xl mx-auto"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {matches.map((m) => (
          <a
            key={m.strand.id}
            href={`/#index`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/?strand=${m.strand.id}#index`;
            }}
            className="group block p-4 rounded-xl border border-[#E8E5DF] bg-white hover:border-[#E67E22]/50 hover:shadow-md transition-all text-center"
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <span className="font-bold text-[#2C2A29] group-hover:text-[#E67E22] transition-colors">
                {m.strand.name}
              </span>
              <span className="text-[10px] font-black text-[#8BA896] tabular-nums">{m.score} pts</span>
            </div>
            <BalancedText text={m.strand.shortDesc} className="text-xs text-[#5A5653] mb-2" />
            <BalancedText text={m.reasons[0]} className="text-[10px] text-[#9C7C5B] font-medium" />
          </a>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/compose"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22] transition-colors"
        >
          Open strand composer →
        </a>
      </div>
    </div>
  );
};
