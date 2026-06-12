"use client";

import { type FormEvent } from "react";
import { BalancedText } from "@/components/BalancedText";
import { useAnalyzerFlow } from "@/components/AnalyzerFlowContext";
import { AnalyzeUrlField } from "@/components/AnalyzeUrlField";

export function Hero() {
  const { url, setUrl, submit, busy } = useAnalyzerFlow();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = await submit();
    if (data) {
      setTimeout(() => {
        document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("analyzer-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } else if (url.trim()) {
      document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="flex h-full min-h-0 flex-col items-center justify-center gap-3 overflow-hidden text-center sm:gap-4">
      <h1 className="text-[1.35rem] font-bold leading-[1.12] tracking-tighter sm:text-[1.75rem] md:text-[2rem] lg:text-[2.15rem]">
        <span className="block">ARCHIVE ARAC</span>
        <span className="mt-1 block">The Anatomy of</span>
        <span className="mt-1 block">Website Architecture</span>
      </h1>
      <BalancedText
        className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-[#5A5653] sm:text-base md:text-lg"
        lines={[
          "Breaking down the biology of digital real estate —",
          "structure, branding, domains, & social handles —",
          "to build a website that represents your digital identity.",
        ]}
      />
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#D1CEC7]/80 bg-white/70 p-3 text-center shadow-sm sm:p-4">
        <p className="mb-3 text-sm leading-snug text-[#5A5653]">
          <span className="font-bold text-[#9C7C5B]">Silk Analyzer</span>
          {" — "}
          paste a website URL to break down its anatomy
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-stretch gap-3 sm:flex-row"
        >
          <AnalyzeUrlField
            id="hero-analyze-url"
            value={url}
            onChange={setUrl}
            disabled={busy}
            compact
            placeholder="methodmoirai.com"
          />
          <button
            type="submit"
            disabled={!url.trim() || busy}
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#2C2A29] px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#E67E22] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {busy ? "Analyzing…" : "Analyze"}
          </button>
        </form>
      </div>
      <a
        href="#pillars"
        className="inline-flex shrink-0 items-center gap-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-[#5A5653] transition-colors hover:text-[#E67E22]"
      >
        Explore the platform
        <span aria-hidden>↓</span>
      </a>
    </header>
  );
}
