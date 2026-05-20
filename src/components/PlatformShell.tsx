"use client";

import { Navbar } from "@/components/Navbar";
import { WebWeaveBackground } from "@/components/effects/WebWeaveBackground";
import { SilkTrail } from "@/components/effects/SilkTrail";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen">
      <WebWeaveBackground />
      <SilkTrail />
      <Navbar />
      {children}
    </main>
  );
}
