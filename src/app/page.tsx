"use client";

import { useState, useCallback } from "react";
import type { StrandItem } from "@/types";
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

export default function HomePage() {
  const [selectedItem, setSelectedItem] = useState<StrandItem | null>(null);

  const handleSelect = useCallback((item: StrandItem) => setSelectedItem(item), []);
  const handleClose = useCallback(() => setSelectedItem(null), []);

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
