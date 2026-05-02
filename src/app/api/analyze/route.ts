import { NextRequest, NextResponse } from "next/server";
import { analyzeSite } from "@/lib/analyzer";
import { normalizeCanonicalUrl } from "@/lib/normalizeUrl";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Please provide a valid URL" }, { status: 400 });
    }

    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeCanonicalUrl(url);
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const result = await analyzeSite(normalizedUrl);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    const status =
      message.includes("Failed to fetch") || message.includes("timeout")
        ? 502
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
