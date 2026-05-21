"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PlatformShell } from "@/components/PlatformShell";
import { BalancedText } from "@/components/BalancedText";
import { AnalyzerSection } from "@/components/AnalyzerSection";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("url") ?? "";

  return (
    <PlatformShell>
      <div className="relative z-10 pt-28 pb-8 px-6 max-w-5xl mx-auto text-center">
        <div className="mb-8">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] hover:text-[#E67E22]"
          >
            ← Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-3">
            Silk <span className="text-[#E67E22]">Analyzer</span>
          </h1>
          <BalancedText
            className="text-[#5A5653]"
            lines={[
              "Paste any website URL — we break down",
              "tech stack, design, interactions, UX",
              "& accessibility, performance signals,",
              "what is innovative, what is not working,",
              "& strand recommendations.",
              "Compare two sites side-by-side.",
            ]}
          />
        </div>
      </div>
      <AnalyzerSection initialUrl={prefill} showIntro={false} />
    </PlatformShell>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F9F7F3]" />}>
      <AnalyzeContent />
    </Suspense>
  );
}
