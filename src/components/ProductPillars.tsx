"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BalancedText } from "@/components/BalancedText";
import { LoreTerm } from "@/components/LoreTerm";

const PILLAR_LINK =
  "text-[11px] font-bold uppercase tracking-widest text-[#6B543C] hover:text-[#E67E22] transition-colors";

type LoreLink = {
  href: string;
  term: string;
  plain: string;
  external?: boolean;
};

function LoreNavLink({ href, term, plain, external }: LoreLink) {
  const inner = (
    <span className="block text-center">
      <span className={PILLAR_LINK}>{term}</span>
      <span className="block text-[10px] font-normal normal-case tracking-normal text-[#5A5653] mt-1 leading-snug">
        {plain}
      </span>
    </span>
  );

  if (external || href.startsWith("#")) {
    return (
      <a href={href} className="min-w-[7rem]">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="min-w-[7rem]">
      {inner}
    </Link>
  );
}

export function ProductPillars() {
  return (
    <section id="pillars" className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-10">
      <ScrollReveal>
        <p className="mb-10 text-center">
          <a
            href="#index"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5A5653] transition-colors hover:text-[#E67E22]"
          >
            Explore the platform
            <span aria-hidden>↓</span>
          </a>
        </p>
      </ScrollReveal>
      <div className="grid gap-6 md:grid-cols-2">
        <ScrollReveal>
          <article className="h-full rounded-2xl border border-[#C4A882]/30 bg-[#F9F7F3]/80 p-8 transition-colors hover:border-[#C4A882]/50 hover:bg-white text-center">
            <LoreTerm
              variant="stack"
              className="mb-4"
              term="Understand & optimize"
              plain="Learn from any site before you build yours."
            />
            <BalancedText
              className="text-[#5A5653] text-sm font-light leading-relaxed mb-6"
              lines={[
                "Analyze any URL, browse example sites,",
                "& explore illustrated trends in how",
                "the web is built.",
              ]}
            />
            <nav
              className="flex flex-wrap gap-6 justify-center"
              aria-label="Understand and optimize"
            >
              <LoreNavLink
                href="#analyzer"
                term="Silk Analyzer"
                plain="Paste a URL — quick site read"
              />
              <LoreNavLink
                href="#index"
                term="Index Araneae"
                plain="Gallery of interface examples"
              />
              <LoreNavLink
                href="#weave"
                term="Weave trends"
                plain="Illustrated web direction map"
              />
            </nav>
          </article>
        </ScrollReveal>
        <ScrollReveal index={1}>
          <article className="h-full rounded-2xl border border-[#C4A882]/30 bg-[#F9F7F3]/80 p-8 transition-colors hover:border-[#C4A882]/50 hover:bg-white text-center">
            <LoreTerm
              variant="stack"
              className="mb-4"
              term="Build your website"
              plain="Claim a name, describe your site, launch."
            />
            <BalancedText
              className="text-[#5A5653] text-sm font-light leading-relaxed mb-6"
              lines={[
                "Lock in branding, domains, & handles —",
                "describe your site in Weave, & launch",
                "from Studio. Vault holds it all.",
              ]}
            />
            <nav className="flex flex-wrap gap-6 justify-center" aria-label="Build your website">
              <LoreNavLink href="/studio" term="Studio" plain="Hosting & connect tools" />
              <LoreNavLink
                href="/identity"
                term="Identity Lock"
                plain="Domains & social handles"
              />
              <LoreNavLink href="/vault" term="Vault" plain="Everything you save" />
              <LoreNavLink href="/mission" term="Mission" plain="How it fits together" />
            </nav>
          </article>
        </ScrollReveal>
      </div>
    </section>
  );
}
