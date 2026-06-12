import type { AnalysisResult, AnalysisStatus } from "@/types/analysis";
import type { SiteComparison } from "@/lib/compareSites";

const STORAGE_KEY = "silk-analyzer:session";
const TTL_MS = 24 * 60 * 60 * 1000;

export interface AnalysisSessionState {
  url: string;
  result: AnalysisResult | null;
  status: AnalysisStatus;
  error: string | null;
  analyzedAt: string | null;
}

export interface CompareSessionPayload {
  v: 1;
  savedAt: string;
  mode: "compare";
  urlA: string;
  urlB: string;
  compareA: AnalysisResult;
  compareB: AnalysisResult;
  comparison: SiteComparison;
}

export interface SingleSessionPayload {
  v: 1;
  savedAt: string;
  mode: "single";
  state: AnalysisSessionState;
}

export type PersistedAnalysisSession = SingleSessionPayload | CompareSessionPayload;

function isExpired(savedAt: string): boolean {
  return Date.now() - new Date(savedAt).getTime() > TTL_MS;
}

export function loadAnalysisSession(): AnalysisSessionState | null {
  const payload = readPersistedSession();
  if (!payload || payload.mode !== "single") return null;
  return payload.state;
}

export function readPersistedSession(): PersistedAnalysisSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedAnalysisSession | AnalysisSessionState;

    // Legacy single-only shape
    if ("url" in parsed && !("mode" in parsed)) {
      const legacy = parsed as AnalysisSessionState;
      if (!legacy.url || legacy.status !== "complete" || !legacy.result) return null;
      return {
        v: 1,
        savedAt: new Date().toISOString(),
        mode: "single",
        state: legacy,
      };
    }

    const payload = parsed as PersistedAnalysisSession;
    if (!payload.v || !payload.savedAt) return null;
    if (isExpired(payload.savedAt)) {
      clearAnalysisSession();
      return null;
    }
    if (payload.mode === "single") {
      const s = payload.state;
      if (!s.url || s.status !== "complete" || !s.result) return null;
    }
    return payload;
  } catch {
    clearAnalysisSession();
    return null;
  }
}

export function saveAnalysisSession(state: AnalysisSessionState): void {
  if (typeof window === "undefined") return;
  if (state.status !== "complete" || !state.result) return;
  try {
    const payload: SingleSessionPayload = {
      v: 1,
      savedAt: new Date().toISOString(),
      mode: "single",
      state,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or private mode */
  }
}

export function saveCompareSession(payload: Omit<CompareSessionPayload, "v" | "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const full: CompareSessionPayload = {
      v: 1,
      savedAt: new Date().toISOString(),
      ...payload,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch {
    /* quota */
  }
}

export function clearAnalysisSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function syncAnalysisUrl(url: string): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  params.set("url", url);
  params.delete("run");
  params.delete("compare");
  params.delete("b");
  const qs = params.toString();
  const hash = window.location.hash;
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${hash}`;
  window.history.replaceState(null, "", next);
}
