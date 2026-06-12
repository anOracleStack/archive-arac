"use client";

import { type FormEvent } from "react";
import { BalancedText } from "@/components/BalancedText";
import { HERO_SUPPORT_COPY, LoreTerm } from "@/components/LoreTerm";
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
    <header className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-5xl flex-col justify-center px-6 py-14 text-center">
      <ScrollReveal>
        <LoreTerm
          className="mb-6"
          size="hero"
          term="Archive Arac: The architecture of websites"
          plain={[
            "Your domain is your address on the web — we break down how sites work,",
            "help you claim the right name, & build one that fits you.",
          ]}
        />
      </ScrollReveal>
      <ScrollReveal index={1}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tighter text-balance">
          From Foundation to{" "}
          <span className="text-[#E67E22] relative inline-block">
            Fruition.
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden>
              <path d="M0 4 Q50 0 100 4 Q150 8 200 4" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
            </svg>
          </span>
        </h1>
      </ScrollReveal>
      <ScrollReveal index={2}>
        <BalancedText
          className={`${HERO_SUPPORT_COPY} max-w-2xl mx-auto`}
          lines={[
            "Analyze any website's structure, secure your branding, domains, & handles,",
            "& build a site that fits your identity.",
          ]}
        />
      </ScrollReveal>
      <ScrollReveal index={3}>
        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch"
        >
          <AnalyzeUrlField
            id="hero-analyze-url"
            value={url}
            onChange={setUrl}
            disabled={busy}
            compact
          />
          <button
            type="submit"
            disabled={!url.trim() || busy}
            className="shrink-0 px-8 py-3 bg-[#2C2A29] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#E67E22] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            {busy && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {busy ? "Analyzing…" : "Analyze"}
          </button>
        </form>
        <p className="mt-4 text-[11px] text-[#B8B5AE]">
          <span className="font-bold text-[#9C7C5B]">Silk Analyzer</span>
          {" — "}
          paste a URL to see how it&apos;s built.
        </p>
      </ScrollReveal>
      <ScrollReveal index={4}>
        <div className="mt-8">
          <a
            href="#index"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A5653] hover:text-[#E67E22] transition-colors"
          >
            Explore the platform
            <span aria-hidden>↓</span>
          </a>
        </div>
      </ScrollReveal>
    </header>
  );
}
