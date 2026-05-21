import { NextResponse } from "next/server";
import type { IdentityScanRequest, IdentityTier } from "@/types/identity";
import { runIdentityScan } from "@/lib/identityScan";

export const maxDuration = 60;

const TIERS: IdentityTier[] = [5, 10, 25, 50];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<IdentityScanRequest>;
    const brandName = typeof body.brandName === "string" ? body.brandName.trim() : "";
    const tier = body.tier as IdentityTier;

    if (!brandName || brandName.length < 2) {
      return NextResponse.json({ error: "Brand name is required (min 2 characters)." }, { status: 400 });
    }

    if (!TIERS.includes(tier)) {
      return NextResponse.json({ error: "Tier must be 5, 10, 25, or 50." }, { status: 400 });
    }

    const result = await runIdentityScan({
      brandName,
      keywords: typeof body.keywords === "string" ? body.keywords : undefined,
      industry: typeof body.industry === "string" ? body.industry : undefined,
      tier,
      tlds: Array.isArray(body.tlds) ? body.tlds.filter((t) => typeof t === "string") : undefined,
      platforms: Array.isArray(body.platforms)
        ? body.platforms.filter((p) => typeof p === "string")
        : undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Identity scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
