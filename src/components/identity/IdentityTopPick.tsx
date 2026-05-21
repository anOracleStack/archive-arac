"use client";

import Link from "next/link";
import type { IdentityCandidate, IdentityScanResult } from "@/types/identity";

interface Props {
  scan: IdentityScanResult;
  candidate: IdentityCandidate;
  onLock: () => void;
  onExport: () => void;
}

export function IdentityTopPick({ scan, candidate, onLock, onExport }: Props) {
  const rationale = scan.meta.topPick?.rationale ?? candidate.highlights[0];

  return (
    <section className="mb-10 p-6 md:p-8 rounded-2xl border-2 border-[#E67E22]/40 bg-gradient-to-br from-[#E67E22]/8 to-white shadow-lg">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-3">
        Top pick · {scan.tier}-option scan
      </p>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{candidate.label}</h2>
          <p className="text-sm text-[#5A5653] mt-1 font-mono">{candidate.slug}</p>
          <p className="text-sm text-[#5A5653] mt-4 max-w-xl">{rationale}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {candidate.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[10px] px-2 py-1 rounded-full bg-[#E67E22]/10 text-[#6B543C] border border-[#E67E22]/20"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="text-center shrink-0">
          <p className="text-5xl font-black text-[#E67E22]">{candidate.score}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE]">match</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[#E8E5DF]">
        <button
          type="button"
          onClick={onLock}
          className="px-6 py-3 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22] transition-colors"
        >
          Approve & lock package →
        </button>
        <button
          type="button"
          onClick={onExport}
          className="px-6 py-3 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest hover:border-[#E67E22]"
        >
          Export checklist
        </button>
        <Link
          href={`/studio/lock?slug=${encodeURIComponent(candidate.slug)}`}
          className="px-6 py-3 rounded-xl border border-[#C4A882]/50 text-[10px] font-bold uppercase tracking-widest text-[#6B543C] hover:border-[#E67E22]"
        >
          Hosting + checkout
        </Link>
      </div>
    </section>
  );
}
