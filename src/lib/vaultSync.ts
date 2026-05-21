import { getOrCreateClientId } from "@/lib/clientId";
import type { VaultEntry } from "@/lib/reportStore";
import type { IdentityLockPackage, StudioBriefEntry } from "@/types/identity";
import type { ServerVaultSnapshot } from "@/lib/server/serverVault";

const REPORTS_KEY = "archive-arac:vault";
const LOCKS_KEY = "archive-arac:identity-locks";
const BRIEFS_KEY = "archive-arac:studio-briefs";

function readLocal<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

function mergeById<T extends { id: string; savedAt: string }>(a: T[], b: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of [...a, ...b]) {
    const prev = map.get(item.id);
    if (!prev || item.savedAt > prev.savedAt) map.set(item.id, item);
  }
  return [...map.values()].sort((x, y) => y.savedAt.localeCompare(x.savedAt));
}

export async function pullServerVault(): Promise<ServerVaultSnapshot | null> {
  const clientId = getOrCreateClientId();
  const res = await fetch(`/api/vault?clientId=${encodeURIComponent(clientId)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as ServerVaultSnapshot;
}

export async function pushLocalVaultToServer(): Promise<ServerVaultSnapshot | null> {
  const clientId = getOrCreateClientId();
  const body = {
    clientId,
    reports: readLocal<VaultEntry>(REPORTS_KEY),
    identityLocks: readLocal<IdentityLockPackage>(LOCKS_KEY),
    briefs: readLocal<StudioBriefEntry>(BRIEFS_KEY),
  };
  const res = await fetch("/api/vault", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return (await res.json()) as ServerVaultSnapshot;
}

/** Merge server snapshot into localStorage (newer wins per id). */
export function applyServerSnapshotToLocal(snapshot: ServerVaultSnapshot) {
  writeLocal(REPORTS_KEY, mergeById(readLocal<VaultEntry>(REPORTS_KEY), snapshot.reports));
  writeLocal(
    LOCKS_KEY,
    mergeById(readLocal<IdentityLockPackage>(LOCKS_KEY), snapshot.identityLocks)
  );
  writeLocal(
    BRIEFS_KEY,
    mergeById(readLocal<StudioBriefEntry>(BRIEFS_KEY), snapshot.briefs)
  );
}

export async function syncVaultBidirectional(): Promise<{
  ok: boolean;
  message: string;
  snapshot?: ServerVaultSnapshot;
}> {
  try {
    const localReports = readLocal<VaultEntry>(REPORTS_KEY);
    const localLocks = readLocal<IdentityLockPackage>(LOCKS_KEY);
    const localBriefs = readLocal<StudioBriefEntry>(BRIEFS_KEY);

    const clientId = getOrCreateClientId();
    const res = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        reports: localReports,
        identityLocks: localLocks,
        briefs: localBriefs,
        merge: true,
      }),
    });
    if (!res.ok) {
      return { ok: false, message: "Server vault unavailable" };
    }
    const merged = (await res.json()) as ServerVaultSnapshot;
    applyServerSnapshotToLocal(merged);
    return {
      ok: true,
      message: `Synced ${merged.reports.length} reports, ${merged.identityLocks.length} locks, ${merged.briefs.length} briefs`,
      snapshot: merged,
    };
  } catch {
    return { ok: false, message: "Sync failed — check network" };
  }
}

/** Fire-and-forget after local writes */
export function scheduleVaultSync() {
  if (typeof window === "undefined") return;
  void pushLocalVaultToServer();
}
