import type { NextRequest } from "next/server";

/**
 * Rate limiting for /api/chat and /api/analyze.
 *
 * When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or Vercel KV_REST_API_*)
 * are configured, limits are enforced via Redis REST INCR + EXPIRE.
 * Otherwise falls back to an in-memory Map (single-instance / dev only).
 */

export type LimitResult = { ok: true } | { ok: false; retryAfterSec: number };

const memoryStore = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

type RedisRestConfig = { url: string; token: string };

function getRedisRestConfig(): RedisRestConfig | null {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl.replace(/\/$/, ""), token: upstashToken };
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    return { url: kvUrl.replace(/\/$/, ""), token: kvToken };
  }

  return null;
}

function memoryHit(key: string, limit: number, windowMs: number): LimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now >= entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
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

async function redisCommand(
  config: RedisRestConfig,
  command: string[]
): Promise<{ result: unknown } | null> {
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as { result: unknown };
  } catch {
    return null;
  }
}

async function distributedHit(
  key: string,
  limit: number,
  windowMs: number
): Promise<LimitResult> {
  const config = getRedisRestConfig();
  if (!config) {
    return memoryHit(key, limit, windowMs);
  }

  const ttlSec = Math.max(1, Math.ceil(windowMs / 1000));
  const incr = await redisCommand(config, ["INCR", key]);
  if (!incr || typeof incr.result !== "number") {
    // TODO: alert when Redis is configured but unreachable — fall back to memory
    return memoryHit(key, limit, windowMs);
  }

  const count = incr.result;
  if (count === 1) {
    await redisCommand(config, ["EXPIRE", key, String(ttlSec)]);
  }

  if (count > limit) {
    const ttl = await redisCommand(config, ["TTL", key]);
    const retryAfterSec =
      ttl && typeof ttl.result === "number" && ttl.result > 0 ? ttl.result : ttlSec;
    return { ok: false, retryAfterSec };
  }

  return { ok: true };
}

async function hit(key: string, limit: number, windowMs: number): Promise<LimitResult> {
  if (getRedisRestConfig()) {
    return distributedHit(key, limit, windowMs);
  }
  return memoryHit(key, limit, windowMs);
}

/** ~30 chat messages per hour, burst 5 per minute. */
export async function checkChatRateLimit(ip: string): Promise<LimitResult> {
  const burst = await hit(`chat:burst:${ip}`, 5, 60_000);
  if (!burst.ok) return burst;
  return hit(`chat:hour:${ip}`, 30, 60 * 60_000);
}

/** ~10 analyze/compare calls per hour. */
export async function checkAnalyzeRateLimit(ip: string): Promise<LimitResult> {
  return hit(`analyze:hour:${ip}`, 10, 60 * 60_000);
}
