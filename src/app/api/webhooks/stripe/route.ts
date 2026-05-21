import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { loadServerVault, mergeVaultPush } from "@/lib/server/serverVault";
import { submitRegistrarOrder } from "@/lib/registrar/submitOrder";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const lockId = session.metadata?.lockId;
    const clientId = session.metadata?.clientId;

    if (lockId && clientId) {
      const vault = await loadServerVault(clientId);
      const lock = vault.identityLocks.find((l) => l.id === lockId);
      if (lock) {
        const locks = vault.identityLocks.map((l) =>
          l.id === lockId ? { ...l, status: "registered" as const } : l
        );
        const orders = vault.orders.map((o) =>
          o.lockId === lockId
            ? { ...o, status: "paid" as const, updatedAt: new Date().toISOString() }
            : o
        );
        await mergeVaultPush(clientId, { identityLocks: locks, orders });

        const order = orders.find((o) => o.lockId === lockId);
        if (order) {
          await submitRegistrarOrder(order, { ...lock, status: "registered" });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
