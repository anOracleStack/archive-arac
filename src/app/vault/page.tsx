"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PlatformShell } from "@/components/PlatformShell";
import { listVault, removeFromVault, getVaultEntry, type VaultEntry } from "@/lib/reportStore";
import { AnalyzerResults } from "@/components/AnalyzerResults";

function VaultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewId = searchParams.get("id");
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [viewEntry, setViewEntry] = useState<VaultEntry | null>(null);

  useEffect(() => {
    setEntries(listVault());
  }, []);

  useEffect(() => {
    if (viewId) {
      setViewEntry(getVaultEntry(viewId));
    } else {
      setViewEntry(null);
    }
  }, [viewId]);

  const handleRemove = (id: string) => {
    removeFromVault(id);
    setEntries(listVault());
    if (viewId === id) router.push("/vault");
  };

  if (viewEntry) {
    return (
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <Link
          href="/vault"
          className="inline-flex mb-6 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
        >
          ← Back to vault
        </Link>
        <h1 className="text-3xl font-bold mb-2">{viewEntry.label}</h1>
        <p className="text-sm text-[#B8B5AE] mb-8">
          Saved {new Date(viewEntry.savedAt).toLocaleString()}
        </p>
        <AnalyzerResults result={viewEntry.result} />
      </div>
    );
  }

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
        Silk Vault
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-4">
        Your <span className="text-[#E67E22]">audit vault</span>
      </h1>
      <p className="text-[#5A5653] mb-10 max-w-xl">
        Reports saved in this browser. Run an analysis, then hit &quot;Save to vault&quot; — or
        open Mission Control for what&apos;s shipping next.
      </p>

      {entries.length === 0 ? (
        <div className="p-10 rounded-2xl border border-dashed border-[#D1CEC7] text-center">
          <p className="text-[#5A5653] mb-4">No reports yet.</p>
          <Link
            href="/#analyzer"
            className="inline-flex px-6 py-3 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22] transition-colors"
          >
            Analyze a URL →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-[#E8E5DF] bg-white"
            >
              <div>
                <p className="font-bold">{e.label}</p>
                <p className="text-sm text-[#E67E22]">{e.result.url}</p>
                <p className="text-xs text-[#B8B5AE] mt-1">
                  Score {e.result.overview.score} · {new Date(e.savedAt).toLocaleString()} ·{" "}
                  {e.strandIds.length} strand hints
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/vault?id=${encodeURIComponent(e.id)}`}
                  className="px-4 py-2 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]"
                >
                  View report
                </Link>
                <Link
                  href="/#analyzer"
                  className="px-4 py-2 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest hover:border-[#E67E22]"
                >
                  Re-analyze
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(e.id)}
                  className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function VaultPage() {
  return (
    <PlatformShell>
      <Suspense
        fallback={
          <div className="relative z-10 pt-32 px-6 text-[#5A5653]">Loading vault…</div>
        }
      >
        <VaultContent />
      </Suspense>
    </PlatformShell>
  );
}
