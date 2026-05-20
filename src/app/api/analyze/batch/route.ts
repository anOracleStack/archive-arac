import { NextRequest, NextResponse } from "next/server";
import { analyzeSite } from "@/lib/analyzer";
import { normalizeCanonicalUrl } from "@/lib/normalizeUrl";

const MAX_URLS = 8;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Provide a urls array" }, { status: 400 });
    }
    if (urls.length > MAX_URLS) {
      return NextResponse.json({ error: `Maximum ${MAX_URLS} URLs per batch` }, { status: 400 });
    }

    const normalized = urls.map((u: unknown) => {
      if (typeof u !== "string") throw new Error("Each url must be a string");
      const n = normalizeCanonicalUrl(u);
      new URL(n);
      return n;
    });

    const settled = await Promise.allSettled(normalized.map((url) => analyzeSite(url)));

    const results: Awaited<ReturnType<typeof analyzeSite>>[] = [];
    const errors: { url: string; error: string }[] = [];

    settled.forEach((outcome, i) => {
      if (outcome.status === "fulfilled") {
        results.push(outcome.value);
      } else {
        errors.push({
          url: normalized[i],
          error: outcome.reason instanceof Error ? outcome.reason.message : "Analysis failed",
        });
      }
    });

    return NextResponse.json({ results, errors, analyzed: results.length, failed: errors.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Batch analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
