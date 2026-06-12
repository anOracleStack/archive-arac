"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlatformShell } from "@/components/PlatformShell";
import { VaultTabs, useVaultTab } from "@/components/vault/VaultTabs";
import { listVault, removeFromVault, getVaultEntry, type VaultEntry } from "@/lib/reportStore";
import {
  listIdentityLocks,
  removeIdentityLock,
  getIdentityLock,
} from "@/lib/identityStore";
import { listStudioBriefs, removeStudioBrief } from "@/lib/identityStore";
import { listWeaveSessions, removeWeaveSession, getWeaveSession } from "@/lib/weaveStore";
import type { WeaveSession } from "@/types/weave";
import { AnalyzerResults } from "@/components/AnalyzerResults";
import { ClaimChecklist } from "@/components/identity/ClaimChecklist";
import { BalancedText } from "@/components/BalancedText";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { LoreTerm } from "@/components/LoreTerm";
import { VaultSyncBar } from "@/components/vault/VaultSyncBar";
import { syncVaultBidirectional, applyServerSnapshotToLocal, pullServerVault } from "@/lib/vaultSync";
import type { RegistrarOrder } from "@/types/connections";
import type { ServerVaultSnapshot } from "@/lib/server/serverVault";

function weaveStatusLabel(status: string): string {
  switch (status) {
    case "intake_complete":
      return "Brief saved";
    case "draft":
      return "In progress";
    default:
      return status.replace(/_/g, " ");
  }
}

function VaultInner() {
  const searchParams = useSearchParams();
  const tab = useVaultTab();
  const viewId = searchParams.get("id");

  const [reports, setReports] = useState<VaultEntry[]>([]);
  const [locks, setLocks] = useState(listIdentityLocks());
  const [briefs, setBriefs] = useState(listStudioBriefs());
  const [weaves, setWeaves] = useState<WeaveSession[]>([]);
  const [viewReport, setViewReport] = useState<VaultEntry | null>(null);
  const [viewLock, setViewLock] = useState(getIdentityLock(viewId ?? "") ?? null);
  const [viewWeave, setViewWeave] = useState<WeaveSession | null>(null);
  const [orders, setOrders] = useState<RegistrarOrder[]>([]);
  const [serverMeta, setServerMeta] = useState<Pick<ServerVaultSnapshot, "social" | "wix">>({
    social: [],
    wix: [],
  });

  const applySnapshot = (snapshot: ServerVaultSnapshot) => {
    applyServerSnapshotToLocal(snapshot);
    setOrders(snapshot.orders ?? []);
    setServerMeta({ social: snapshot.social ?? [], wix: snapshot.wix ?? [] });
    refresh();
  };

  const refresh = () => {
    setReports(listVault());
    setLocks(listIdentityLocks());
    setBriefs(listStudioBriefs());
    setWeaves(listWeaveSessions());
  };

  useEffect(() => {
    void (async () => {
      const result = await syncVaultBidirectional();
      if (result.snapshot) applySnapshot(result.snapshot);
      else {
        const snap = await pullServerVault();
        if (snap) {
          setOrders(snap.orders ?? []);
          setServerMeta({ social: snap.social ?? [], wix: snap.wix ?? [] });
        }
        refresh();
      }
    })();
  }, []);

  useEffect(() => {
    if (tab === "reports" && viewId) {
      setViewReport(getVaultEntry(viewId));
    } else {
      setViewReport(null);
    }
    if (tab === "identity" && viewId) {
      setViewLock(getIdentityLock(viewId));
    } else if (tab !== "identity") {
      setViewLock(null);
    }
    if (tab === "weave" && viewId) {
      setViewWeave(getWeaveSession(viewId));
    } else if (tab !== "weave") {
      setViewWeave(null);
    }
  }, [viewId, tab]);

  if (viewReport) {
    return (
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <Link
          href="/vault?tab=reports"
          className="inline-flex mb-6 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
        >
          ← Back to vault
        </Link>
        <h1 className="text-3xl font-bold mb-2">{viewReport.label}</h1>
        <p className="text-sm text-[#B8B5AE] mb-8">
          Saved {new Date(viewReport.savedAt).toLocaleString()}
        </p>
        <AnalyzerResults result={viewReport.result} />
      </div>
    );
  }

  if (viewWeave) {
    return (
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-3xl mx-auto text-center">
        <Link
          href="/vault?tab=weave"
          className="inline-flex mb-6 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
        >
          ← Back to vault
        </Link>
        <h1 className="text-3xl font-bold mb-2">{viewWeave.businessName}</h1>
        <p className="text-sm text-[#B8B5AE] mb-8">
          {weaveStatusLabel(viewWeave.status)} · {new Date(viewWeave.savedAt).toLocaleString()}
        </p>
        <div className="text-left space-y-4 p-6 rounded-2xl border border-[#E8E5DF] bg-white mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B]">Building</p>
            <p className="text-sm text-[#2C2A29] mt-1">{viewWeave.building}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B]">Vibe</p>
            <p className="text-sm text-[#2C2A29] mt-1">{viewWeave.vibe}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B]">Goals</p>
            <p className="text-sm text-[#2C2A29] mt-1">{viewWeave.goals}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B]">Pages</p>
            <p className="text-sm text-[#2C2A29] mt-1">{viewWeave.pages}</p>
          </div>
        </div>
        <Link
          href="/studio/weave"
          className="inline-flex px-5 py-2.5 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
        >
          Start new Weave →
        </Link>
      </div>
    );
  }

  if (viewLock) {
    return (
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <Link
          href="/vault?tab=identity"
          className="inline-flex mb-6 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
        >
          ← Back to vault
        </Link>
        <h1 className="text-3xl font-bold mb-2">{viewLock.candidate.label}</h1>
        <p className="text-sm text-[#B8B5AE] mb-2">
          {viewLock.status} · {new Date(viewLock.savedAt).toLocaleString()}
        </p>
        <p className="text-sm font-mono text-[#5A5653] mb-6">{viewLock.candidate.slug}</p>
        <Link
          href={`/studio/lock?id=${encodeURIComponent(viewLock.id)}`}
          className="inline-flex mb-8 px-5 py-2.5 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
        >
          Open checkout →
        </Link>
        <ClaimChecklist candidate={viewLock.candidate} />
      </div>
    );
  }

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto text-center">
      <LoreTerm
        className="mb-6"
        term="Vault"
        plain={[
          "Your saved drawer — reports, brand locks,",
          "Weave briefs, & orders in one place.",
        ]}
      />
      <h1 className="text-5xl font-bold tracking-tight mb-4">
        Your <span className="text-[#E67E22]">saved work</span>
      </h1>
      <BalancedText
        className="text-[#5A5653] mb-6"
        lines={[
          "Synced to this browser & our server —",
          "open any tab below to review or delete.",
        ]}
      />

      <FeatureExplainer
        className="mb-6"
        loreTerm="Silk Vault"
        plainMeaning="One drawer for Silk reports, Identity Lock packages, Weave site briefs, studio notes, & checkout orders."
        whatThisIs="Everything you save across Archive Arac lives here. Sync when you switch devices or browsers."
        youCan={[
          "Review, delete, or sync saved items",
          "Open deep links (?id=) from checkout or email",
        ]}
      />

      <VaultSyncBar
        onSynced={() => {
          void pullServerVault().then((snap) => {
            if (snap) applySnapshot(snap);
            else refresh();
          });
        }}
      />

      <VaultTabs>
        {tab === "reports" && (
          <>
            {reports.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-[#D1CEC7] text-center">
                <BalancedText text="No reports yet." className="text-[#5A5653] mb-4 mx-auto" />
                <Link
                  href="/analyze"
                  className="inline-flex px-6 py-3 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]"
                >
                  Open Silk Analyzer →
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {reports.map((e) => (
                  <li
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-[#E8E5DF] bg-white"
                  >
                    <div>
                      <p className="font-bold">{e.label}</p>
                      <p className="text-sm text-[#E67E22]">{e.result.url}</p>
                      <p className="text-xs text-[#B8B5AE] mt-1">
                        Score {e.result.overview.score} · {new Date(e.savedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/vault?tab=reports&id=${encodeURIComponent(e.id)}`}
                        className="px-4 py-2 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          removeFromVault(e.id);
                          refresh();
                        }}
                        className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "identity" && (
          <>
            {locks.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-[#D1CEC7] text-center">
                <BalancedText text="No identity locks yet." className="text-[#5A5653] mb-4 mx-auto" />
                <Link
                  href="/identity"
                  className="inline-flex px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
                >
                  Identity Lock →
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {locks.map((l) => (
                  <li
                    key={l.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-[#E8E5DF] bg-white"
                  >
                    <div>
                      <p className="font-bold">{l.candidate.label}</p>
                      <p className="text-sm font-mono text-[#5A5653]">{l.candidate.slug}</p>
                      <p className="text-xs text-[#B8B5AE] mt-1">
                        Score {l.candidate.score} · {l.status} · {l.selectedDomains.length} domains
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/vault?tab=identity&id=${encodeURIComponent(l.id)}`}
                        className="px-4 py-2 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]"
                      >
                        View
                      </Link>
                      <Link
                        href={`/studio/lock?id=${encodeURIComponent(l.id)}`}
                        className="px-4 py-2 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest hover:border-[#E67E22]"
                      >
                        Checkout
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          removeIdentityLock(l.id);
                          refresh();
                        }}
                        className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "orders" && (
          <>
            {orders.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-[#D1CEC7] text-center">
                <BalancedText
                  text="No registrar or hosting orders yet. Complete checkout from an identity lock."
                  className="text-[#5A5653] mb-4 mx-auto max-w-md"
                />
                <Link
                  href="/identity"
                  className="inline-flex px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
                >
                  Identity Lock →
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {orders.map((o) => {
                  const lock = locks.find((l) => l.id === o.lockId);
                  return (
                    <li
                      key={o.id}
                      className="p-5 rounded-2xl border border-[#E8E5DF] bg-white"
                    >
                      <div className="flex flex-wrap justify-between gap-2 mb-2">
                        <p className="font-bold">
                          {lock?.candidate.label ?? `Lock ${o.lockId.slice(0, 8)}`}
                        </p>
                        <span className="text-[10px] font-bold uppercase text-[#9C7C5B]">
                          {o.status}
                          {o.hostingStatus ? ` · hosting ${o.hostingStatus}` : ""}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-[#5A5653]">
                        {o.domains.join(", ") || "—"}
                      </p>
                      <p className="text-xs text-[#B8B5AE] mt-2">
                        {o.registrarProvider ?? "manual"} ·{" "}
                        {new Date(o.updatedAt).toLocaleString()}
                      </p>
                      {o.notes && (
                        <p className="text-xs text-[#5A5653] mt-2 whitespace-pre-wrap line-clamp-4">
                          {o.notes}
                        </p>
                      )}
                      {lock && (
                        <Link
                          href={`/vault?tab=identity&id=${encodeURIComponent(lock.id)}`}
                          className="inline-block mt-3 text-[10px] font-bold uppercase text-[#E67E22] hover:underline"
                        >
                          View lock →
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {(serverMeta.social.length > 0 || serverMeta.wix.length > 0) && (
              <div className="mt-10 p-5 rounded-2xl border border-[#E8E5DF] bg-[#F5F3EE]/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-3">
                  Connected platforms (server)
                </p>
                {serverMeta.social.length > 0 && (
                  <p className="text-sm text-[#5A5653] mb-1">
                    Social: {serverMeta.social.map((s) => s.platformId).join(", ")}
                  </p>
                )}
                {serverMeta.wix.length > 0 && (
                  <p className="text-sm text-[#5A5653]">
                    Wix: {serverMeta.wix.map((w) => w.displayName ?? w.siteUrl).join(", ")}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {tab === "weave" && (
          <>
            {weaves.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-[#D1CEC7] text-center">
                <BalancedText
                  lines={[
                    "No site briefs yet.",
                    "Tell us what you want your website to be.",
                  ]}
                  className="text-[#5A5653] mb-4 mx-auto"
                />
                <Link
                  href="/studio/weave"
                  className="inline-flex px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
                >
                  Describe your site →
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {weaves.map((w) => (
                  <li
                    key={w.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-[#E8E5DF] bg-white"
                  >
                    <div className="text-left">
                      <p className="font-bold">{w.businessName}</p>
                      <p className="text-sm text-[#5A5653] line-clamp-1">{w.building}</p>
                      <p className="text-xs text-[#B8B5AE] mt-1">
                        {weaveStatusLabel(w.status)} · {new Date(w.savedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/vault?tab=weave&id=${encodeURIComponent(w.id)}`}
                        className="px-4 py-2 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          removeWeaveSession(w.id);
                          refresh();
                        }}
                        className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {tab === "briefs" && (
          <>
            {briefs.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-[#D1CEC7] text-center">
                <BalancedText text="No studio briefs saved." className="text-[#5A5653] mb-4 mx-auto" />
                <Link
                  href="/studio/weave"
                  className="inline-flex px-6 py-3 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]"
                >
                  Weave →
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {briefs.map((b) => (
                  <li key={b.id} className="p-5 rounded-2xl border border-[#E8E5DF] bg-white">
                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                      <p className="font-bold">{b.title}</p>
                      <span className="text-[10px] font-bold uppercase text-[#9C7C5B]">
                        {b.platformId}
                      </span>
                    </div>
                    <p className="text-sm text-[#5A5653] whitespace-pre-wrap line-clamp-4">{b.body}</p>
                    {b.url && (
                      <p className="text-xs text-[#E67E22] mt-2 truncate">{b.url}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        removeStudioBrief(b.id);
                        refresh();
                      }}
                      className="mt-3 text-[10px] font-bold uppercase text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </VaultTabs>
    </div>
  );
}

export default function VaultPage() {
  return (
    <PlatformShell>
      <Suspense fallback={<div className="relative z-10 pt-32 px-6 text-[#5A5653]">Loading vault…</div>}>
        <VaultInner />
      </Suspense>
    </PlatformShell>
  );
}
