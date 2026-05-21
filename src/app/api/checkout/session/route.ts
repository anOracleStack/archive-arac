import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { IdentityLockPackage } from "@/types/identity";
import { buildCheckoutFromLock } from "@/lib/checkout/buildSession";
import { loadServerVault, upsertIdentityLock, mergeVaultPush } from "@/lib/server/serverVault";
import type { RegistrarOrder } from "@/types/connections";
import { appOrigin } from "@/lib/oauth/state";

export const runtime = "nodejs";

function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = stripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in .env.local" },
      { status: 503 }
    );
  }

  let body: { clientId: string; lock: IdentityLockPackage };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { clientId, lock } = body;
  if (!clientId || !lock?.id) {
    return NextResponse.json({ error: "clientId and lock required" }, { status: 400 });
  }

  upsertIdentityLock(clientId, { ...lock, status: "checkout_pending" });

  const { lineItems, metadata } = buildCheckoutFromLock(lock);
  const origin = appOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/studio/checkout/success?session_id={CHECKOUT_SESSION_ID}&lock_id=${lock.id}`,
    cancel_url: `${origin}/studio/lock?id=${encodeURIComponent(lock.id)}`,
    metadata: { ...metadata, clientId },
    line_items: lineItems.map((li) => ({
      quantity: li.quantity,
      price_data: {
        currency: "usd",
        unit_amount: li.amountCents,
        product_data: { name: li.name },
      },
    })),
  });

  const vault = loadServerVault(clientId);
  const order: RegistrarOrder = {
    id: crypto.randomUUID(),
    lockId: lock.id,
    clientId,
    domains: lock.selectedDomains,
    hostingTierId: lock.hostingTierId ?? "starter",
    status: "pending",
    stripeSessionId: session.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    registrarProvider: process.env.REGISTRAR_PROVIDER === "namecheap"
      ? "namecheap_reseller"
      : "manual",
    notes: "Awaiting Stripe payment; registrar job queued on webhook",
  };

  mergeVaultPush(clientId, {
    orders: [order, ...vault.orders.filter((o) => o.lockId !== lock.id)].slice(0, 50),
  });

  return NextResponse.json({
    sessionId: session.id,
    url: session.url,
  });
}
