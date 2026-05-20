"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { StrandItem } from "@/types";
import { strands } from "@/data/strands";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LandscapeSection } from "@/components/LandscapeSection";
import { DatabaseGrid } from "@/components/DatabaseGrid";
import { MethodologySection } from "@/components/MethodologySection";
import { Footer } from "@/components/Footer";
import { Modal } from "@/components/Modal";
import { AnalyzerSection } from "@/components/AnalyzerSection";
import { WebWeaveBackground } from "@/components/effects/WebWeaveBackground";
import { SilkTrail } from "@/components/effects/SilkTrail";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F9F7F3]" />}>
      <HomePage />
    </Suspense>
  );
}

function HomePage() {
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<StrandItem | null>(null);

  const handleSelect = useCallback((item: StrandItem) => setSelectedItem(item), []);
  const handleClose = useCallback(() => setSelectedItem(null), []);

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

  return (
    <main id="top" className="relative min-h-screen">
      <WebWeaveBackground />
      <SilkTrail />
      <Navbar />
      <Hero />
      <LandscapeSection />
      <DatabaseGrid onSelect={handleSelect} />
      <AnalyzerSection />
      <MethodologySection />
      <Footer />
      <Modal item={selectedItem} onClose={handleClose} />
    </main>
  );
}
