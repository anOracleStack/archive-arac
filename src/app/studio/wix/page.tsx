"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";
import { getOrCreateClientId } from "@/lib/clientId";
import type { WixSiteConnection } from "@/types/connections";

export default function StudioWixPage() {
  const [sites, setSites] = useState<WixSiteConnection[]>([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const clientId = getOrCreateClientId();

  const load = async () => {
    const res = await fetch(`/api/wix/connect?clientId=${encodeURIComponent(clientId)}`);
    if (res.ok) {
      const data = (await res.json()) as { sites: WixSiteConnection[] };
      setSites(data.sites);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const connect = async () => {
    if (!siteUrl.trim()) return;
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/wix/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        siteUrl: siteUrl.trim(),
        apiToken: apiToken.trim() || undefined,
      }),
    });
    setBusy(false);
    const data = (await res.json()) as { error?: string; sites?: WixSiteConnection[] };
    if (!res.ok) {
      setMsg(data.error ?? "Connect failed");
      return;
    }
    setSites(data.sites ?? []);
    setMsg("Wix site linked — run Silk Analyzer anytime.");
    setSiteUrl("");
  };

  const remove = async (siteId: string) => {
    await fetch(
      `/api/wix/connect?clientId=${encodeURIComponent(clientId)}&siteId=${encodeURIComponent(siteId)}`,
      { method: "DELETE" }
    );
    load();
  };

  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-3xl mx-auto text-center">
        <Link
          href="/studio"
          className="inline-flex mb-6 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
        >
          ← Studio
        </Link>
        <h1 className="text-4xl font-bold mb-4">
          Wix <span className="text-[#E67E22]">connect</span>
        </h1>
        <BalancedText
          className="text-sm text-[#5A5653] mb-8"
          lines={[
            "Link live Wix sites for Silk audits,",
            "domain alignment via Identity Lock,",
            "& optional API token probing (Wix REST).",
            "Deeper MCP editor sync can plug in when your",
            "Wix app credentials are configured.",
          ]}
        />

        <section className="mb-10 p-6 rounded-2xl border border-[#E8E5DF] bg-white text-left">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] mb-4">
            Add site
          </h2>
          <input
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://yoursite.wixsite.com/mysite"
            className="w-full px-4 py-3 rounded-xl border border-[#D1CEC7] mb-3"
          />
          <input
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Optional Wix API token (server can use WIX_API_TOKEN)"
            className="w-full px-4 py-3 rounded-xl border border-[#D1CEC7] mb-4 font-mono text-xs"
          />
          <button
            type="button"
            disabled={busy || !siteUrl.trim()}
            onClick={connect}
            className="px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-40"
          >
            {busy ? "Connecting…" : "Connect site"}
          </button>
          {msg && <p className="text-xs text-[#5a7a68] mt-3">{msg}</p>}
        </section>

        {sites.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-4">
              Connected sites
            </h2>
            <ul className="space-y-3">
              {sites.map((s) => (
                <li
                  key={s.id}
                  className="p-4 rounded-xl border border-[#E8E5DF] bg-white/80"
                >
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <span className="font-bold">{s.displayName ?? s.siteUrl}</span>
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      className="text-[10px] font-bold uppercase text-[#9C7C5B] hover:text-[#E67E22]"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="font-mono text-xs text-[#5A5653] mb-3">{s.siteUrl}</p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/analyze?url=${encodeURIComponent(s.siteUrl)}`}
                      className="px-4 py-2 rounded-lg bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest"
                    >
                      Silk analyze
                    </Link>
                    <Link
                      href="/identity"
                      className="px-4 py-2 rounded-lg border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest"
                    >
                      Identity Lock
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PlatformShell>
  );
}
