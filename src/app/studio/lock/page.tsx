"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";
import { hostingTiers } from "@/data/buildPlatforms";
import {
  estimateLockTotals,
  getIdentityLock,
  listIdentityLocks,
  updateIdentityLock,
} from "@/lib/identityStore";
import type { IdentityLockPackage } from "@/types/identity";
import { ClaimChecklist } from "@/components/identity/ClaimChecklist";
import { payWithStripe } from "@/lib/checkout/payWithStripe";

function LockContent() {
  const searchParams = useSearchParams();
  const lockId = searchParams.get("id");
  const slugParam = searchParams.get("slug");

  const [lock, setLock] = useState<IdentityLockPackage | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);

  useEffect(() => {
    if (lockId) {
      setLock(getIdentityLock(lockId));
      return;
    }
    if (slugParam) {
      const found = listIdentityLocks().find((l) => l.candidate.slug === slugParam);
      setLock(found ?? null);
    }
  }, [lockId, slugParam]);

  if (!lock) {
    return (
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">No lock package yet</h1>
        <BalancedText
          className="text-[#5A5653] mb-8"
          lines={[
            "Run an identity scan & approve a candidate,",
            "or open a saved lock from the vault.",
          ]}
        />
        <Link
          href="/identity"
          className="inline-flex px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest"
        >
          Identity Lock →
        </Link>
      </div>
    );
  }

  const totals = estimateLockTotals(lock);
  const availableDomains = lock.candidate.domains.filter((d) => d.status === "available");

  const toggleDomain = (fqdn: string) => {
    const has = lock.selectedDomains.includes(fqdn);
    const selected = has
      ? lock.selectedDomains.filter((d) => d !== fqdn)
      : [...lock.selectedDomains, fqdn];
    updateIdentityLock(lock.id, { selectedDomains: selected });
    setLock({ ...lock, selectedDomains: selected });
  };

  const setHosting = (tierId: string) => {
    const tier = hostingTiers.find((t) => t.id === tierId);
    updateIdentityLock(lock.id, {
      hostingTierId: tierId,
      estimatedMonthlyUsd: tier?.monthlyUsd ?? 19,
    });
    setLock({
      ...lock,
      hostingTierId: tierId,
      estimatedMonthlyUsd: tier?.monthlyUsd ?? 19,
    });
  };

  const startCheckout = () => {
    updateIdentityLock(lock.id, { status: "checkout_pending" });
    setLock({ ...lock, status: "checkout_pending" });
    setSavedMsg(
      "Checkout preview saved to Vault. Use Pay with Stripe when STRIPE_SECRET_KEY is configured on the server."
    );
  };

  const stripeCheckout = async () => {
    if (lock.selectedDomains.length === 0) {
      setSavedMsg("Select at least one domain to register before checkout.");
      return;
    }
    setPayBusy(true);
    setSavedMsg(null);
    const result = await payWithStripe(lock);
    setPayBusy(false);
    if (!result.ok) {
      setSavedMsg(result.error ?? "Stripe checkout unavailable");
    }
  };

  return (
    <div className="relative z-10 pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <Link
        href="/vault?tab=identity"
        className="inline-flex mb-6 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline"
      >
        ← Vault · identity locks
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mb-2">
        Lock package · <span className="text-[#E67E22]">{lock.candidate.label}</span>
      </h1>
      <p className="text-sm text-[#5A5653] mb-8 font-mono">{lock.candidate.slug}</p>

      <section className="mb-8 p-6 rounded-2xl border border-[#E8E5DF] bg-white">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] mb-4">
          Domains to register
        </h2>
        {availableDomains.length === 0 ? (
          <BalancedText
            text="No RDAP-available domains in this pick — try another candidate."
            className="text-sm text-[#5A5653] mx-auto"
          />
        ) : (
          <ul className="space-y-2">
            {availableDomains.map((d) => (
              <li key={d.fqdn}>
                <label className="flex items-center gap-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={lock.selectedDomains.includes(d.fqdn)}
                    onChange={() => toggleDomain(d.fqdn)}
                    className="rounded border-[#D1CEC7]"
                  />
                  <span className="font-mono">{d.fqdn}</span>
                  <span className="text-[10px] font-bold uppercase text-[#8BA896]">available</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] mb-4">
          Hosting tier
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {hostingTiers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setHosting(t.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                lock.hostingTierId === t.id
                  ? "border-[#E67E22] bg-[#E67E22]/10"
                  : "border-[#D1CEC7] hover:border-[#C4A882]"
              }`}
            >
              <span className="font-bold block">{t.name}</span>
              <span className="text-[#E67E22] font-bold">${t.monthlyUsd}/mo</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8 p-6 rounded-2xl border-2 border-[#2C2A29]/10 bg-[#F9F7F3]">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653] mb-4">
          Estimate (preview)
        </h2>
        <ul className="space-y-2 text-sm text-[#2C2A29]">
          <li className="flex justify-between">
            <span>Domains ({lock.selectedDomains.length} × ~$14/yr)</span>
            <span>${totals.domainsYearly}/yr</span>
          </li>
          <li className="flex justify-between">
            <span>Hosting ({lock.hostingTierId})</span>
            <span>${totals.hostingMonthly}/mo</span>
          </li>
          <li className="flex justify-between font-bold pt-2 border-t border-[#E8E5DF]">
            <span>First-year total (approx.)</span>
            <span className="text-[#E67E22]">${totals.firstYearTotal}</span>
          </li>
        </ul>
        <p className="text-xs text-[#B8B5AE] mt-4">
          Live pricing via registrar reseller + Stripe at launch. Bundle is designed to undercut
          separate domain + hosting + agency setup fees.
        </p>
      </section>

      <ClaimChecklist candidate={lock.candidate} />

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={payBusy}
          onClick={stripeCheckout}
          className="px-8 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2C2A29] disabled:opacity-50"
        >
          {payBusy ? "Redirecting…" : "Pay with Stripe"}
        </button>
        <button
          type="button"
          onClick={startCheckout}
          className="px-8 py-3 rounded-xl border border-[#E67E22] text-[#E67E22] text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]/10"
        >
          Save preview only
        </button>
        <Link
          href="/studio"
          className="px-8 py-3 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest hover:border-[#E67E22]"
        >
          Studio builds
        </Link>
      </div>

      {savedMsg && (
        <p className="mt-6 text-sm text-[#5a7a68] border border-[#8BA896]/40 bg-[#8BA896]/10 rounded-xl px-4 py-3">
          {savedMsg}{" "}
          <Link href={`/vault?tab=identity&id=${lock.id}`} className="text-[#E67E22] hover:underline">
            View in vault →
          </Link>
        </p>
      )}

      {lock.status === "checkout_pending" && (
        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#E67E22]">
          Status: checkout pending
        </p>
      )}
    </div>
  );
}

export default function StudioLockPage() {
  return (
    <PlatformShell>
      <Suspense fallback={<div className="relative z-10 pt-32 px-6">Loading…</div>}>
        <LockContent />
      </Suspense>
    </PlatformShell>
  );
}
