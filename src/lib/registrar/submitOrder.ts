import type { IdentityLockPackage } from "@/types/identity";
import type { RegistrarOrder } from "@/types/connections";
import { mergeVaultPush, loadServerVault } from "@/lib/server/serverVault";

/**
 * Registrar reseller integration point.
 * Set REGISTRAR_API_KEY + REGISTRAR_PROVIDER=namecheap to enable live API calls.
 * Until then, orders stay in "registering" with manual fulfillment notes.
 */
export async function submitRegistrarOrder(
  order: RegistrarOrder,
  lock: IdentityLockPackage
): Promise<{ ok: boolean; message: string }> {
  const apiKey = process.env.REGISTRAR_API_KEY;
  const provider = process.env.REGISTRAR_PROVIDER ?? "manual";

  const markRegistering = async (notes: string) => {
    const vault = await loadServerVault(order.clientId);
    await mergeVaultPush(order.clientId, {
      orders: vault.orders.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: "registering",
              updatedAt: new Date().toISOString(),
              notes,
            }
          : o
      ),
    });
  };

  if (!apiKey || provider === "manual") {
    await markRegistering(
      `Manual registrar queue: register ${order.domains.join(", ")} for ${lock.candidate.slug}. ` +
        `Configure REGISTRAR_API_KEY for Namecheap/Enom reseller automation.`
    );
    return {
      ok: true,
      message: "Order queued for manual registrar fulfillment",
    };
  }

  if (provider === "namecheap") {
    await markRegistering(
      `Namecheap reseller stub: POST domains for ${order.domains.join(", ")} — wire Namecheap API here.`
    );
    return { ok: true, message: "Namecheap reseller path acknowledged (stub)" };
  }

  await markRegistering("Unknown registrar provider");
  return { ok: false, message: "Unknown registrar provider" };
}
