import { hostingTiers } from "@/data/buildPlatforms";
import type { IdentityLockPackage } from "@/types/identity";
import type { RegistrarOrder } from "@/types/connections";
import { loadServerVault, mergeVaultPush } from "@/lib/server/serverVault";
import { appendOpsEvent } from "@/lib/ops/opsQueue";

/**
 * Records hosting fulfillment steps (Vercel + DNS runbook).
 * Live auto-provision requires VERCEL_TOKEN / team integration — queued for ops until wired.
 */
export async function provisionHosting(
  order: RegistrarOrder,
  lock: IdentityLockPackage
): Promise<{ ok: boolean; message: string }> {
  const tier = hostingTiers.find((t) => t.id === order.hostingTierId) ?? hostingTiers[0];
  const runbook = [
    `Create or assign Vercel project for ${lock.brandName}`,
    `Add domains: ${order.domains.join(", ") || "(none selected)"}`,
    `Enable SSL + redirect www`,
    `Link analyzer health scan monthly`,
  ].join(" · ");

  const vault = await loadServerVault(order.clientId);
  const orders = vault.orders.map((o) =>
    o.id === order.id
      ? {
          ...o,
          hostingStatus: "provisioning" as const,
          updatedAt: new Date().toISOString(),
          notes: [o.notes, `Hosting (${tier.name}): ${runbook}`].filter(Boolean).join("\n"),
        }
      : o
  );
  await mergeVaultPush(order.clientId, { orders });

  await appendOpsEvent({
    type: "hosting",
    clientId: order.clientId,
    lockId: order.lockId,
    orderId: order.id,
    summary: `Provision ${tier.name} hosting for ${lock.candidate.slug}`,
    details: {
      tier: tier.id,
      monthlyUsd: String(tier.monthlyUsd),
      domains: order.domains.join(","),
      runbook,
    },
  });

  return {
    ok: true,
    message: `Hosting ${tier.name} queued for provisioning`,
  };
}
