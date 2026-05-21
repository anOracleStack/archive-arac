import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillPaidLock } from "@/lib/checkout/fulfillPaidLock";

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
      await fulfillPaidLock({
        clientId,
        lockId,
        stripeSessionId: session.id,
        source: "stripe_webhook",
      });
    }
  }

  return NextResponse.json({ received: true });
}
