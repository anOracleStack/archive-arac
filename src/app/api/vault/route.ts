import { NextRequest, NextResponse } from "next/server";
import type { VaultEntry } from "@/lib/reportStore";
import type { IdentityLockPackage, StudioBriefEntry } from "@/types/identity";
import type { WeaveSession } from "@/types/weave";
import { loadServerVault, mergeVaultPush, type ServerVaultSnapshot } from "@/lib/server/serverVault";

export const runtime = "nodejs";

function mergeById<T extends { id: string; savedAt: string }>(a: T[], b: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of [...a, ...b]) {
    const prev = map.get(item.id);
    if (!prev || item.savedAt > prev.savedAt) map.set(item.id, item);
  }
  return [...map.values()].sort((x, y) => y.savedAt.localeCompare(x.savedAt));
}

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }
  try {
    const snapshot = await loadServerVault(clientId);
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("[vault] GET failed", err);
    return NextResponse.json({ error: "Vault read failed" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  let body: {
    clientId?: string;
    reports?: VaultEntry[];
    identityLocks?: IdentityLockPackage[];
    briefs?: StudioBriefEntry[];
    weaves?: WeaveSession[];
    merge?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const clientId = body.clientId?.trim();
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }

  try {
    const current = await loadServerVault(clientId);
    const next: ServerVaultSnapshot = {
      reports: body.merge
        ? mergeById(current.reports, body.reports ?? [])
        : (body.reports ?? current.reports),
      identityLocks: body.merge
        ? mergeById(current.identityLocks, body.identityLocks ?? [])
        : (body.identityLocks ?? current.identityLocks),
      briefs: body.merge
        ? mergeById(current.briefs, body.briefs ?? [])
        : (body.briefs ?? current.briefs),
      weaves: body.merge
        ? mergeById(current.weaves ?? [], body.weaves ?? [])
        : (body.weaves ?? current.weaves ?? []),
      social: current.social,
      wix: current.wix,
      orders: current.orders,
      updatedAt: new Date().toISOString(),
    };

    await mergeVaultPush(clientId, next);
    return NextResponse.json(await loadServerVault(clientId));
  } catch (err) {
    console.error("[vault] POST failed", err);
    return NextResponse.json({ error: "Vault write failed" }, { status: 503 });
  }
}
