import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";

export function parseCompareParams(
  searchParams: URLSearchParams
): { urlA: string; urlB: string } | null {
  const a = searchParams.get("compare") ?? searchParams.get("a");
  const b = searchParams.get("b");
  if (!a || !b) return null;
  try {
    return {
      urlA: tryNormalizeCanonicalUrl(a),
      urlB: tryNormalizeCanonicalUrl(b),
    };
  } catch {
    return null;
  }
}

export function syncCompareUrl(urlA: string, urlB: string): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  params.delete("url");
  params.delete("run");
  params.set("compare", urlA);
  params.set("b", urlB);
  const qs = params.toString();
  const hash = window.location.hash;
  const next = `${window.location.pathname}?${qs}${hash}`;
  window.history.replaceState(null, "", next);
}

export function compareShareUrl(urlA: string, urlB: string, origin: string): string {
  const params = new URLSearchParams({ compare: urlA, b: urlB, run: "1" });
  return `${origin}/analyze?${params.toString()}`;
}

export function clearCompareUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  params.delete("compare");
  params.delete("b");
  const qs = params.toString();
  const hash = window.location.hash;
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${hash}`;
  window.history.replaceState(null, "", next);
}
