"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlatformShell } from "@/components/PlatformShell";
import { getOrCreateClientId } from "@/lib/clientId";
import { applyServerSnapshotToLocal, pullServerVault } from "@/lib/vaultSync";
import { getIdentityLock } from "@/lib/identityStore";

function SuccessInner() {
  const searchParams = useSearchParams();
  const lockId = searchParams.get("lock_id");
  const [status, setStatus] = useState("Confirming payment…");

  useEffect(() => {
    const run = async () => {
      const clientId = getOrCreateClientId();
      const snapshot = await pullServerVault();
      if (snapshot) {
        applyServerSnapshotToLocal(snapshot);
      }
      if (lockId && getIdentityLock(lockId)) {
        setStatus("Payment received — domains queued for registrar fulfillment.");
      } else {
        setStatus("Payment received — refresh vault to see updated lock status.");
      }
    };
    void run();
  }, [lockId]);

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4 text-[#8BA896]">Payment successful</h1>
      <p className="text-[#5A5653] mb-8">{status}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {lockId && (
          <Link
            href={`/vault?tab=identity&id=${encodeURIComponent(lockId)}`}
            className="px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
          >
            View lock in vault
          </Link>
        )}
        <Link
          href="/studio"
          className="px-6 py-3 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest"
        >
          Studio
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <PlatformShell>
      <Suspense fallback={<div className="relative z-10 pt-32 px-6">Loading…</div>}>
        <SuccessInner />
      </Suspense>
    </PlatformShell>
  );
}
