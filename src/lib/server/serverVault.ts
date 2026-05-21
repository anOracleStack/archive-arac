import type { VaultEntry } from "@/lib/reportStore";
import type { IdentityLockPackage, StudioBriefEntry } from "@/types/identity";
import type { SocialConnection, WixSiteConnection, RegistrarOrder } from "@/types/connections";
import { readVaultJson, writeVaultJson } from "@/lib/server/vaultStorage";

export interface ServerVaultSnapshot {
  reports: VaultEntry[];
  identityLocks: IdentityLockPackage[];
  briefs: StudioBriefEntry[];
  social: SocialConnection[];
  wix: WixSiteConnection[];
  orders: RegistrarOrder[];
  updatedAt: string;
}

const SNAPSHOT_FILE = "snapshot.json";

function emptySnapshot(): ServerVaultSnapshot {
  return {
    reports: [],
    identityLocks: [],
    briefs: [],
    social: [],
    wix: [],
    orders: [],
    updatedAt: new Date().toISOString(),
  };
}

function oauthFile(platformId: string) {
  return `oauth-${platformId}.json`;
}

export async function loadServerVault(clientId: string): Promise<ServerVaultSnapshot> {
  return readVaultJson(clientId, SNAPSHOT_FILE, emptySnapshot());
}

export async function saveServerVault(
  clientId: string,
  snapshot: ServerVaultSnapshot
): Promise<void> {
  await writeVaultJson(clientId, SNAPSHOT_FILE, {
    ...snapshot,
    updatedAt: new Date().toISOString(),
  });
}

export async function mergeVaultPush(
  clientId: string,
  patch: Partial<ServerVaultSnapshot>
): Promise<ServerVaultSnapshot> {
  const current = await loadServerVault(clientId);
  const next: ServerVaultSnapshot = {
    reports: patch.reports ?? current.reports,
    identityLocks: patch.identityLocks ?? current.identityLocks,
    briefs: patch.briefs ?? current.briefs,
    social: patch.social ?? current.social,
    wix: patch.wix ?? current.wix,
    orders: patch.orders ?? current.orders,
    updatedAt: new Date().toISOString(),
  };
  await saveServerVault(clientId, next);
  return next;
}

export async function upsertIdentityLock(
  clientId: string,
  lock: IdentityLockPackage
): Promise<ServerVaultSnapshot> {
  const v = await loadServerVault(clientId);
  const next = [lock, ...v.identityLocks.filter((l) => l.id !== lock.id)];
  return mergeVaultPush(clientId, { identityLocks: next.slice(0, 30) });
}

export async function saveOAuthTokens(
  clientId: string,
  platformId: string,
  tokens: Record<string, unknown>
): Promise<void> {
  await writeVaultJson(clientId, oauthFile(platformId), {
    ...tokens,
    savedAt: new Date().toISOString(),
  });
}

export async function loadOAuthTokens(
  clientId: string,
  platformId: string
): Promise<Record<string, unknown> | null> {
  const data = await readVaultJson<Record<string, unknown> | null>(
    clientId,
    oauthFile(platformId),
    null
  );
  if (!data || typeof data !== "object") return null;
  return data;
}

export async function listSocialPublic(clientId: string): Promise<SocialConnection[]> {
  const vault = await loadServerVault(clientId);
  return vault.social.map((s) => ({
    ...s,
    hasToken: true,
  }));
}
