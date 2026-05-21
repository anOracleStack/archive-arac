import fs from "fs";
import path from "path";
import type { VaultEntry } from "@/lib/reportStore";
import type { IdentityLockPackage, StudioBriefEntry } from "@/types/identity";
import type { SocialConnection, WixSiteConnection, RegistrarOrder } from "@/types/connections";
import { clientVaultDir, readJsonFile, writeJsonFile } from "@/lib/server/dataPaths";

export interface ServerVaultSnapshot {
  reports: VaultEntry[];
  identityLocks: IdentityLockPackage[];
  briefs: StudioBriefEntry[];
  social: SocialConnection[];
  wix: WixSiteConnection[];
  orders: RegistrarOrder[];
  updatedAt: string;
}

function snapshotPath(clientId: string) {
  return path.join(clientVaultDir(clientId), "snapshot.json");
}

function tokensPath(clientId: string, platformId: string) {
  return path.join(clientVaultDir(clientId), `oauth-${platformId}.json`);
}

export function loadServerVault(clientId: string): ServerVaultSnapshot {
  const empty: ServerVaultSnapshot = {
    reports: [],
    identityLocks: [],
    briefs: [],
    social: [],
    wix: [],
    orders: [],
    updatedAt: new Date().toISOString(),
  };
  return readJsonFile(snapshotPath(clientId), empty);
}

export function saveServerVault(clientId: string, snapshot: ServerVaultSnapshot) {
  writeJsonFile(snapshotPath(clientId), {
    ...snapshot,
    updatedAt: new Date().toISOString(),
  });
}

export function mergeVaultPush(
  clientId: string,
  patch: Partial<ServerVaultSnapshot>
): ServerVaultSnapshot {
  const current = loadServerVault(clientId);
  const next: ServerVaultSnapshot = {
    reports: patch.reports ?? current.reports,
    identityLocks: patch.identityLocks ?? current.identityLocks,
    briefs: patch.briefs ?? current.briefs,
    social: patch.social ?? current.social,
    wix: patch.wix ?? current.wix,
    orders: patch.orders ?? current.orders,
    updatedAt: new Date().toISOString(),
  };
  saveServerVault(clientId, next);
  return next;
}

export function upsertIdentityLock(clientId: string, lock: IdentityLockPackage) {
  const v = loadServerVault(clientId);
  const next = [lock, ...v.identityLocks.filter((l) => l.id !== lock.id)];
  return mergeVaultPush(clientId, { identityLocks: next.slice(0, 30) });
}

export function saveOAuthTokens(
  clientId: string,
  platformId: string,
  tokens: Record<string, unknown>
) {
  writeJsonFile(tokensPath(clientId, platformId), {
    ...tokens,
    savedAt: new Date().toISOString(),
  });
}

export function loadOAuthTokens(
  clientId: string,
  platformId: string
): Record<string, unknown> | null {
  const p = tokensPath(clientId, platformId);
  if (!fs.existsSync(p)) return null;
  return readJsonFile(p, {});
}

export function listSocialPublic(clientId: string): SocialConnection[] {
  return loadServerVault(clientId).social.map((s) => ({
    ...s,
    hasToken: true,
  }));
}
