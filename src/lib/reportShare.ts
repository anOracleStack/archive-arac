import type { AnalysisResult } from "@/types/analysis";
import { recommendStrands } from "@/lib/strandMatcher";

/** Compact payload for URL sharing (re-fetch full analysis on open via url). */
export interface SharedReportPayload {
  v: 1;
  url: string;
  title: string;
  hostname: string;
  score: number;
  vibe: string;
  summary: string;
  strandIds: number[];
  savedAt: string;
}

export function buildSharePayload(result: AnalysisResult): SharedReportPayload {
  return {
    v: 1,
    url: result.url,
    title: result.title,
    hostname: result.hostname,
    score: result.overview.score,
    vibe: result.overview.vibe,
    summary: result.overview.summary,
    strandIds: recommendStrands(result).map((m) => m.strand.id),
    savedAt: new Date().toISOString(),
  };
}

export function encodeSharePayload(payload: SharedReportPayload): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSharePayload(token: string): SharedReportPayload | null {
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? padded : padded + "=".repeat(4 - (padded.length % 4));
    const binary = atob(pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as SharedReportPayload;
    if (parsed.v !== 1 || !parsed.url) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function shareUrlFromResult(result: AnalysisResult, origin: string): string {
  const token = encodeSharePayload(buildSharePayload(result));
  return `${origin}/report?s=${token}`;
}
