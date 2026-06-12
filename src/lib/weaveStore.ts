import type { WeaveSession } from "@/types/weave";
import { scheduleVaultSync } from "@/lib/vaultSync";

const WEAVES_KEY = "archive-arac:weave-sessions";
const MAX_WEAVES = 30;

function readWeaves(): WeaveSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WEAVES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WeaveSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWeaves(items: WeaveSession[]) {
  localStorage.setItem(WEAVES_KEY, JSON.stringify(items.slice(0, MAX_WEAVES)));
}

export function listWeaveSessions(): WeaveSession[] {
  return readWeaves().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function getWeaveSession(id: string): WeaveSession | null {
  return readWeaves().find((w) => w.id === id) ?? null;
}

export function saveWeaveSession(session: Omit<WeaveSession, "id" | "savedAt"> & { id?: string }): WeaveSession {
  const entry: WeaveSession = {
    id: session.id ?? crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    businessName: session.businessName.trim(),
    building: session.building.trim(),
    vibe: session.vibe.trim(),
    goals: session.goals.trim(),
    pages: session.pages.trim(),
    status: session.status,
    messages: session.messages,
  };
  const next = [entry, ...readWeaves().filter((w) => w.id !== entry.id)];
  writeWeaves(next);
  scheduleVaultSync();
  return entry;
}

export function removeWeaveSession(id: string) {
  writeWeaves(readWeaves().filter((w) => w.id !== id));
  scheduleVaultSync();
}
