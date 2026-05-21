import { NextRequest, NextResponse } from "next/server";
import { analyzeSite } from "@/lib/analyzer";
import { compareAnalyses } from "@/lib/compareSites";
import { normalizeCanonicalUrl } from "@/lib/normalizeUrl";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urlA, urlB } = body;

    if (!urlA || !urlB || typeof urlA !== "string" || typeof urlB !== "string") {
      return NextResponse.json({ error: "Provide urlA & urlB" }, { status: 400 });
    }

    let normalizedA: string;
    let normalizedB: string;
    try {
      normalizedA = normalizeCanonicalUrl(urlA);
      normalizedB = normalizeCanonicalUrl(urlB);
      new URL(normalizedA);
      new URL(normalizedB);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const [a, b] = await Promise.all([analyzeSite(normalizedA), analyzeSite(normalizedB)]);
    const comparison = compareAnalyses(a, b);

    return NextResponse.json({ a, b, comparison });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Comparison failed";
    const status =
      message.includes("Failed to fetch") || message.includes("timeout") ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
