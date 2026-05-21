"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PlatformShell } from "@/components/PlatformShell";
import { decodeSharePayload, type SharedReportPayload } from "@/lib/reportShare";
import { strands } from "@/data/strands";
import { AnalyzerResults } from "@/components/AnalyzerResults";
import type { AnalysisResult } from "@/types/analysis";
import { BalancedText } from "@/components/BalancedText";

function ReportContent() {
  const params = useSearchParams();
  const [payload, setPayload] = useState<SharedReportPayload | null>(null);
  const [full, setFull] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("s");
    if (!token) return;
    const decoded = decodeSharePayload(token);
    setPayload(decoded);
    if (!decoded) setError("Invalid or expired share link.");
  }, [params]);

  useEffect(() => {
    if (!payload) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: payload.url }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load report");
        if (!cancelled) setFull(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [payload]);

  if (!params.get("s")) {
    return (
      <div className="text-center">
        <BalancedText
          lines={[
            "Missing share token.",
            <>
              <Link href="/#analyzer" className="text-[#E67E22] underline">
                Run an analysis
              </Link>
              .
            </>,
          ]}
          className="text-[#5A5653]"
        />
      </div>
    );
  }

  if (error && !payload) {
    return (
      <div className="text-center">
        <BalancedText text={error} className="text-red-600" />
      </div>
    );
  }

  if (!payload) return null;

  const strandNames = payload.strandIds
    .map((id) => strands.find((s) => s.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="space-y-8 text-center">
      <div className="p-6 rounded-2xl border border-[#E8E5DF] bg-white">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9C7C5B] mb-2">
          Shared snapshot
        </p>
        <h1 className="text-3xl font-bold mb-2">{payload.title}</h1>
        <a href={payload.url} target="_blank" rel="noopener noreferrer" className="text-[#E67E22]">
          {payload.hostname} ↗
        </a>
        <BalancedText text={payload.summary} className="mt-4 text-sm text-[#5A5653] mx-auto max-w-2xl" />
        <BalancedText
          text={`Score ${payload.score} · Vibe ${payload.vibe}`}
          className="mt-4 text-sm mx-auto"
        />
        {strandNames.length > 0 && (
          <BalancedText
            text={`Suggested strands: ${strandNames.join(", ")}`}
            className="mt-2 text-xs text-[#9C7C5B] mx-auto max-w-xl"
          />
        )}
      </div>

      {loading && (
        <BalancedText
          text="Refreshing full weave analysis…"
          className="text-sm text-[#5A5653] animate-pulse mx-auto"
        />
      )}
      {error && full === null && (
        <BalancedText text={error} className="text-red-600 text-sm mx-auto" />
      )}
      {full && (
        <div className="bg-white rounded-2xl border border-[#E8E5DF] p-6">
          <AnalyzerResults result={full} />
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto text-center">
        <Suspense
          fallback={
            <BalancedText text="Loading report…" className="text-[#5A5653] mx-auto" />
          }
        >
          <ReportContent />
        </Suspense>
      </div>
    </PlatformShell>
  );
}
