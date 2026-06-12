"use client";

import { useState } from "react";
import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { PlatformShell } from "@/components/PlatformShell";
import { buildPlatforms, hostingTiers, socialConnectors } from "@/data/buildPlatforms";

const CONNECT_PLATFORMS = buildPlatforms.filter(
  (p) => !["cursor", "lovable"].includes(p.id)
);

export default function StudioPage() {
  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [wixUrl, setWixUrl] = useState("");

  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
          Studio
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Build, connect, <span className="text-[#E67E22]">host</span>
        </h1>
        <BalancedText
          className="text-lg text-[#5A5653] mb-10"
          lines={[
            "Start with Weave — describe the site you want",
            "& we save your answers to Vault.",
            "Already live? Connect & audit. Hosting",
            "& domains bundle with Identity Lock.",
          ]}
        />

        <section className="mb-16 p-8 rounded-3xl border border-[#E67E22]/30 bg-gradient-to-b from-[#E67E22]/8 to-white/80">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E67E22] mb-3 section-heading">
            Primary path
          </p>
          <h2 className="text-3xl font-bold mb-4">Describe your website with Weave</h2>
          <BalancedText
            className="text-sm text-[#5A5653] mb-6"
            lines={[
              "Chat through your business, vibe, goals,",
              "& pages. Saved to Vault. Full builds",
              "are on the way — tell us what you want now.",
            ]}
          />
          <Link
            href="/studio/weave"
            className="inline-flex px-8 py-3.5 rounded-xl bg-[#E67E22] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A29] transition-colors shadow-lg"
          >
            Open Weave workshop →
          </Link>
        </section>

        <FeatureExplainer
          className="mb-10 text-left"
          whatThisIs="Archive Arac Studio — describe a new site with Weave, pick hosting, connect existing platforms, & monitor social."
          youCan={[
            "Start a Weave session saved to Vault",
            "Bundle hosting with Identity Lock",
            "Connect Wix, analyze any URL, link social",
          ]}
        />

        <section className="mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C7C5B] mb-4 section-heading">
            Hosting plans
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {hostingTiers.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-[#E8E5DF] bg-white/80 p-6 flex flex-col"
              >
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-[#5A5653] mt-1">
                  {plan.sites} site{plan.sites > 1 ? "s" : ""} · {plan.domains} domain
                  {plan.domains > 1 ? "s" : ""}
                </p>
                <ul className="mt-4 space-y-2 text-sm flex-1">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#8BA896]">✓</span>
                      {item.replace("Cursor build credits", "Weave build credits")}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/studio/lock"
                  className="mt-6 w-full py-2.5 rounded-xl border border-[#2C2A29] text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A29] hover:text-white transition-colors text-center block"
                >
                  Bundle with Identity Lock
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <button
            type="button"
            onClick={() => setConnectOpen((v) => !v)}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C7C5B] mb-4 hover:text-[#E67E22] transition-colors"
          >
            Connect existing
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`transition-transform ${connectOpen ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {connectOpen && (
            <>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {CONNECT_PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedBuild(p.id)}
                    className={`text-left rounded-2xl border p-5 transition-all ${
                      selectedBuild === p.id
                        ? "border-[#E67E22] bg-[#E67E22]/5"
                        : "border-[#E8E5DF] bg-white/80 hover:border-[#C4A882]"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                          p.connectionStatus === "available"
                            ? "border-[#8BA896] text-[#5a7a68]"
                            : p.connectionStatus === "connect"
                              ? "border-[#E67E22] text-[#E67E22]"
                              : "border-[#D1CEC7] text-[#5A5653]"
                        }`}
                      >
                        {p.connectionStatus.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-[#E67E22] mt-1">{p.tagline}</p>
                    <p className="text-xs text-[#5A5653] mt-2">{p.forAudience}</p>
                  </button>
                ))}
              </div>

              {selectedBuild === "wix" && (
                <section className="mb-8 p-6 rounded-2xl border border-[#E8E5DF] bg-white/80 text-left">
                  <h3 className="font-bold mb-2 text-center">Connect your Wix site</h3>
                  <BalancedText
                    className="text-sm text-[#5A5653] mb-4"
                    lines={[
                      "Save Wix sites to your Vault, run Silk audits,",
                      "& align domains via Identity Lock.",
                    ]}
                  />
                  <input
                    value={wixUrl}
                    onChange={(e) => setWixUrl(e.target.value)}
                    placeholder="https://yoursite.wixsite.com/..."
                    className="w-full px-4 py-3 rounded-xl border border-[#D1CEC7] mb-3"
                  />
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Link
                      href="/studio/wix"
                      className="inline-block px-5 py-2.5 rounded-xl bg-[#E67E22] text-white text-xs font-bold uppercase tracking-widest"
                    >
                      Wix dashboard
                    </Link>
                    <Link
                      href={wixUrl ? `/analyze?url=${encodeURIComponent(wixUrl)}` : "/analyze"}
                      className="inline-block px-5 py-2.5 rounded-xl bg-[#2C2A29] text-white text-xs font-bold uppercase tracking-widest"
                    >
                      Quick analyze
                    </Link>
                  </div>
                </section>
              )}

              {selectedBuild === "existing" && (
                <section className="mb-8 p-6 rounded-2xl border border-[#E67E22]/30 bg-[#E67E22]/5 text-center">
                  <h3 className="font-bold mb-2">Already live somewhere?</h3>
                  <BalancedText
                    className="text-sm text-[#5A5653] mb-4"
                    lines={[
                      "Wix, WordPress, custom React — anything",
                      "with a URL — run the Silk Analyzer.",
                    ]}
                  />
                  <Link
                    href="/analyze"
                    className="inline-block px-5 py-2.5 rounded-xl bg-[#E67E22] text-white text-xs font-bold uppercase tracking-widest"
                  >
                    Open Silk Analyzer
                  </Link>
                </section>
              )}
            </>
          )}
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C7C5B] mb-4 section-heading">
            Social connections
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {socialConnectors.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-[#E8E5DF] bg-white/60 p-4"
              >
                <h3 className="font-bold text-sm">{s.name}</h3>
                <p className="text-xs text-[#5A5653] mt-2">{s.purpose}</p>
                <span className="inline-block mt-3 text-[9px] font-bold uppercase tracking-widest text-[#9C7C5B]">
                  {s.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#5A5653] mt-4 copy-balanced max-w-lg mx-auto">
            <span className="copy-balanced-line">
              <Link href="/studio/social" className="text-[#E67E22] font-bold hover:underline">
                Open social connections →
              </Link>{" "}
              for OAuth (monitoring only, not registration).
            </span>
            <br />
            <span className="copy-balanced-line">
              Pair with{" "}
              <Link href="/identity" className="text-[#E67E22] hover:underline">
                Identity Lock
              </Link>{" "}
              for handle availability scans.
            </span>
          </p>
        </section>
      </div>
    </PlatformShell>
  );
}
