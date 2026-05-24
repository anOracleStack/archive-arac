"use client";

import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { ScrollReveal } from "@/components/ScrollReveal";

type StepStatus = "ready" | "beta";

type JourneyStep = {
  id: string;
  glyph: string;
  title: string;
  hook: string;
  youGet: string[];
  status: StepStatus;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

const steps: JourneyStep[] = [
  {
    id: "unravel",
    glyph: "01",
    title: "Unravel any site",
    hook: "Paste a URL. See what they built — tech, design, UX, & where they’re ahead of you.",
    youGet: [
      "One-site teardown or side-by-side compare",
      "Strand picks matched to what we detect",
      "Save the report, share a link, or export Markdown",
    ],
    status: "ready",
    primary: { href: "/analyze", label: "Open Silk Analyzer" },
  },
  {
    id: "claim",
    glyph: "02",
    title: "Claim your name",
    hook: "Stop guessing on domains & handles. Rank options, check rules, lock a package.",
    youGet: [
      "5, 10, 25, or 50 ranked name ideas",
      "Live domain checks across .com, .io, .ai & more",
      "Social & GitHub rules baked in — no illegal handles",
    ],
    status: "ready",
    primary: { href: "/identity", label: "Start Identity Lock" },
  },
  {
    id: "spin",
    glyph: "03",
    title: "Spin it up",
    hook: "Hosting, domain bundle, & a build path — connect Wix or hand us a brief.",
    youGet: [
      "Hosting tiers tied to your lock",
      "Connect an existing Wix site or any URL",
      "Checkout when you’re ready to pay & ship",
    ],
    status: "ready",
    primary: { href: "/studio", label: "Enter Studio" },
  },
  {
    id: "weave",
    glyph: "04",
    title: "Weave what you learned",
    hook: "Turn insight into a build — export strand code or benchmark a whole competitive set.",
    youGet: [
      "Composer: pick strands, export manifest or React scaffolds",
      "Collections: batch-analyze up to 8 URLs at once",
      "Built for teams who prototype fast, not drag-and-drop hosts",
    ],
    status: "ready",
    primary: { href: "/compose", label: "Compose strands" },
    secondary: { href: "/collections", label: "Batch collections" },
  },
];

const onlyHere = [
  "Strand-native — we teach motion & layout patterns, not generic templates",
  "Every bold term opens a plain-language explainer — no jargon wall",
  "Analyzer, identity, studio, & weave tools share one vault — not four silos",
];

function StatusPill({ status }: { status: StepStatus }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E67E22]/15 text-[#9C4E12] text-[9px] font-black uppercase tracking-[0.18em]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
        Ready now
      </span>
    );
  }
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full bg-[#C4A882]/25 text-[#6B543C] text-[9px] font-black uppercase tracking-[0.18em]">
      Finishing soon
    </span>
  );
}

export function WeaveJourney({ appUrl }: { appUrl: string }) {
  return (
    <div className="max-w-3xl mx-auto">
      <ScrollReveal>
        <div className="mb-16 relative">
          <div
            className="absolute inset-0 -z-10 opacity-[0.07] pointer-events-none"
            aria-hidden
          >
            <svg viewBox="0 0 400 120" className="w-full h-auto" fill="none">
              <path
                d="M0 60 Q100 20 200 60 T400 60"
                stroke="#E67E22"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M0 70 Q100 100 200 70 T400 70"
                stroke="#C4A882"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>
          <BalancedText
            className="text-lg text-[#5A5653] leading-relaxed"
            lines={[
              "Most builders sell you a canvas.",
              "Archive Arac gives you a weave —",
              "see any site, claim a name, ship hosting,",
              "& export the strands that fit.",
            ]}
          />
          <p className="mt-6 text-sm text-[#9C7C5B] font-medium">
            Follow the thread top to bottom. Skip ahead anytime — nothing locks you in.
          </p>
        </div>
      </ScrollReveal>

      <ol className="relative space-y-0">
        <div
          className="absolute left-[1.35rem] top-8 bottom-8 w-px bg-gradient-to-b from-[#E67E22]/60 via-[#C4A882]/40 to-transparent hidden sm:block"
          aria-hidden
        />

        {steps.map((step, i) => (
          <ScrollReveal key={step.id} index={i + 1}>
            <li className="relative pl-0 sm:pl-14 pb-12 last:pb-0">
              <div
                className="hidden sm:flex absolute left-0 top-1 w-11 h-11 rounded-2xl border-2 border-[#E67E22]/30 bg-[#F9F7F3] items-center justify-center font-black text-xs text-[#E67E22] shadow-sm"
                aria-hidden
              >
                {step.glyph}
              </div>

              <article className="group p-6 sm:p-8 rounded-3xl border border-[#E8E5DF] bg-white/90 backdrop-blur-sm shadow-[0_8px_40px_-12px_rgba(44,42,41,0.12)] transition-all duration-500 hover:border-[#E67E22]/40 hover:shadow-[0_16px_48px_-12px_rgba(230,126,34,0.2)]">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="sm:hidden font-black text-[#E67E22] text-sm">{step.glyph}</span>
                  <StatusPill status={step.status} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 group-hover:text-[#E67E22] transition-colors">
                  {step.title}
                </h2>
                <p className="text-[#5A5653] text-base leading-relaxed mb-5">{step.hook}</p>

                <ul className="space-y-2 mb-6">
                  {step.youGet.map((line) => (
                    <li key={line} className="flex gap-3 text-sm text-[#5A5653]">
                      <span className="text-[#E67E22] shrink-0 mt-0.5" aria-hidden>
                        ◆
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={step.primary.href}
                    className="inline-flex px-5 py-2.5 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22] transition-colors"
                  >
                    {step.primary.label}
                  </Link>
                  {step.secondary && (
                    <Link
                      href={step.secondary.href}
                      className="inline-flex px-5 py-2.5 rounded-xl border border-[#D1CEC7] text-[#5A5653] text-[10px] font-bold uppercase tracking-widest hover:border-[#E67E22] hover:text-[#E67E22] transition-colors"
                    >
                      {step.secondary.label}
                    </Link>
                  )}
                </div>
              </article>
            </li>
          </ScrollReveal>
        ))}
      </ol>

      <ScrollReveal index={5}>
        <section className="mt-16 p-8 sm:p-10 rounded-3xl border-2 border-[#C4A882]/50 bg-gradient-to-br from-[#2C2A29] to-[#3d3a38] text-[#F9F7F3] relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#E67E22]/20 blur-3xl pointer-events-none"
            aria-hidden
          />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C4A882] mb-3 relative">
            One drawer — not four apps
          </p>
          <h2 className="text-3xl font-bold mb-3 relative">The Silk Vault</h2>
          <BalancedText
            className="text-[#E8E5DF]/90 text-base mb-6 relative"
            lines={[
              "Everything you save lands in one place —",
              "analyzer reports, brand locks, studio briefs,",
              "& checkout orders. No hunting across tabs.",
            ]}
          />
          <ul className="grid sm:grid-cols-2 gap-3 mb-8 text-sm text-[#C4A882]/90 relative">
            <li className="flex gap-2">
              <span className="text-[#E67E22]">→</span> Reports from the Analyzer
            </li>
            <li className="flex gap-2">
              <span className="text-[#E67E22]">→</span> Identity packages you locked
            </li>
            <li className="flex gap-2">
              <span className="text-[#E67E22]">→</span> Studio briefs & build notes
            </li>
            <li className="flex gap-2">
              <span className="text-[#E67E22]">→</span> Domain & checkout status
            </li>
          </ul>
          <Link
            href="/vault"
            className="inline-flex px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#F9F7F3] hover:text-[#2C2A29] transition-colors relative"
          >
            Open your vault
          </Link>
        </section>
      </ScrollReveal>

      <ScrollReveal index={6}>
        <section className="mt-12 p-6 rounded-2xl border border-dashed border-[#C4A882]/60 bg-[#C4A882]/5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9C7C5B] mb-4 text-center">
            Only on Archive Arac
          </p>
          <ul className="space-y-3">
            {onlyHere.map((line) => (
              <li key={line} className="text-sm text-[#5A5653] text-center leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal index={7}>
        <section className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B8B5AE] mb-4">
            New here?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/analyze"
              className="px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2C2A29] transition-colors"
            >
              Start with a URL
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-[#D1CEC7] text-[#5A5653] text-[10px] font-bold uppercase tracking-widest hover:border-[#E67E22] transition-colors"
            >
              Browse the index
            </Link>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal index={8}>
        <div className="mt-14 p-6 rounded-2xl bg-[#F9F7F3] border border-[#E8E5DF] text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B8B5AE] mb-2">
            Live production
          </p>
          <a
            href={appUrl}
            className="text-lg font-bold text-[#E67E22] hover:underline break-all"
          >
            {appUrl.replace(/^https?:\/\//, "")} ↗
          </a>
        </div>
      </ScrollReveal>
    </div>
  );
}
