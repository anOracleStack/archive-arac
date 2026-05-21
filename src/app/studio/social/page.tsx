"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";
import { getOrCreateClientId } from "@/lib/clientId";
import type { SocialConnection } from "@/types/connections";

function SocialInner() {
  const searchParams = useSearchParams();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const clientId = getOrCreateClientId();

  const load = async () => {
    const res = await fetch(
      `/api/social/connections?clientId=${encodeURIComponent(clientId)}`
    );
    if (res.ok) {
      const data = (await res.json()) as { connections: SocialConnection[] };
      setConnections(data.connections);
    }
  };

  useEffect(() => {
    load();
    const err = searchParams.get("error");
    const connected = searchParams.get("connected");
    if (err) setMsg(`Connection issue: ${err.replace(/_/g, " ")}`);
    if (connected) setMsg(`Connected ${connected} — monitoring enabled (read-only).`);
  }, [searchParams]);

  const connect = (platform: "x" | "tiktok") => {
    window.location.href = `/api/oauth/${platform}/start?clientId=${encodeURIComponent(clientId)}`;
  };

  const monitor = async (platformId: string) => {
    const res = await fetch("/api/social/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, platformId }),
    });
    if (res.ok) {
      const data = (await res.json()) as { notes: string[] };
      setMsg(data.notes.join(" "));
      load();
    }
  };

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 max-w-3xl mx-auto text-center">
      <Link
        href="/studio"
        className="inline-flex mb-6 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
      >
        ← Studio
      </Link>
      <h1 className="text-4xl font-bold mb-4">
        Social <span className="text-[#E67E22]">connections</span>
      </h1>
      <BalancedText
        className="text-sm text-[#5A5653] mb-8"
        lines={[
          "Connect X & TikTok for handle monitoring",
          "& profile alignment — not automatic registration.",
          <>
            Pair with{" "}
            <Link href="/identity" className="text-[#E67E22] hover:underline">
              Identity Lock
            </Link>{" "}
            for availability scans.
          </>,
        ]}
      />

      {msg && (
        <p className="mb-6 text-sm border border-[#C4A882]/50 bg-[#C4A882]/10 rounded-xl px-4 py-3 text-[#5A5653]">
          {msg}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="p-6 rounded-2xl border border-[#E8E5DF] bg-white">
          <h2 className="font-bold text-lg mb-2">X (Twitter)</h2>
          <p className="text-xs text-[#5A5653] mb-4">Read-only: username, display name</p>
          <button
            type="button"
            onClick={() => connect("x")}
            className="w-full py-2.5 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest"
          >
            Connect X
          </button>
        </div>
        <div className="p-6 rounded-2xl border border-[#E8E5DF] bg-white">
          <h2 className="font-bold text-lg mb-2">TikTok</h2>
          <p className="text-xs text-[#5A5653] mb-4">Read-only: basic profile info</p>
          <button
            type="button"
            onClick={() => connect("tiktok")}
            className="w-full py-2.5 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest"
          >
            Connect TikTok
          </button>
        </div>
      </div>

      {connections.length > 0 && (
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-4">
            Connected accounts
          </h2>
          <ul className="space-y-3">
            {connections.map((c) => (
              <li
                key={c.id}
                className="p-4 rounded-xl border border-[#E8E5DF] bg-white/80 flex flex-wrap justify-between gap-3"
              >
                <div>
                  <span className="font-bold capitalize">{c.platformId}</span>
                  {c.handle && (
                    <span className="ml-2 font-mono text-sm text-[#5A5653]">@{c.handle}</span>
                  )}
                  {c.profileUrl && (
                    <a
                      href={c.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-[#E67E22] mt-1 hover:underline"
                    >
                      View profile
                    </a>
                  )}
                  {c.monitorNotes && c.monitorNotes.length > 0 && (
                    <p className="text-xs text-[#5A5653] mt-2">{c.monitorNotes[0]}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => monitor(c.platformId)}
                  className="self-start px-4 py-2 rounded-lg border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest hover:border-[#E67E22]"
                >
                  Run monitor
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <BalancedText
        className="text-xs text-[#B8B5AE] mt-8 max-w-md mx-auto"
        lines={[
          "Requires X_OAUTH_* & TIKTOK_* env vars on the server.",
          "Tokens stay server-side in server vault",
          "(Vercel Blob in production).",
        ]}
      />
    </div>
  );
}

export default function StudioSocialPage() {
  return (
    <PlatformShell>
      <Suspense fallback={<div className="relative z-10 pt-32 px-6">Loading…</div>}>
        <SocialInner />
      </Suspense>
    </PlatformShell>
  );
}
