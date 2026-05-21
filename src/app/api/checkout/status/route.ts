import { NextRequest, NextResponse } from "next/server";
import { loadServerVault } from "@/lib/server/serverVault";

export const runtime = "nodejs";

/** GET ?clientId=&lockId= — poll fulfillment without Stripe */
export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  const lockId = req.nextUrl.searchParams.get("lockId");
  if (!clientId || !lockId) {
    return NextResponse.json({ error: "clientId & lockId required" }, { status: 400 });
  }

  const vault = await loadServerVault(clientId);
  const lock = vault.identityLocks.find((l) => l.id === lockId);
  const order = vault.orders.find((o) => o.lockId === lockId);

  return NextResponse.json({
    lockStatus: lock?.status ?? null,
    orderStatus: order?.status ?? null,
    hostingStatus: order?.hostingStatus ?? null,
    registered: lock?.status === "registered",
    paid: order?.status === "paid" || order?.status === "registering" || order?.status === "complete",
  });
}
