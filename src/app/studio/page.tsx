"use client";

import { useState } from "react";
import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { PlatformShell } from "@/components/PlatformShell";
import { buildPlatforms, hostingTiers, socialConnectors } from "@/data/buildPlatforms";
import { saveStudioBrief } from "@/lib/identityStore";

export default function StudioPage() {
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [wixUrl, setWixUrl] = useState("");
  const [cursorNote, setCursorNote] = useState("");
  const [briefSaved, setBriefSaved] = useState(false);

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
          className="text-lg text-[#5A5653] mb-12"
          lines={[
            "Nothing yet? We can build with you in Cursor.",
            "Already on Wix, Lovable, or a custom URL?",
            "Connect & audit. Hosting & domains bundle",
            "with Identity Lock — connect X & TikTok",
            "for read-only monitoring, or link Wix sites",
            "for deeper studio workflows.",
          ]}
        />

        <FeatureExplainer
          className="mb-10 text-left"
          whatThisIs="Build and connect—hosting tiers, Cursor/Wix/Lovable paths, social monitoring (X/TikTok OAuth, read-only), Wix site linking."
          youCan={[
            "Save studio briefs to Vault",
            "Deep-link to Social, Wix, or Identity Lock subflows",
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
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/studio/lock`}
                  className="mt-6 w-full py-2.5 rounded-xl border border-[#2C2A29] text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A29] hover:text-white transition-colors text-center block"
                >
                  Bundle with Identity Lock
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C7C5B] mb-4 section-heading">
            Build & connect platforms
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {buildPlatforms.map((p) => (
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
                <ul className="mt-3 space-y-1 text-xs text-[#5A5653]">
                  {p.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </section>

        {selectedBuild === "wix" && (
          <section className="mb-12 p-6 rounded-2xl border border-[#E8E5DF] bg-white/80">
            <h3 className="font-bold mb-2">Connect your Wix site</h3>
            <BalancedText
              className="text-sm text-[#5A5653] mb-4"
              lines={[
                "Save Wix sites to your vault, run Silk audits,",
                "& align domains via Identity Lock.",
                "Optional API token enables live site",
                "metadata from Wix REST.",
              ]}
            />
            <input
              value={wixUrl}
              onChange={(e) => setWixUrl(e.target.value)}
              placeholder="https://yoursite.wixsite.com/..."
              className="w-full px-4 py-3 rounded-xl border border-[#D1CEC7] mb-3"
            />
            <div className="flex flex-wrap gap-2">
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

        {selectedBuild === "cursor" && (
          <section className="mb-12 p-6 rounded-2xl border border-[#E8E5DF] bg-white/80">
            <h3 className="font-bold mb-2">Cursor build request</h3>
            <BalancedText
              className="text-sm text-[#5A5653] mb-4"
              lines={[
                "Tell us what you need — we pair Archive Arac",
                "analyzer + compose strands with a Cursor",
                "implementation in your repo (or ours).",
                "This is the path when you want us to ship it.",
              ]}
            />
            <textarea
              value={cursorNote}
              onChange={(e) => setCursorNote(e.target.value)}
              rows={4}
              placeholder="Pages, features, brand refs, deadline…"
              className="w-full px-4 py-3 rounded-xl border border-[#D1CEC7] mb-3"
            />
            <button
              type="button"
              disabled={!cursorNote.trim()}
              onClick={() => {
                saveStudioBrief("cursor", "Cursor build brief", cursorNote);
                setBriefSaved(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#E67E22] text-white text-xs font-bold uppercase tracking-widest disabled:opacity-40"
            >
              Save brief to vault
            </button>
            {briefSaved && (
              <p className="text-xs text-[#5a7a68] mt-3">
                Saved.{" "}
                <Link href="/vault?tab=briefs" className="text-[#E67E22] hover:underline">
                  View in vault →
                </Link>
              </p>
            )}
          </section>
        )}

        {selectedBuild === "lovable" && (
          <section className="mb-12 p-6 rounded-2xl border border-[#E8E5DF] bg-white/80">
            <h3 className="font-bold mb-2">Lovable project</h3>
            <BalancedText
              className="text-sm text-[#5A5653] mb-4"
              lines={[
                "Paste your Lovable preview URL for a full",
                "Silk audit — stack, UX, & innovation gaps.",
              ]}
            />
            <Link
              href="/analyze"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#2C2A29] text-white text-xs font-bold uppercase tracking-widest"
            >
              Analyze with Silk
            </Link>
          </section>
        )}

        {selectedBuild === "existing" && (
          <section className="mb-12 p-6 rounded-2xl border border-[#E67E22]/30 bg-[#E67E22]/5">
            <h3 className="font-bold mb-2">Already live somewhere?</h3>
            <BalancedText
              className="text-sm text-[#5A5653] mb-4"
              lines={[
                "Wix, WordPress, custom React — anything",
                "with a URL — dump it in the Analyzer for",
                "tech stack, UX, innovation highlights, & gaps.",
              ]}
            />
            <Link
              href="/analyze"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#E67E22] text-white text-xs font-bold uppercase tracking-widest"
            >
              Open full Analyzer
            </Link>
          </section>
        )}

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
