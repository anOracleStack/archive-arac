"use client";

import { useState } from "react";
import { syncVaultBidirectional } from "@/lib/vaultSync";

export function VaultSyncBar({ onSynced }: { onSynced?: () => void }) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sync = async () => {
    setBusy(true);
    setStatus(null);
    const result = await syncVaultBidirectional();
    setBusy(false);
    setStatus(result.message);
    if (result.ok) onSynced?.();
  };

  return (
    <div className="mb-8 p-4 rounded-xl border border-[#8BA896]/40 bg-[#8BA896]/10 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-[#2C2A29]">Server vault</p>
        <p className="text-xs text-[#5A5653]">
          Sync this browser with the Archive Arac server so locks, reports, and briefs persist
          across devices.
        </p>
        {status && <p className="text-xs text-[#5a7a68] mt-2">{status}</p>}
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={sync}
        className="px-5 py-2.5 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
      >
        {busy ? "Syncing…" : "Sync now"}
      </button>
    </div>
  );
}
