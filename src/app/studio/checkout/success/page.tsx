"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";
import { getOrCreateClientId } from "@/lib/clientId";
import { applyServerSnapshotToLocal, pullServerVault } from "@/lib/vaultSync";
import { getIdentityLock } from "@/lib/identityStore";

function SuccessInner() {
  const searchParams = useSearchParams();
  const lockId = searchParams.get("lock_id");
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("Confirming payment…");

  useEffect(() => {
    let cancelled = false;
    const clientId = getOrCreateClientId();

    const refreshLocal = async () => {
      const snapshot = await pullServerVault();
      if (snapshot) applyServerSnapshotToLocal(snapshot);
    };

    const pollStatus = async (attempt: number) => {
      if (!lockId || cancelled) return;
      const res = await fetch(
        `/api/checkout/status?clientId=${encodeURIComponent(clientId)}&lockId=${encodeURIComponent(lockId)}`
      );
      if (!res.ok) return;
      const data = (await res.json()) as { registered?: boolean; paid?: boolean; orderStatus?: string };
      if (data.registered || data.paid) {
        await refreshLocal();
        const lock = lockId ? getIdentityLock(lockId) : null;
        setStatus(
          lock?.status === "registered"
            ? "Payment confirmed — domains & hosting are in the fulfillment queue."
            : "Payment confirmed — sync vault for the latest order status."
        );
        return;
      }
      if (attempt < 8) {
        setTimeout(() => void pollStatus(attempt + 1), 2000);
      } else {
        setStatus(
          "Payment received — fulfillment may take a minute. Open vault → Orders or sync again."
        );
      }
    };

    const run = async () => {
      if (sessionId) {
        const verifyRes = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}&clientId=${encodeURIComponent(clientId)}`
        );
        if (verifyRes.ok) {
          const verify = (await verifyRes.json()) as { ok?: boolean; message?: string };
          if (verify.ok) {
            await refreshLocal();
            if (!cancelled) {
              setStatus(verify.message ?? "Payment confirmed & order fulfilled.");
            }
            return;
          }
        }
      }

      await refreshLocal();
      if (lockId && getIdentityLock(lockId)?.status === "registered") {
        if (!cancelled) {
          setStatus("Payment received — domains queued for registrar fulfillment.");
        }
        return;
      }

      if (!cancelled) setStatus("Waiting for payment confirmation…");
      void pollStatus(0);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [lockId, sessionId]);

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4 text-[#8BA896]">Payment successful</h1>
      <BalancedText text={status} className="text-[#5A5653] mb-8 mx-auto max-w-lg" />
      <div className="flex flex-wrap justify-center gap-3">
        {lockId && (
          <Link
            href={`/vault?tab=orders`}
            className="px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
          >
            View orders in vault
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
