import type { AnalysisResult, AnalysisStatus } from "@/types/analysis";

const STORAGE_KEY = "silk-analyzer:session";

export interface AnalysisSessionState {
  url: string;
  result: AnalysisResult | null;
  status: AnalysisStatus;
  error: string | null;
  analyzedAt: string | null;
}

export function loadAnalysisSession(): AnalysisSessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AnalysisSessionState;
    if (!parsed.url || parsed.status !== "complete" || !parsed.result) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAnalysisSession(state: AnalysisSessionState): void {
  if (typeof window === "undefined") return;
  if (state.status !== "complete" || !state.result) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode */
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
  const qs = params.toString();
  const hash = window.location.hash;
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${hash}`;
  window.history.replaceState(null, "", next);
}
