import type { IdentityLockPackage } from "@/types/identity";
import { estimateLockTotals } from "@/lib/identityStore";

export interface CheckoutLineItem {
  name: string;
  amountCents: number;
  quantity: number;
}

export function buildCheckoutFromLock(lock: IdentityLockPackage): {
  lineItems: CheckoutLineItem[];
  metadata: Record<string, string>;
} {
  const totals = estimateLockTotals(lock);
  const lineItems: CheckoutLineItem[] = [];

  if (lock.selectedDomains.length > 0) {
    const perDomainCents = Math.round((totals.domainsYearly / lock.selectedDomains.length) * 100);
    for (const fqdn of lock.selectedDomains) {
      lineItems.push({
        name: `Domain registration · ${fqdn}`,
        amountCents: perDomainCents,
        quantity: 1,
      });
    }
  }

  lineItems.push({
    name: `Hosting · ${lock.hostingTierId ?? "starter"} (12 months)`,
    amountCents: totals.hostingYearly * 100,
    quantity: 1,
  });

  return {
    lineItems,
    metadata: {
      lockId: lock.id,
      brandName: lock.brandName,
      slug: lock.candidate.slug,
      domains: lock.selectedDomains.join(","),
      hostingTierId: lock.hostingTierId ?? "starter",
    },
  };
}
