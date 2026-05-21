import { getOrCreateClientId } from "@/lib/clientId";
import type { IdentityLockPackage } from "@/types/identity";

export async function payWithStripe(lock: IdentityLockPackage): Promise<{
  ok: boolean;
  url?: string;
  error?: string;
}> {
  const clientId = getOrCreateClientId();
  const res = await fetch("/api/checkout/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, lock }),
  });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok) {
    return { ok: false, error: data.error ?? "Checkout unavailable" };
  }
  if (data.url) {
    window.location.href = data.url;
    return { ok: true, url: data.url };
  }
  return { ok: false, error: "No checkout URL returned" };
}
