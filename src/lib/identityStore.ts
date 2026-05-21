import type {
  IdentityCandidate,
  IdentityLockPackage,
  IdentityScanResult,
  StudioBriefEntry,
} from "@/types/identity";
import { scheduleVaultSync } from "@/lib/vaultSync";

const LOCKS_KEY = "archive-arac:identity-locks";
const BRIEFS_KEY = "archive-arac:studio-briefs";
const MAX_LOCKS = 20;
const MAX_BRIEFS = 30;

function readLocks(): IdentityLockPackage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as IdentityLockPackage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocks(items: IdentityLockPackage[]) {
  localStorage.setItem(LOCKS_KEY, JSON.stringify(items.slice(0, MAX_LOCKS)));
}

function readBriefs(): StudioBriefEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BRIEFS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudioBriefEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeBriefs(items: StudioBriefEntry[]) {
  localStorage.setItem(BRIEFS_KEY, JSON.stringify(items.slice(0, MAX_BRIEFS)));
}

export function listIdentityLocks(): IdentityLockPackage[] {
  return readLocks().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function getIdentityLock(id: string): IdentityLockPackage | null {
  return readLocks().find((l) => l.id === id) ?? null;
}

export function saveIdentityLock(
  scan: IdentityScanResult,
  candidate: IdentityCandidate,
  options?: {
    hostingTierId?: string;
    selectedDomains?: string[];
    status?: IdentityLockPackage["status"];
  }
): IdentityLockPackage {
  const available = candidate.domains.filter((d) => d.status === "available").map((d) => d.fqdn);
  const selected = options?.selectedDomains?.length
    ? options.selectedDomains
    : available.slice(0, 2);

  const hostingMonthly =
    options?.hostingTierId === "orbit" ? 79 : options?.hostingTierId === "growth" ? 39 : 19;

  const entry: IdentityLockPackage = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    brandName: scan.brandName,
    tier: scan.tier,
    candidate,
    scanSnapshot: scan,
    hostingTierId: options?.hostingTierId ?? "starter",
    selectedDomains: selected,
    status: options?.status ?? "approved",
    estimatedMonthlyUsd: hostingMonthly,
  };

  const next = [entry, ...readLocks().filter((l) => l.candidate.slug !== candidate.slug)];
  writeLocks(next);
  scheduleVaultSync();
  return entry;
}

export function updateIdentityLock(
  id: string,
  patch: Partial<Pick<IdentityLockPackage, "status" | "selectedDomains" | "hostingTierId" | "estimatedMonthlyUsd">>
) {
  const next = readLocks().map((l) => (l.id === id ? { ...l, ...patch } : l));
  writeLocks(next);
  scheduleVaultSync();
}

export function removeIdentityLock(id: string) {
  writeLocks(readLocks().filter((l) => l.id !== id));
  scheduleVaultSync();
}

export function saveStudioBrief(
  platformId: string,
  title: string,
  body: string,
  url?: string
): StudioBriefEntry {
  const entry: StudioBriefEntry = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    platformId,
    title: title.trim() || "Studio brief",
    body: body.trim(),
    url: url?.trim(),
  };
  writeBriefs([entry, ...readBriefs()]);
  scheduleVaultSync();
  return entry;
}

export function listStudioBriefs(): StudioBriefEntry[] {
  return readBriefs().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function removeStudioBrief(id: string) {
  writeBriefs(readBriefs().filter((b) => b.id !== id));
  scheduleVaultSync();
}

/** Rough first-year estimate for checkout preview (not a live quote). */
export function estimateLockTotals(lock: IdentityLockPackage): {
  domainsYearly: number;
  hostingMonthly: number;
  hostingYearly: number;
  firstYearTotal: number;
} {
  const perDomain = 14;
  const domainsYearly = lock.selectedDomains.length * perDomain;
  const hostingMonthly = lock.estimatedMonthlyUsd ?? 19;
  const hostingYearly = hostingMonthly * 12;
  return {
    domainsYearly,
    hostingMonthly,
    hostingYearly,
    firstYearTotal: domainsYearly + hostingYearly,
  };
}
