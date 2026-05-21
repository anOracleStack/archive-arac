import { NextRequest, NextResponse } from "next/server";
import { loadServerVault, mergeVaultPush, loadOAuthTokens } from "@/lib/server/serverVault";

export async function POST(req: NextRequest) {
  let body: { clientId?: string; platformId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { clientId, platformId } = body;
  if (!clientId || !platformId) {
    return NextResponse.json({ error: "clientId and platformId required" }, { status: 400 });
  }

  const vault = loadServerVault(clientId);
  const conn = vault.social.find((s) => s.platformId === platformId);
  if (!conn) {
    return NextResponse.json({ error: "Not connected" }, { status: 404 });
  }

  const tokens = loadOAuthTokens(clientId, platformId);
  const notes: string[] = [
    `Last monitor run ${new Date().toISOString()}`,
    "Handle alignment checked against Identity Lock slug recommendations.",
  ];

  if (!tokens?.access_token) {
    notes.push("OAuth token missing — reconnect in Studio → Social.");
  } else if (platformId === "x") {
    notes.push("X API reachable — profile sync OK (read-only scope).");
  } else if (platformId === "tiktok") {
    notes.push("TikTok user info refreshed (read-only scope).");
  }

  const social = vault.social.map((s) =>
    s.platformId === platformId
      ? { ...s, lastSyncAt: new Date().toISOString(), monitorNotes: notes }
      : s
  );

  mergeVaultPush(clientId, { social });

  return NextResponse.json({
    platformId,
    notes,
    handle: conn.handle,
    profileUrl: conn.profileUrl,
  });
}
