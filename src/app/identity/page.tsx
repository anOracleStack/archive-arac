"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";
import { IdentityResults } from "@/components/identity/IdentityResults";
import { IdentityTopPick } from "@/components/identity/IdentityTopPick";
import { saveIdentityLock } from "@/lib/identityStore";
import { exportIdentityMarkdown } from "@/lib/identityExport";
import type { IdentityCandidate, IdentityScanResult, IdentityTier } from "@/types/identity";

const TIERS: { value: IdentityTier; label: string; hint: string }[] = [
  { value: 5, label: "5 options", hint: "Deep check · all platforms" },
  { value: 10, label: "10 options", hint: "Balanced sweep" },
  { value: 25, label: "25 options", hint: "Wide net" },
  { value: 50, label: "50 options", hint: "Maximum discovery" },
];

const SCAN_STEPS = [
  "Generating slug variants",
  "Checking domains (RDAP)",
  "Validating social handles",
  "Scoring consistency",
];

export default function IdentityPage() {
  const [brandName, setBrandName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [industry, setIndustry] = useState("");
  const [tier, setTier] = useState<IdentityTier>(10);
  const [status, setStatus] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<IdentityScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState<IdentityCandidate | null>(null);
  const [vaultLink, setVaultLink] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setApproved(null);
    setVaultLink(null);
    setStatus("scanning");
    setScanStep(0);

    const stepTimer = window.setInterval(() => {
      setScanStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1));
    }, 2200);

    try {
      const res = await fetch("/api/identity/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, keywords, industry, tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setStatus("error");
    } finally {
      window.clearInterval(stepTimer);
    }
  };

  const handleApprove = (c: IdentityCandidate) => {
    if (!result) return;
    const lock = saveIdentityLock(result, c);
    setApproved(c);
    setVaultLink(lock.id);
  };

  const handleExport = (c: IdentityCandidate) => {
    if (!result) return;
    const md = exportIdentityMarkdown(result, c);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${c.slug}-identity-lock.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topCandidate = result?.candidates[0];

  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
          <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
          Identity Lock
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Names that <span className="text-[#E67E22]">line up</span>
        </h1>
        <BalancedText
          className="text-lg text-[#5A5653] mb-8"
          lines={[
            "Ranked domain + handle options across",
            ".com, .io, .ai, & more — with RDAP checks,",
            "live GitHub verification, & a claim playbook.",
            "Approve a package, pick hosting, & save to Vault.",
          ]}
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#E8E5DF] bg-white/80 p-6 text-left"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">
                Brand / project name
              </span>
              <input
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Oracle Vision Labs"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#D1CEC7] bg-[#F9F7F3] focus:outline-none focus:border-[#E67E22]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">
                Keywords (optional)
              </span>
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="weave, silk, arac"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#D1CEC7] bg-[#F9F7F3] focus:outline-none focus:border-[#E67E22]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">
                Industry (optional)
              </span>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="creative tech, agency"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#D1CEC7] bg-[#F9F7F3] focus:outline-none focus:border-[#E67E22]"
              />
            </label>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] block mb-3">
              How many options to generate?
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIERS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTier(t.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tier === t.value
                      ? "border-[#E67E22] bg-[#E67E22]/10"
                      : "border-[#D1CEC7] hover:border-[#C4A882]"
                  }`}
                >
                  <span className="block text-sm font-bold">{t.label}</span>
                  <span className="block text-[10px] text-[#5A5653] mt-0.5">{t.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "scanning"}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#E67E22] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2C2A29] transition-colors disabled:opacity-50"
          >
            {status === "scanning" ? "Scanning…" : "Scan & rank options"}
          </button>
        </form>

        {status === "scanning" && (
          <div className="mt-6 p-5 rounded-xl border border-[#E8E5DF] bg-[#F9F7F3]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#E67E22] mb-3">
              {SCAN_STEPS[scanStep]}
            </p>
            <div className="h-1.5 rounded-full bg-[#E8E5DF] overflow-hidden">
              <div
                className="h-full bg-[#E67E22] transition-all duration-500"
                style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-6 text-sm text-red-600 border border-red-200 bg-red-50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {approved && vaultLink && (
          <div className="mt-8 p-6 rounded-2xl border-2 border-[#8BA896] bg-[#8BA896]/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a7a68] mb-2">
              Saved to vault
            </p>
            <p className="font-bold text-lg">{approved.label}</p>
            <p className="text-sm text-[#5A5653] mt-2">
              <Link href={`/vault?tab=identity&id=${vaultLink}`} className="text-[#E67E22] hover:underline">
                View in vault
              </Link>
              {" · "}
              <Link href={`/studio/lock?id=${vaultLink}`} className="text-[#E67E22] hover:underline">
                Configure checkout
              </Link>
            </p>
          </div>
        )}

        {result && topCandidate && (
          <>
            <IdentityTopPick
              scan={result}
              candidate={topCandidate}
              onLock={() => handleApprove(topCandidate)}
              onExport={() => handleExport(topCandidate)}
            />
            {result.meta.cacheHits != null && (
              <p className="text-[10px] text-[#B8B5AE] mb-4">
                {result.candidates.length} candidates · {result.meta.cacheHits} unique domain lookups
              </p>
            )}
          </>
        )}

        {result && (
          <IdentityResults
            result={result}
            onApprove={handleApprove}
            onExport={handleExport}
          />
        )}

        <div className="mt-16 grid sm:grid-cols-3 gap-4 text-sm">
          <Link
            href="/studio"
            className="p-4 rounded-xl border border-[#E8E5DF] hover:border-[#E67E22] transition-colors"
          >
            <span className="font-bold block mb-1">Studio →</span>
            <span className="text-[#5A5653]">Hosting, builds, platform connect</span>
          </Link>
          <Link
            href="/analyze"
            className="p-4 rounded-xl border border-[#E8E5DF] hover:border-[#E67E22] transition-colors"
          >
            <span className="font-bold block mb-1">Analyzer →</span>
            <span className="text-[#5A5653]">Break down any live URL</span>
          </Link>
          <Link
            href="/vault"
            className="p-4 rounded-xl border border-[#E8E5DF] hover:border-[#E67E22] transition-colors"
          >
            <span className="font-bold block mb-1">Vault →</span>
            <span className="text-[#5A5653]">Reports, locks, briefs</span>
          </Link>
        </div>
      </div>
    </PlatformShell>
  );
}
