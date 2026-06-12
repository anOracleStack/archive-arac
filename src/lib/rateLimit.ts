import type { NextRequest } from "next/server";

/**
 * In-memory rate limits — suitable for dev and single-instance deploys.
 * For multi-instance production, swap to Vercel KV / Upstash (same key shape).
 *
 * Chat: 30 requests / hour / IP (+ 5 / minute burst).
 * Analyze: 10 requests / hour / IP (single + compare share this bucket).
 */
const store = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

type LimitResult = { ok: true } | { ok: false; retryAfterSec: number };

function hit(key: string, limit: number, windowMs: number): LimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { ok: true };
}

/** ~30 chat messages per hour, burst 5 per minute. */
export function checkChatRateLimit(ip: string): LimitResult {
  const burst = hit(`chat:burst:${ip}`, 5, 60_000);
  if (!burst.ok) return burst;
  return hit(`chat:hour:${ip}`, 30, 60 * 60_000);
}

/** ~10 analyze/compare calls per hour. */
export function checkAnalyzeRateLimit(ip: string): LimitResult {
  return hit(`analyze:hour:${ip}`, 10, 60 * 60_000);
}
