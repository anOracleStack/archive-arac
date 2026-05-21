import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";

const phases = [
  {
    phase: "Phase 1 — Live",
    title: "Silk Analyzer",
    items: [
      "Full URL teardown: tech, design, UX, innovation vs gaps",
      "Compare two sites · strand recommendations",
      "Vault, share links, Markdown export",
    ],
    href: "/analyze",
    cta: "Open Analyzer",
  },
  {
    phase: "Phase 2 — Live",
    title: "Identity Lock",
    items: [
      "5 / 10 / 25 / 50 ranked name options",
      "Domain RDAP checks (.com, .io, .ai, …)",
      "Social rules + GitHub availability",
    ],
    href: "/identity",
    cta: "Identity Lock",
  },
  {
    phase: "Phase 3 — Live",
    title: "Studio",
    items: [
      "Hosting tiers · domain bundle",
      "Connect Wix, Lovable, any URL · Cursor build path",
      "Social OAuth (X, TikTok) — coming soon",
    ],
    href: "/studio",
    cta: "Studio",
  },
  {
    phase: "Phase 4 — Live",
    title: "Compose & Collections",
    items: [
      "Strand composer & weave manifest export",
      "Batch analyze up to 8 URLs",
      "Vault identity locks · checkout preview · Stripe/registrar next",
    ],
    href: "/compose",
    cta: "Compose",
  },
];

export default function MissionPage() {
  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
          <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
          Past Pluto
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Mission <span className="text-[#E67E22]">Control</span>
        </h1>
        <BalancedText
          className="text-lg text-[#5A5653] mb-12"
          lines={[
            "Archive Arac is evolving from exhibit",
            "into platform: forensics on any URL, strand",
            "recommendations, composable exports,",
            "& a vault for your audits — with agency-grade",
            "tooling on the horizon.",
          ]}
        />

        <div className="grid gap-6 text-left">
          {phases.map((p) => (
            <div
              key={p.phase}
              className="p-6 rounded-2xl border border-[#E8E5DF] bg-white/80 backdrop-blur-sm hover:border-[#E67E22]/30 transition-colors"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9C7C5B] mb-2">
                {p.phase}
              </p>
              <h2 className="text-2xl font-bold mb-3">{p.title}</h2>
              <ul className="space-y-2 mb-4">
                {p.items.map((item) => (
                  <li key={item} className="text-sm text-[#5A5653] flex gap-2">
                    <span className="text-[#E67E22]">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className="inline-flex text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
              >
                {p.cta} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-[#2C2A29] text-[#F9F7F3]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C4A882] mb-3">
            Production
          </p>
          <a
            href="https://archive-arac.vercel.app"
            className="text-xl font-bold hover:text-[#E67E22] transition-colors"
          >
            archive-arac.vercel.app ↗
          </a>
        </div>
      </div>
    </PlatformShell>
  );
}
