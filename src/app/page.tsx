"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { StrandItem } from "@/types";
import { strands } from "@/data/strands";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductPillars } from "@/components/ProductPillars";
import { HowItWorks } from "@/components/HowItWorks";
import { MethodologySection } from "@/components/MethodologySection";
import { Footer } from "@/components/Footer";
import { AnalyzerFlowProvider } from "@/components/AnalyzerFlowContext";

const WebWeaveBackground = dynamic(
  () => import("@/components/effects/WebWeaveBackground").then((mod) => mod.WebWeaveBackground),
  { ssr: false }
);
const SilkTrail = dynamic(
  () => import("@/components/effects/SilkTrail").then((mod) => mod.SilkTrail),
  { ssr: false }
);
const LandscapeSection = dynamic(
  () => import("@/components/LandscapeSection").then((mod) => mod.LandscapeSection),
  {
    loading: () => (
      <section className="relative z-10 py-24 px-6 bg-white border-y border-[#C4A882]/30 min-h-[420px]" aria-hidden />
    ),
  }
);
const DatabaseGrid = dynamic(
  () => import("@/components/DatabaseGrid").then((mod) => mod.DatabaseGrid),
  {
    loading: () => (
      <section id="index" className="relative z-10 py-24 px-6 min-h-[320px]" aria-hidden />
    ),
  }
);
const AnalyzerSection = dynamic(
  () => import("@/components/AnalyzerSection").then((mod) => mod.AnalyzerSection),
  {
    loading: () => (
      <section id="analyzer" className="relative z-10 py-24 px-6 bg-white border-y border-[#E8E5DF] min-h-[280px]" aria-hidden />
    ),
  }
);
const Modal = dynamic(
  () => import("@/components/Modal").then((mod) => mod.Modal),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F9F7F3]" />}>
      <HomePage />
    </Suspense>
  );
}

function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<StrandItem | null>(null);

  const handleSelect = useCallback((item: StrandItem) => setSelectedItem(item), []);
  const handleClose = useCallback(() => {
    setSelectedItem(null);
    if (searchParams.get("strand")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("strand");
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    const id = searchParams.get("strand");
    if (!id) return;
    const num = Number(id);
    const match = strands.find((s) => s.id === num);
    if (match) {
      setSelectedItem(match);
      window.requestAnimationFrame(() => {
        document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [searchParams]);

  const urlPrefill = searchParams.get("url") ?? "";
  const autoRun = searchParams.get("run") === "1" && urlPrefill.length > 0;

  return (
    <AnalyzerFlowProvider initialUrl={urlPrefill}>
      <main id="top" className="relative min-h-screen">
        <WebWeaveBackground />
        <SilkTrail />
        <Navbar />
        <Hero />
        <ProductPillars />
        <HowItWorks />
        <LandscapeSection />
        <DatabaseGrid onSelect={handleSelect} />
        <AnalyzerSection initialUrl={urlPrefill} autoRun={autoRun} onStrandSelect={handleSelect} />
        <MethodologySection />
        <Footer />
        <Modal item={selectedItem} onClose={handleClose} />
      </main>
    </AnalyzerFlowProvider>
  );
}
