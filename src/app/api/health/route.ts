import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const blob =
    Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()) ||
    Boolean(process.env.VERCEL_OIDC_TOKEN);
  return NextResponse.json({
    ok: true,
    service: "archive-arac",
    vault: blob ? "blob" : "filesystem",
    stripe: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    webhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim()),
    oauth: Boolean(process.env.OAUTH_STATE_SECRET?.trim()),
    timestamp: new Date().toISOString(),
  });
}
