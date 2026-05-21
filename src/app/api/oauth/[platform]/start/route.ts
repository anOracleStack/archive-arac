import { NextRequest, NextResponse } from "next/server";
import { signOAuthState, appOrigin } from "@/lib/oauth/state";

export const runtime = "nodejs";

const PLATFORMS = ["x", "tiktok"] as const;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ platform: string }> }
) {
  const { platform } = await ctx.params;
  if (!PLATFORMS.includes(platform as (typeof PLATFORMS)[number])) {
    return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }

  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  const state = signOAuthState({ clientId, platform });
  const origin = appOrigin();
  const redirectUri = `${origin}/api/oauth/${platform}/callback`;

  if (platform === "x") {
    const clientIdX = process.env.X_OAUTH_CLIENT_ID;
    if (!clientIdX) {
      return NextResponse.redirect(
        `${origin}/studio/social?error=x_not_configured`
      );
    }
    const scope = encodeURIComponent("tweet.read users.read offline.access");
    const url =
      `https://twitter.com/i/oauth2/authorize?response_type=code` +
      `&client_id=${encodeURIComponent(clientIdX)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&state=${encodeURIComponent(state)}` +
      `&code_challenge=challenge&code_challenge_method=plain`;
    return NextResponse.redirect(url);
  }

  if (platform === "tiktok") {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    if (!clientKey) {
      return NextResponse.redirect(
        `${origin}/studio/social?error=tiktok_not_configured`
      );
    }
    const scope = encodeURIComponent("user.info.basic");
    const url =
      `https://www.tiktok.com/v2/auth/authorize/` +
      `?client_key=${encodeURIComponent(clientKey)}` +
      `&scope=${scope}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
}
