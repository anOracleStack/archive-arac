import { NextRequest, NextResponse } from "next/server";
import { loadServerVault, mergeVaultPush, loadOAuthTokens } from "@/lib/server/serverVault";
import { runSocialMonitor } from "@/lib/social/runMonitor";
import { fetchTikTokProfile, fetchXProfile } from "@/lib/social/platformApi";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { clientId?: string; platformId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { clientId, platformId } = body;
  if (!clientId || !platformId) {
    return NextResponse.json({ error: "clientId & platformId required" }, { status: 400 });
  }

  const vault = await loadServerVault(clientId);
  const conn = vault.social.find((s) => s.platformId === platformId);
  if (!conn) {
    return NextResponse.json({ error: "Not connected" }, { status: 404 });
  }

  const tokens = await loadOAuthTokens(clientId, platformId);
  const accessToken =
    typeof tokens?.access_token === "string" ? tokens.access_token : undefined;

  const lock = vault.identityLocks[0];
  const lockSlug = lock?.candidate.slug;

  const notes = await runSocialMonitor(conn, accessToken, lockSlug);

  let handle = conn.handle;
  let displayName = conn.displayName;
  let profileUrl = conn.profileUrl;

  if (accessToken && platformId === "x") {
    const profile = await fetchXProfile(accessToken);
    handle = profile.handle ?? handle;
    displayName = profile.displayName ?? displayName;
    profileUrl = profile.profileUrl ?? profileUrl;
  }
  if (accessToken && platformId === "tiktok") {
    const profile = await fetchTikTokProfile(accessToken);
    handle = profile.handle ?? handle;
    displayName = profile.displayName ?? displayName;
    profileUrl = profile.profileUrl ?? profileUrl;
  }

  const social = vault.social.map((s) =>
    s.platformId === platformId
      ? {
          ...s,
          handle,
          displayName,
          profileUrl,
          lastSyncAt: new Date().toISOString(),
          monitorNotes: notes,
        }
      : s
  );

  await mergeVaultPush(clientId, { social });

  return NextResponse.json({
    platformId,
    notes,
    handle,
    profileUrl,
  });
}
