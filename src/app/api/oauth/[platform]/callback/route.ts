import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { verifyOAuthState, appOrigin } from "@/lib/oauth/state";
import {
  loadServerVault,
  mergeVaultPush,
  saveOAuthTokens,
} from "@/lib/server/serverVault";
import type { SocialConnection } from "@/types/connections";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ platform: string }> }
) {
  const { platform } = await ctx.params;
  const origin = appOrigin();
  const code = req.nextUrl.searchParams.get("code");
  const stateRaw = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${origin}/studio/social?error=${encodeURIComponent(error)}`
    );
  }

  const state = stateRaw ? verifyOAuthState(stateRaw) : null;
  if (!state || state.platform !== platform) {
    return NextResponse.redirect(`${origin}/studio/social?error=invalid_state`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/studio/social?error=no_code`);
  }

  const redirectUri = `${origin}/api/oauth/${platform}/callback`;
  let profile: { handle?: string; displayName?: string; profileUrl?: string } = {};

  try {
    if (platform === "x") {
      const tokens = await exchangeX(code, redirectUri);
      await saveOAuthTokens(state.clientId, "x", tokens);
      profile = await fetchXProfile(tokens.access_token as string);
    } else if (platform === "tiktok") {
      const tokens = await exchangeTikTok(code, redirectUri);
      await saveOAuthTokens(state.clientId, "tiktok", tokens);
      profile = await fetchTikTokProfile(tokens.access_token as string);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "oauth_failed";
    return NextResponse.redirect(
      `${origin}/studio/social?error=${encodeURIComponent(msg)}`
    );
  }

  const vault = await loadServerVault(state.clientId);
  const conn: SocialConnection = {
    id: crypto.randomUUID(),
    platformId: platform as SocialConnection["platformId"],
    connectedAt: new Date().toISOString(),
    handle: profile.handle,
    displayName: profile.displayName,
    profileUrl: profile.profileUrl,
    hasToken: true,
    lastSyncAt: new Date().toISOString(),
    monitorNotes: ["Connected for handle monitoring — not auto-registration."],
  };

  const social = [
    conn,
    ...vault.social.filter((s) => s.platformId !== conn.platformId),
  ];

  await mergeVaultPush(state.clientId, { social });

  return NextResponse.redirect(`${origin}/studio/social?connected=${platform}`);
}

async function exchangeX(code: string, redirectUri: string) {
  const clientId = process.env.X_OAUTH_CLIENT_ID;
  const clientSecret = process.env.X_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("X OAuth not configured");

  const res = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: "challenge",
    }),
  });
  if (!res.ok) throw new Error("X token exchange failed");
  return (await res.json()) as Record<string, unknown>;
}

async function fetchXProfile(accessToken: string) {
  const res = await fetch("https://api.twitter.com/2/users/me?user.fields=username,name", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return {};
  const data = (await res.json()) as { data?: { username?: string; name?: string } };
  const u = data.data;
  return {
    handle: u?.username,
    displayName: u?.name,
    profileUrl: u?.username ? `https://x.com/${u.username}` : undefined,
  };
}

async function exchangeTikTok(code: string, redirectUri: string) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) throw new Error("TikTok OAuth not configured");

  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) throw new Error("TikTok token exchange failed");
  return (await res.json()) as Record<string, unknown>;
}

async function fetchTikTokProfile(accessToken: string) {
  const res = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=display_name,username", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return {};
  const data = (await res.json()) as {
    data?: { user?: { display_name?: string; username?: string } };
  };
  const u = data.data?.user;
  return {
    handle: u?.username,
    displayName: u?.display_name,
    profileUrl: u?.username ? `https://www.tiktok.com/@${u.username}` : undefined,
  };
}
