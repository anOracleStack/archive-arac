"use client";

import Link from "next/link";
import { ClaimChecklist } from "@/components/identity/ClaimChecklist";
import type { IdentityCandidate, IdentityScanResult } from "@/types/identity";

function statusChip(status: string) {
  if (status === "available") return "bg-[#8BA896]/15 text-[#5a7a68] border-[#8BA896]/40";
  if (status === "taken") return "bg-red-50 text-red-700 border-red-200";
  if (status === "invalid") return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-[#E8E5DF] text-[#5A5653] border-[#D1CEC7]";
}

interface Props {
  result: IdentityScanResult;
  onApprove?: (candidate: IdentityCandidate) => void;
  onExport?: (candidate: IdentityCandidate) => void;
}

export function IdentityResults({ result, onApprove, onExport }: Props) {
  return (
    <div className="space-y-6 mt-12">
      <p className="text-xs text-[#5A5653] leading-relaxed border-l-2 border-[#C4A882] pl-4">
        {result.meta.disclaimer}
      </p>

      {result.candidates.map((c, idx) => (
        <article
          key={c.id}
          className="rounded-2xl border border-[#E8E5DF] bg-white/80 backdrop-blur-sm p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B]">
                #{idx + 1} · {c.slug}
              </span>
              <h3 className="text-xl font-bold tracking-tight mt-1">{c.label}</h3>
            </div>
            <div className="text-center">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-black border-2 ${
                  c.score >= 70
                    ? "border-[#8BA896] text-[#8BA896]"
                    : c.score >= 45
                      ? "border-[#E67E22] text-[#E67E22]"
                      : "border-[#D1CEC7] text-[#5A5653]"
                }`}
              >
                {c.score}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] mt-1 block">
                Match score
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] mb-2">
                Domains
              </h4>
              <ul className="space-y-1.5">
                {c.domains.map((d) => (
                  <li key={d.fqdn} className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-mono text-[#2C2A29]">{d.fqdn}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusChip(d.status)}`}
                    >
                      {d.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] mb-2">
                Social handles
              </h4>
              <ul className="space-y-1.5">
                {c.social.map((s) => (
                  <li key={s.platformId} className="flex items-center justify-between gap-2 text-sm">
                    <span>
                      <span className="text-[#5A5653]">{s.platformName}</span>
                      <span className="font-mono ml-2">@{s.handle}</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${statusChip(s.status)}`}
                    >
                      {s.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {(c.highlights.length > 0 || c.warnings.length > 0) && (
            <div className="mt-4 pt-4 border-t border-[#E8E5DF] grid sm:grid-cols-2 gap-4 text-sm">
              {c.highlights.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8BA896] mb-1">
                    Strengths
                  </p>
                  <ul className="list-disc list-inside text-[#2C2A29] space-y-0.5">
                    {c.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
              {c.warnings.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#E67E22] mb-1">
                    Watchouts
                  </p>
                  <ul className="list-disc list-inside text-[#5A5653] space-y-0.5">
                    {c.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {idx === 0 && <ClaimChecklist candidate={c} />}

          {(onApprove || onExport) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(c)}
                  className="px-5 py-2.5 rounded-xl bg-[#2C2A29] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#E67E22] transition-colors"
                >
                  Approve & save to vault
                </button>
              )}
              {onExport && (
                <button
                  type="button"
                  onClick={() => onExport(c)}
                  className="px-5 py-2.5 rounded-xl border border-[#D1CEC7] text-xs font-bold uppercase tracking-widest hover:border-[#E67E22]"
                >
                  Export .md
                </button>
              )}
              <Link
                href={`/studio/lock?slug=${encodeURIComponent(c.slug)}`}
                className="px-5 py-2.5 rounded-xl border border-[#C4A882]/50 text-xs font-bold uppercase tracking-widest text-[#6B543C] hover:border-[#E67E22]"
              >
                Checkout preview
              </Link>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
