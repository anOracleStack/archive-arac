import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";

export interface WixConnectInput {
  siteUrl: string;
  apiToken?: string;
  displayName?: string;
}

export async function resolveWixSite(input: WixConnectInput): Promise<{
  siteUrl: string;
  displayName: string;
  wixSiteId?: string;
  meta: Record<string, string>;
}> {
  const siteUrl = tryNormalizeCanonicalUrl(input.siteUrl);
  let wixSiteId: string | undefined;
  const meta: Record<string, string> = { source: "url_connect" };

  try {
    const pageRes = await fetch(siteUrl, {
      headers: { "User-Agent": "ArchiveArac/1.0 (+https://oidib.io)" },
      signal: AbortSignal.timeout(12_000),
    });
    if (pageRes.ok) {
      const html = await pageRes.text();
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch?.[1]) {
        meta.pageTitle = titleMatch[1].trim().slice(0, 200);
      }
    } else {
      meta.pageFetch = `http_${pageRes.status}`;
    }
  } catch {
    meta.pageFetch = "error";
  }

  const token = input.apiToken?.trim() || process.env.WIX_API_TOKEN?.trim();
  if (token) {
    try {
      const res = await fetch("https://www.wixapis.com/site-properties/v4/properties", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        meta.apiProbe = "ok";
        wixSiteId = meta.siteIdFromApi ?? undefined;
      } else {
        meta.apiProbe = `http_${res.status}`;
      }
    } catch {
      meta.apiProbe = "error";
    }
  }

  const displayName =
    input.displayName?.trim() ||
    meta.pageTitle ||
    new URL(siteUrl).hostname;

  return {
    siteUrl,
    displayName,
    wixSiteId,
    meta,
  };
}
