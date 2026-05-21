import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillPaidLock } from "@/lib/checkout/fulfillPaidLock";
import { loadServerVault } from "@/lib/server/serverVault";

export const runtime = "nodejs";

/**
 * Client-side backup when Stripe webhook is delayed.
 * GET ?session_id=cs_...&clientId=...
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const clientId = req.nextUrl.searchParams.get("clientId");

  if (!sessionId || !clientId) {
    return NextResponse.json(
      { error: "session_id & clientId required" },
      { status: 400 }
    );
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({
      ok: false,
      paid: false,
      paymentStatus: session.payment_status,
      status: session.status,
    });
  }

  const lockId = session.metadata?.lockId;
  const metaClientId = session.metadata?.clientId;
  if (!lockId || metaClientId !== clientId) {
    return NextResponse.json({ error: "Session metadata mismatch" }, { status: 403 });
  }

  const result = await fulfillPaidLock({
    clientId,
    lockId,
    stripeSessionId: session.id,
    source: "checkout_verify",
  });

  const vault = await loadServerVault(clientId);
  const lock = vault.identityLocks.find((l) => l.id === lockId);
  const order = vault.orders.find((o) => o.lockId === lockId);

  return NextResponse.json({
    ok: result.ok,
    paid: true,
    alreadyFulfilled: result.alreadyFulfilled,
    message: result.message,
    lockStatus: lock?.status,
    orderStatus: order?.status,
    hostingStatus: order?.hostingStatus,
  });
}
