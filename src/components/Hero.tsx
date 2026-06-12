"use client";

import { type FormEvent } from "react";
import { BalancedText } from "@/components/BalancedText";
import { HERO_SUPPORT_COPY } from "@/components/LoreTerm";
import { ScrollReveal } from "@/components/ScrollReveal";
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
    <header className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-5xl flex-col justify-center gap-4 px-6 py-5 text-center">
      <ScrollReveal>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tighter">
          <span className="block">
            <span>ARCHIVE</span>
            <span className="ml-[0.4em]">ARAC</span>
            <span className="text-[#9C7C5B]">:</span>
          </span>
          <span className="mt-2 block text-[0.88em] font-bold tracking-tight md:mt-3">
            The Anatomy of Website Architecture
          </span>
        </h1>
      </ScrollReveal>
      <ScrollReveal index={1}>
        <BalancedText
          className={`${HERO_SUPPORT_COPY} max-w-2xl mx-auto`}
          lines={[
            "Breaking down the biology of digital real estate —",
            "structure, branding, domains, & social handles —",
            "to build a website that represents your digital identity.",
          ]}
        />
      </ScrollReveal>
      <ScrollReveal index={2}>
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#D1CEC7]/80 bg-white/70 p-4 text-center shadow-sm sm:p-5">
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
      </ScrollReveal>
      <ScrollReveal index={3}>
        <a
          href="#index"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A5653] transition-colors hover:text-[#E67E22]"
        >
          Explore the platform
          <span aria-hidden>↓</span>
        </a>
      </ScrollReveal>
    </header>
  );
}
