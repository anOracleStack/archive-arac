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

  return {
    siteUrl,
    displayName: input.displayName?.trim() || new URL(siteUrl).hostname,
    wixSiteId,
    meta,
  };
}
