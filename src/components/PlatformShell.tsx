"use client";

import { Navbar } from "@/components/Navbar";
import { PlatformFooter } from "@/components/PlatformFooter";
import { WebWeaveBackground } from "@/components/effects/WebWeaveBackground";
import { SilkTrail } from "@/components/effects/SilkTrail";
import { VaultAutoSync } from "@/components/VaultAutoSync";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen flex flex-col">
      <WebWeaveBackground />
      <SilkTrail />
      <Navbar />
      <VaultAutoSync />
      <div className="flex-1">{children}</div>
      <PlatformFooter />
    </main>
  );
}
