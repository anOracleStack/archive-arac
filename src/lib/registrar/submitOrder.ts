import type { IdentityLockPackage } from "@/types/identity";
import type { RegistrarOrder } from "@/types/connections";
import { mergeVaultPush, loadServerVault } from "@/lib/server/serverVault";
import { namecheapRegisterDomains, getNamecheapConfig } from "@/lib/registrar/namecheapApi";
import { appendOpsEvent } from "@/lib/ops/opsQueue";

/**
 * Registrar reseller integration point.
 * Set REGISTRAR_API_KEY + REGISTRAR_API_USER + REGISTRAR_USERNAME + NAMECHEAP_CLIENT_IP for Namecheap.
 * Until then, orders stay in "registering" with manual fulfillment notes.
 */
export async function submitRegistrarOrder(
  order: RegistrarOrder,
  lock: IdentityLockPackage
): Promise<{ ok: boolean; message: string }> {
  const provider = process.env.REGISTRAR_PROVIDER ?? "manual";
  const namecheapReady = getNamecheapConfig() !== null;

  const markRegistering = async (notes: string, registrarProvider: RegistrarOrder["registrarProvider"]) => {
    const vault = await loadServerVault(order.clientId);
    await mergeVaultPush(order.clientId, {
      orders: vault.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "registering",
              registrarProvider,
              updatedAt: new Date().toISOString(),
              notes,
            }
          : o
      ),
    });
  };

  if (provider === "manual" || !namecheapReady) {
    const note =
      `Manual registrar queue: register ${order.domains.join(", ")} for ${lock.candidate.slug}. ` +
      `Set REGISTRAR_PROVIDER=namecheap & Namecheap API env vars for automation.`;
    await markRegistering(note, "manual");
    await appendOpsEvent({
      type: "registrar",
      clientId: order.clientId,
      lockId: order.lockId,
      orderId: order.id,
      summary: `Manual domain registration: ${order.domains.join(", ")}`,
      details: { slug: lock.candidate.slug, domains: order.domains.join(",") },
    });
    return {
      ok: true,
      message: "Order queued for manual registrar fulfillment",
    };
  }

  if (provider === "namecheap") {
    await markRegistering(
      `Submitting ${order.domains.join(", ")} via Namecheap API…`,
      "namecheap_reseller"
    );
    const result = await namecheapRegisterDomains(order.domains);
    const vault = await loadServerVault(order.clientId);
    const nextStatus = result.ok ? ("complete" as const) : ("failed" as const);
    await mergeVaultPush(order.clientId, {
      orders: vault.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
              notes: [o.notes, result.message, ...result.details].filter(Boolean).join("\n"),
            }
          : o
      ),
    });
    await appendOpsEvent({
      type: "registrar",
      clientId: order.clientId,
      lockId: order.lockId,
      orderId: order.id,
      summary: result.message,
      details: { domains: order.domains.join(","), provider: "namecheap" },
    });
    return { ok: result.ok, message: result.message };
  }

  await markRegistering("Unknown registrar provider", "manual");
  return { ok: false, message: "Unknown registrar provider" };
}
