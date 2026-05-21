import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
import { loadServerVault, mergeVaultPush } from "@/lib/server/serverVault";
import { resolveWixSite } from "@/lib/wix/wixClient";
import type { WixSiteConnection } from "@/types/connections";

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }
  const vault = await loadServerVault(clientId);
  return NextResponse.json({ sites: vault.wix });
}

export async function POST(req: NextRequest) {
  let body: {
    clientId?: string;
    siteUrl?: string;
    apiToken?: string;
    displayName?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const clientId = body.clientId?.trim();
  const siteUrl = body.siteUrl?.trim();
  if (!clientId || !siteUrl) {
    return NextResponse.json({ error: "clientId and siteUrl required" }, { status: 400 });
  }

  let resolved;
  try {
    resolved = await resolveWixSite({
      siteUrl,
      apiToken: body.apiToken,
      displayName: body.displayName,
    });
  } catch {
    return NextResponse.json({ error: "Invalid site URL" }, { status: 400 });
  }

  const vault = await loadServerVault(clientId);
  const entry: WixSiteConnection = {
    id: crypto.randomUUID(),
    siteUrl: resolved.siteUrl,
    displayName: resolved.displayName,
    wixSiteId: resolved.wixSiteId,
    connectedAt: new Date().toISOString(),
    meta: resolved.meta,
  };

  const wix = [
    entry,
    ...vault.wix.filter((w) => w.siteUrl !== entry.siteUrl),
  ].slice(0, 20);

  await mergeVaultPush(clientId, { wix });

  return NextResponse.json({ site: entry, sites: wix });
}

export async function DELETE(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  const siteId = req.nextUrl.searchParams.get("siteId");
  if (!clientId || !siteId) {
    return NextResponse.json({ error: "clientId and siteId required" }, { status: 400 });
  }
  const vault = await loadServerVault(clientId);
  await mergeVaultPush(clientId, {
    wix: vault.wix.filter((w) => w.id !== siteId),
  });
  return NextResponse.json({ ok: true });
}
