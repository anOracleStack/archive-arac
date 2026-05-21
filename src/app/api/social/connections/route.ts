import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { loadServerVault, loadOAuthTokens } from "@/lib/server/serverVault";

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  const vault = await loadServerVault(clientId);
  const connections = await Promise.all(
    vault.social.map(async (s) => ({
      ...s,
      hasToken: Boolean(await loadOAuthTokens(clientId, s.platformId)),
    }))
  );

  return NextResponse.json({ connections });
}
