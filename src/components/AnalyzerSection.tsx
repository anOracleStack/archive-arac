"use client";

import { useState, useRef, type FormEvent } from "react";
import type { AnalysisResult, AnalysisStatus } from "@/types/analysis";
import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";
import { gloss } from "@/data/knowledgeGloss";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { AnalyzerResults } from "./AnalyzerResults";

export function AnalyzerSection() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setStatus("fetching");

    const submitUrl = tryNormalizeCanonicalUrl(url);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: submitUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setUrl(submitUrl);
      setResult(data);
      setStatus("complete");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <section id="analyzer" className="relative z-10 py-24 px-6 bg-white border-y border-[#E8E5DF]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[#E8E5DF] text-[#5A5653] text-[10px] font-black tracking-[0.2em] uppercase bg-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E67E22]" />
            New Tool
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              The Silk Analyzer
            </h2>
            <KnowledgeGateway article={gloss.silkAnalyzer} surface="cream" />
          </div>
          <p className="text-[#5A5653] max-w-xl mx-auto leading-relaxed text-pretty text-balance">
            Submit any URL and we&apos;ll unravel its design, tech stack, interactions, and UX —
            then generate reusable code snippets inspired by what we find.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setUrl((prev) => tryNormalizeCanonicalUrl(prev))}
              placeholder="stripe.com or www.example.com"
              className="w-full pl-14 pr-36 py-4 rounded-2xl border border-[#D1CEC7] bg-[#F9F7F3] text-[#2C2A29] text-sm outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/10 transition-all"
              disabled={status === "fetching" || status === "analyzing"}
            />
            <button
              type="submit"
              disabled={!url.trim() || status === "fetching" || status === "analyzing"}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#2C2A29] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#E67E22] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {(status === "fetching" || status === "analyzing") && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {status === "fetching" ? "Fetching" : status === "analyzing" ? "Analyzing" : "Analyze"}
            </button>
          </div>
        </form>

        {/* Loading indicator */}
        {(status === "fetching" || status === "analyzing") && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-[#F9F7F3] rounded-2xl p-6 border border-[#E8E5DF]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#E67E22] animate-pulse" />
                <span className="text-sm font-medium text-[#5A5653]">
                  {status === "fetching"
                    ? "Fetching page source..."
                    : "Analyzing structure, design & interactions..."}
                </span>
              </div>
              <div className="h-1.5 bg-[#E8E5DF] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E67E22] to-[#8BA896] rounded-full animate-[silk-progress_2s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
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

        {/* Legal disclaimer */}
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[10px] tracking-wider text-[#D1CEC7] text-pretty text-balance leading-relaxed">
            Only analyze sites you own or have permission to inspect. Some sites may block automated
            analysis — we handle that gracefully.
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div ref={resultRef}>
          <AnalyzerResults result={result} />
        </div>
      )}
    </section>
  );
}
