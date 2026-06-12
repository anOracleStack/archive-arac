"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect, type FormEvent } from "react";
import type { AnalysisResult } from "@/types/analysis";
import type { StrandItem } from "@/types";
import type { SiteComparison } from "@/lib/compareSites";
import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";
import {
  readPersistedSession,
  saveCompareSession,
  clearAnalysisSession,
} from "@/lib/analysisSession";
import { syncCompareUrl, clearCompareUrl } from "@/lib/compareUrlSync";
import { gloss } from "@/data/knowledgeGloss";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { BalancedText } from "@/components/BalancedText";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAnalyzerFlow } from "@/components/AnalyzerFlowContext";
import { AnalyzeUrlField } from "@/components/AnalyzeUrlField";
import { Modal } from "./Modal";

const AnalyzerResults = dynamic(
  () => import("./AnalyzerResults").then((mod) => mod.AnalyzerResults),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto py-12 text-center text-sm text-[#5A5653]">Loading results…</div>
    ),
  }
);
const CompareResults = dynamic(
  () => import("./analyzer/CompareResults").then((mod) => mod.CompareResults),
  {
    loading: () => (
      <div className="max-w-4xl mx-auto py-12 text-center text-sm text-[#5A5653]">Loading comparison…</div>
    ),
  }
);
const WorkshopChat = dynamic(
  () => import("./WorkshopChat").then((mod) => mod.WorkshopChat),
  { ssr: false }
);

type AnalyzerMode = "single" | "compare";

interface AnalyzerSectionProps {
  initialUrl?: string;
  autoRun?: boolean;
  comparePrefill?: { urlA: string; urlB: string } | null;
  compareAutoRun?: boolean;
  showIntro?: boolean;
  onStrandSelect?: (strand: StrandItem) => void;
}

export function AnalyzerSection({
  initialUrl = "",
  autoRun = false,
  comparePrefill = null,
  compareAutoRun = false,
  showIntro = true,
  onStrandSelect,
}: AnalyzerSectionProps) {
  const single = useAnalyzerFlow();
  const [mode, setMode] = useState<AnalyzerMode>("single");
  const [urlB, setUrlB] = useState("");
  const [compareA, setCompareA] = useState<AnalysisResult | null>(null);
  const [compareB, setCompareB] = useState<AnalysisResult | null>(null);
  const [comparison, setComparison] = useState<SiteComparison | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [compareStatus, setCompareStatus] = useState<"idle" | "fetching" | "complete" | "error">("idle");
  const [localStrand, setLocalStrand] = useState<StrandItem | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleStrandSelect = (strand: StrandItem) => {
    if (onStrandSelect) onStrandSelect(strand);
    else setLocalStrand(strand);
  };

  useEffect(() => {
    if (initialUrl) single.setUrl(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync prefill only when prop changes
  }, [initialUrl]);

  const sessionRestored = useRef(false);
  useEffect(() => {
    if (sessionRestored.current) return;
    sessionRestored.current = true;

    if (comparePrefill) {
      setMode("compare");
      single.setUrl(comparePrefill.urlA);
      setUrlB(comparePrefill.urlB);
      return;
    }

    if (initialUrl.trim()) return;

    const saved = readPersistedSession();
    if (!saved) return;

    if (saved.mode === "compare") {
      setMode("compare");
      single.setUrl(saved.urlA);
      setUrlB(saved.urlB);
      setCompareA(saved.compareA);
      setCompareB(saved.compareB);
      setComparison(saved.comparison);
      setCompareStatus("complete");
      queueMicrotask(() => scrollToResults());
      return;
    }
    // single restore handled by useSingleAnalyze
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once restore
  }, []);

  const autoRan = useRef(false);
  useEffect(() => {
    if (!autoRun || autoRan.current) return;
    if (!single.url.trim() || single.result || single.busy) return;
    autoRan.current = true;
    void single.submit().then((data) => {
      if (data) scrollToResults();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when autoRun + url ready
  }, [autoRun, single.url, single.result, single.busy]);

  const compareAutoRan = useRef(false);
  useEffect(() => {
    if (!compareAutoRun || compareAutoRan.current || !comparePrefill) return;
    if (compareA || compareStatus === "fetching") return;
    compareAutoRan.current = true;
    setMode("compare");
    single.setUrl(comparePrefill.urlA);
    setUrlB(comparePrefill.urlB);
    void (async () => {
      setCompareError(null);
      resetCompare();
      setCompareStatus("fetching");
      try {
        const res = await fetch("/api/analyze/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urlA: comparePrefill.urlA, urlB: comparePrefill.urlB }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Comparison failed");
        setCompareA(data.a);
        setCompareB(data.b);
        setComparison(data.comparison);
        setCompareStatus("complete");
        saveCompareSession({
          mode: "compare",
          urlA: comparePrefill.urlA,
          urlB: comparePrefill.urlB,
          compareA: data.a,
          compareB: data.b,
          comparison: data.comparison,
        });
        syncCompareUrl(comparePrefill.urlA, comparePrefill.urlB);
        scrollToResults();
      } catch (err) {
        setCompareError(err instanceof Error ? err.message : "Something went wrong");
        setCompareStatus("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- compare auto-run once
  }, [compareAutoRun, comparePrefill]);

  const handleClearResults = () => {
    single.reset();
    resetCompare();
    clearAnalysisSession();
    clearCompareUrl();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.delete("url");
      params.delete("run");
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`
      );
    }
  };

  const resetCompare = () => {
    setCompareA(null);
    setCompareB(null);
    setComparison(null);
    setCompareError(null);
    setCompareStatus("idle");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mode === "single") {
      setCompareError(null);
      resetCompare();
      const data = await single.submit();
      if (data) scrollToResults();
      return;
    }

    single.reset();
    setCompareError(null);
    resetCompare();
    setCompareStatus("fetching");

    const submitA = tryNormalizeCanonicalUrl(single.url);
    const submitB = tryNormalizeCanonicalUrl(urlB);
    try {
      const res = await fetch("/api/analyze/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlA: submitA, urlB: submitB }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Comparison failed");
      single.setUrl(submitA);
      setUrlB(submitB);
      setCompareA(data.a);
      setCompareB(data.b);
      setComparison(data.comparison);
      setCompareStatus("complete");
      saveCompareSession({
        mode: "compare",
        urlA: submitA,
        urlB: submitB,
        compareA: data.a,
        compareB: data.b,
        comparison: data.comparison,
      });
      syncCompareUrl(submitA, submitB);
      scrollToResults();
    } catch (err) {
      setCompareError(err instanceof Error ? err.message : "Something went wrong");
      setCompareStatus("error");
    }
  };

  const scrollToResults = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const busy =
    mode === "single"
      ? single.busy
      : compareStatus === "fetching";
  const canSubmit =
    mode === "single"
      ? single.url.trim().length > 0
      : single.url.trim().length > 0 && urlB.trim().length > 0;
  const error = mode === "single" ? single.error : compareError;

  return (
    <section id="analyzer" className="relative z-10 py-24 px-6 bg-white border-y border-[#E8E5DF]">
      <div className="max-w-4xl mx-auto">
        {showIntro && (
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10 shadow-sm">
                Understand &amp; optimize
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                  <KnowledgeGateway article={gloss.silkAnalyzer} surface="cream">
                    <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">
                      Silk Analyzer
                    </span>
                  </KnowledgeGateway>
                </h2>
              </div>
              <BalancedText
                className="text-[#5A5653] mb-6"
                lines={[
                  "Features, structure, UX signals, and ideas to make sites more innovative —",
                  "from one URL or a side-by-side compare.",
                ]}
              />
              <ModeToggle mode={mode} onChange={(m) => { setMode(m); single.reset(); resetCompare(); clearAnalysisSession(); clearCompareUrl(); }} />
            </div>
          </ScrollReveal>
        )}

        {!showIntro && (
          <div className="flex justify-center mb-8">
            <ModeToggle mode={mode} onChange={(m) => { setMode(m); single.reset(); resetCompare(); clearAnalysisSession(); clearCompareUrl(); }} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8 space-y-4">
          <div>
            {mode === "compare" && (
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE] mb-1.5 ml-1">
                Site A
              </span>
            )}
            <AnalyzeUrlField
              value={single.url}
              onChange={single.setUrl}
              placeholder={mode === "compare" ? "your-site.com" : "stripe.com or www.example.com"}
              disabled={busy}
            />
          </div>
          {mode === "compare" && (
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE] mb-1.5 ml-1">
                Site B
              </span>
              <AnalyzeUrlField
                value={urlB}
                onChange={setUrlB}
                placeholder="competitor.com"
                disabled={busy}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={!canSubmit || busy}
            className="w-full py-3.5 bg-[#2C2A29] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E67E22] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {busy && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {busy
              ? mode === "compare"
                ? "Comparing…"
                : "Analyzing…"
              : mode === "compare"
                ? "Compare sites"
                : "Analyze"}
          </button>
        </form>

        {(busy) && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-[#F9F7F3] rounded-2xl p-6 border border-[#E8E5DF]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#E67E22] animate-pulse" />
                <span className="text-sm font-medium text-[#5A5653]">
                  {mode === "compare"
                    ? "Fetching both sites in parallel…"
                    : "Fetching page source…"}
                </span>
              </div>
              <div className="h-1.5 bg-[#E8E5DF] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E67E22] to-[#8BA896] rounded-full animate-[silk-progress_2s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      <div id="analyzer-results" ref={resultRef} className="px-6">
        {single.result && mode === "single" && (
          <>
            <AnalyzerResults
              result={single.result}
              analyzedAt={single.analyzedAt}
              onClear={handleClearResults}
              onStrandSelect={handleStrandSelect}
            />
            <WorkshopChat result={single.result} />
          </>
        )}
        {compareA && compareB && comparison && mode === "compare" && (
          <CompareResults a={compareA} b={compareB} comparison={comparison} />
        )}
      </div>
      {!onStrandSelect && (
        <Modal item={localStrand} onClose={() => setLocalStrand(null)} />
      )}
    </section>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: AnalyzerMode;
  onChange: (m: AnalyzerMode) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-[#E8E5DF] p-1 bg-[#F9F7F3]">
      <button
        type="button"
        onClick={() => onChange("single")}
        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
          mode === "single" ? "bg-[#2C2A29] text-white" : "text-[#5A5653]"
        }`}
      >
        Analyze
      </button>
      <button
        type="button"
        onClick={() => onChange("compare")}
        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
          mode === "compare" ? "bg-[#2C2A29] text-white" : "text-[#5A5653]"
        }`}
      >
        Compare
      </button>
    </div>
  );
}
