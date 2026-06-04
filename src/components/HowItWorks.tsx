"use client";

import { ScrollReveal, StaggerGrid } from "@/components/ScrollReveal";

const STEPS = [
  {
    id: "analyze",
    number: "01",
    title: "Analyze",
    body: "Paste a URL to see how a site is built — stack, structure, and UX signals in one pass.",
  },
  {
    id: "learn",
    number: "02",
    title: "Learn",
    body: "Browse example sites and trend illustrations to see what strong experiences share.",
  },
  {
    id: "build",
    number: "03",
    title: "Build",
    body: "Use the studio and identity tools to align branding, domains, handles, and your site.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 px-6 py-16 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E67E22] mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Three steps from URL to presence
          </h2>
        </div>
      </ScrollReveal>
      <StaggerGrid className="grid gap-6 md:grid-cols-3" staggerMs={100}>
        {STEPS.map((step) => (
          <article
            key={step.id}
            id={step.id}
            className="rounded-2xl border border-[#C4A882]/30 bg-white/60 p-6 text-center transition-colors hover:border-[#C4A882]/50 hover:bg-white"
          >
            <div className="text-2xl font-black text-[#E67E22] mb-2">{step.number}</div>
            <h3 className="text-lg font-bold mb-3 tracking-tight">{step.title}</h3>
            <p className="text-sm text-[#5A5653] font-light leading-relaxed">{step.body}</p>
          </article>
        ))}
      </StaggerGrid>
    </section>
  );
}
