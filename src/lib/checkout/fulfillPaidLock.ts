import type { IdentityLockPackage } from "@/types/identity";
import type { RegistrarOrder } from "@/types/connections";
import { loadServerVault, mergeVaultPush } from "@/lib/server/serverVault";
import { submitRegistrarOrder } from "@/lib/registrar/submitOrder";
import { provisionHosting } from "@/lib/hosting/provisionHosting";
import { appendOpsEvent } from "@/lib/ops/opsQueue";

export interface FulfillPaidLockInput {
  clientId: string;
  lockId: string;
  stripeSessionId?: string;
  source: "stripe_webhook" | "checkout_verify";
}

export interface FulfillPaidLockResult {
  ok: boolean;
  alreadyFulfilled: boolean;
  lock?: IdentityLockPackage;
  order?: RegistrarOrder;
  message: string;
}

export async function fulfillPaidLock(
  input: FulfillPaidLockInput
): Promise<FulfillPaidLockResult> {
  const vault = await loadServerVault(input.clientId);
  const lock = vault.identityLocks.find((l) => l.id === input.lockId);
  if (!lock) {
    return { ok: false, alreadyFulfilled: false, message: "Lock not found" };
  }

  const existingOrder = vault.orders.find(
    (o) => o.lockId === input.lockId && o.status === "paid"
  );
  if (lock.status === "registered" && existingOrder) {
    return {
      ok: true,
      alreadyFulfilled: true,
      lock,
      order: existingOrder,
      message: "Already fulfilled",
    };
  }

  const now = new Date().toISOString();
  const order: RegistrarOrder = existingOrder ?? {
    id: crypto.randomUUID(),
    clientId: input.clientId,
    lockId: input.lockId,
    status: "paid",
    domains:
      lock.selectedDomains.length > 0
        ? lock.selectedDomains
        : lock.candidate.domains
            .filter((d) => d.status === "available")
            .map((d) => d.fqdn),
    hostingTierId: lock.hostingTierId ?? "starter",
    registrarProvider: "manual",
    hostingStatus: "pending",
    stripeSessionId: input.stripeSessionId,
    createdAt: now,
    updatedAt: now,
    notes: input.stripeSessionId
      ? `Stripe session ${input.stripeSessionId} (${input.source})`
      : `Paid via ${input.source}`,
  };

  const updatedOrder: RegistrarOrder = {
    ...order,
    status: "paid",
    updatedAt: now,
    notes: [order.notes, input.stripeSessionId ? `Stripe ${input.stripeSessionId}` : ""]
      .filter(Boolean)
      .join("\n"),
  };

  const updatedLock: IdentityLockPackage = {
    ...lock,
    status: "registered",
  };

  const vaultAfter = await loadServerVault(input.clientId);
  const mergedOrders = [
    updatedOrder,
    ...vaultAfter.orders.filter((o) => o.id !== updatedOrder.id),
  ];
  const mergedLocks = [
    updatedLock,
    ...vaultAfter.identityLocks.filter((l) => l.id !== updatedLock.id),
  ];
  await mergeVaultPush(input.clientId, {
    identityLocks: mergedLocks,
    orders: mergedOrders,
  });

  await appendOpsEvent({
    type: "payment",
    clientId: input.clientId,
    lockId: input.lockId,
    orderId: updatedOrder.id,
    summary: `Payment confirmed (${input.source})`,
    details: {
      stripeSessionId: input.stripeSessionId ?? "",
      domains: updatedOrder.domains.join(","),
    },
  });

  const registrarResult = await submitRegistrarOrder(updatedOrder, updatedLock);
  const hostingResult = await provisionHosting(updatedOrder, updatedLock);

  return {
    ok: true,
    alreadyFulfilled: false,
    lock: updatedLock,
    order: updatedOrder,
    message: [registrarResult.message, hostingResult.message].filter(Boolean).join(" · "),
  };
}
