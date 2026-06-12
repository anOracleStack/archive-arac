"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BalancedText } from "@/components/BalancedText";

const PILLAR_LINK =
  "text-[11px] font-bold uppercase tracking-widest text-[#6B543C] hover:text-[#E67E22] transition-colors";

export function ProductPillars() {
  return (
    <section id="pillars" className="relative z-10 px-6 pb-16 pt-4 max-w-5xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <ScrollReveal>
          <article className="h-full rounded-2xl border border-[#C4A882]/30 bg-[#F9F7F3]/80 p-8 transition-colors hover:border-[#C4A882]/50 hover:bg-white">
            <h2 className="text-2xl font-bold tracking-tight text-[#2C2A29] mb-3">
              Understand &amp; optimize
            </h2>
            <BalancedText
              className="text-[#5A5653] text-sm font-light leading-relaxed mb-6"
              lines={[
                "Analyze any URL, browse example sites,",
                "& explore illustrated trends in how",
                "the web is built.",
              ]}
            />
            <nav className="flex flex-wrap gap-4" aria-label="Understand and optimize">
              <a href="#analyzer" className={PILLAR_LINK}>
                Analyzer
              </a>
              <a href="#index" className={PILLAR_LINK}>
                Site library
              </a>
              <a href="#weave" className={PILLAR_LINK}>
                Weave trends
              </a>
            </nav>
          </article>
        </ScrollReveal>
        <ScrollReveal index={1}>
          <article className="h-full rounded-2xl border border-[#C4A882]/30 bg-[#F9F7F3]/80 p-8 transition-colors hover:border-[#C4A882]/50 hover:bg-white">
            <h2 className="text-2xl font-bold tracking-tight text-[#2C2A29] mb-3">
              Build your website
            </h2>
            <BalancedText
              className="text-[#5A5653] text-sm font-light leading-relaxed mb-6"
              lines={[
                "Lock in branding, domains, & handles —",
                "describe your site in Weave, & launch",
                "from Studio. Vault holds it all.",
              ]}
            />
            <nav className="flex flex-wrap gap-4" aria-label="Build your website">
              <Link href="/studio" className={PILLAR_LINK}>
                Studio
              </Link>
              <Link href="/identity" className={PILLAR_LINK}>
                Identity lock
              </Link>
              <Link href="/vault" className={PILLAR_LINK}>
                Vault
              </Link>
              <Link href="/mission" className={PILLAR_LINK}>
                Mission
              </Link>
            </nav>
          </article>
        </ScrollReveal>
      </div>
    </section>
  );
}
