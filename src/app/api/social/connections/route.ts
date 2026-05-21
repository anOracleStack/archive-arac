import { NextRequest, NextResponse } from "next/server";
import { loadServerVault } from "@/lib/server/serverVault";
import { loadOAuthTokens } from "@/lib/server/serverVault";

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  const vault = loadServerVault(clientId);
  const connections = vault.social.map((s) => ({
    ...s,
    hasToken: Boolean(loadOAuthTokens(clientId, s.platformId)),
  }));

  return NextResponse.json({ connections });
}
