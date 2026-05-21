"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import type { AnalysisResult, AnalysisStatus } from "@/types/analysis";
import type { SiteComparison } from "@/lib/compareSites";
import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";
import { gloss } from "@/data/knowledgeGloss";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnalyzerResults } from "./AnalyzerResults";
import { CompareResults } from "./analyzer/CompareResults";

type AnalyzerMode = "single" | "compare";

interface AnalyzerSectionProps {
  initialUrl?: string;
  showIntro?: boolean;
}

export function AnalyzerSection({ initialUrl = "", showIntro = true }: AnalyzerSectionProps) {
  const [mode, setMode] = useState<AnalyzerMode>("single");
  const [url, setUrl] = useState(initialUrl);
  const [urlB, setUrlB] = useState("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [compareA, setCompareA] = useState<AnalysisResult | null>(null);
  const [compareB, setCompareB] = useState<AnalysisResult | null>(null);
  const [comparison, setComparison] = useState<SiteComparison | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  const resetResults = () => {
    setResult(null);
    setCompareA(null);
    setCompareB(null);
    setComparison(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    resetResults();
    setStatus("fetching");

    if (mode === "single") {
      const submitUrl = tryNormalizeCanonicalUrl(url);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: submitUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Analysis failed");
        setUrl(submitUrl);
        setResult(data);
        setStatus("complete");
        scrollToResults();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
      return;
    }

    const submitA = tryNormalizeCanonicalUrl(url);
    const submitB = tryNormalizeCanonicalUrl(urlB);
    try {
      const res = await fetch("/api/analyze/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlA: submitA, urlB: submitB }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Comparison failed");
      setUrl(submitA);
      setUrlB(submitB);
      setCompareA(data.a);
      setCompareB(data.b);
      setComparison(data.comparison);
      setStatus("complete");
      scrollToResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  const scrollToResults = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const busy = status === "fetching" || status === "analyzing";
  const canSubmit =
    mode === "single"
      ? url.trim().length > 0
      : url.trim().length > 0 && urlB.trim().length > 0;

  return (
    <section id="analyzer" className="relative z-10 py-24 px-6 bg-white border-y border-[#E8E5DF]">
      <div className="max-w-4xl mx-auto">
        {showIntro && (
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#E67E22]" />
                Silk Intelligence
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                  <KnowledgeGateway article={gloss.silkAnalyzer} surface="cream">
                    <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">
                      The Silk Analyzer
                    </span>
                  </KnowledgeGateway>
                </h2>
              </div>
              <p className="text-[#5A5653] max-w-xl mx-auto leading-relaxed text-pretty text-balance mb-6">
                Unravel any URL — tech stack, design, UX, what works, what does not, innovation
                highlights, and strand recommendations. Compare two competitors side-by-side.
              </p>
              <div className="inline-flex rounded-xl border border-[#E8E5DF] p-1 bg-[#F9F7F3]">
                <button
                  type="button"
                  onClick={() => {
                    setMode("single");
                    resetResults();
                    setError(null);
                    setStatus("idle");
                  }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    mode === "single" ? "bg-[#2C2A29] text-white" : "text-[#5A5653]"
                  }`}
                >
                  Analyze
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("compare");
                    resetResults();
                    setError(null);
                    setStatus("idle");
                  }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    mode === "compare" ? "bg-[#2C2A29] text-white" : "text-[#5A5653]"
                  }`}
                >
                  Compare
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {!showIntro && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl border border-[#E8E5DF] p-1 bg-[#F9F7F3]">
              <button
                type="button"
                onClick={() => {
                  setMode("single");
                  resetResults();
                  setError(null);
                  setStatus("idle");
                }}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  mode === "single" ? "bg-[#2C2A29] text-white" : "text-[#5A5653]"
                }`}
              >
                Analyze
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("compare");
                  resetResults();
                  setError(null);
                  setStatus("idle");
                }}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  mode === "compare" ? "bg-[#2C2A29] text-white" : "text-[#5A5653]"
                }`}
              >
                Compare
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8 space-y-4">
          <UrlField
            value={url}
            onChange={setUrl}
            placeholder={mode === "compare" ? "your-site.com" : "stripe.com or www.example.com"}
            disabled={busy}
            label={mode === "compare" ? "Site A" : undefined}
          />
          {mode === "compare" && (
            <UrlField
              value={urlB}
              onChange={setUrlB}
              placeholder="competitor.com"
              disabled={busy}
              label="Site B"
            />
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
                ? "Comparing weaves…"
                : "Analyzing…"
              : mode === "compare"
                ? "Compare sites"
                : "Analyze"}
          </button>
        </form>

        {(status === "fetching" || status === "analyzing") && (
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

      <div ref={resultRef} className="px-6">
        {result && <AnalyzerResults result={result} />}
        {compareA && compareB && comparison && (
          <CompareResults a={compareA} b={compareB} comparison={comparison} />
        )}
      </div>
    </section>
  );
}

function UrlField({
  value,
  onChange,
  placeholder,
  disabled,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled: boolean;
  label?: string;
}) {
  return (
    <div>
      {label && (
        <span className="block text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE] mb-1.5 ml-1">
          {label}
        </span>
      )}
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A5653]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onChange(tryNormalizeCanonicalUrl(value))}
          placeholder={placeholder}
          className="w-full pl-14 pr-4 py-4 rounded-2xl border border-[#D1CEC7] bg-[#F9F7F3] text-[#2C2A29] text-sm outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/10 transition-all"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
