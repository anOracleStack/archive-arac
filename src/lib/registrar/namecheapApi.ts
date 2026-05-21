/**
 * Namecheap XML API — register when reseller credentials are configured.
 * https://www.namecheap.com/support/api/methods/domains/create/
 */

export interface NamecheapConfig {
  apiUser: string;
  apiKey: string;
  username: string;
  clientIp: string;
  sandbox: boolean;
}

export function getNamecheapConfig(): NamecheapConfig | null {
  const apiKey = process.env.REGISTRAR_API_KEY?.trim();
  const apiUser = process.env.REGISTRAR_API_USER?.trim() ?? process.env.NAMECHEAP_API_USER?.trim();
  const username =
    process.env.REGISTRAR_USERNAME?.trim() ?? process.env.NAMECHEAP_USERNAME?.trim();
  const clientIp = process.env.NAMECHEAP_CLIENT_IP?.trim();
  if (!apiKey || !apiUser || !username || !clientIp) return null;
  return {
    apiUser,
    apiKey,
    username,
    clientIp,
    sandbox: process.env.REGISTRAR_SANDBOX === "true",
  };
}

function baseUrl(sandbox: boolean): string {
  return sandbox
    ? "https://api.sandbox.namecheap.com/xml.response"
    : "https://api.namecheap.com/xml.response";
}

function parseXmlStatus(xml: string): { ok: boolean; message: string } {
  const status = xml.match(/Status="([^"]+)"/)?.[1];
  if (status === "OK") return { ok: true, message: "Namecheap OK" };
  const err = xml.match(/<Error[^>]*>([^<]*)<\/Error>/)?.[1];
  return { ok: false, message: err ?? "Namecheap API error" };
}

export async function namecheapRegisterDomains(
  domains: string[],
  years = 1
): Promise<{ ok: boolean; message: string; details: string[] }> {
  const cfg = getNamecheapConfig();
  if (!cfg) {
    return { ok: false, message: "Namecheap credentials incomplete", details: [] };
  }

  const details: string[] = [];
  let allOk = true;

  for (const fqdn of domains) {
    const parts = fqdn.split(".");
    if (parts.length < 2) {
      details.push(`${fqdn}: invalid`);
      allOk = false;
      continue;
    }
    const sld = parts[0];
    const tld = parts.slice(1).join(".");

    const params = new URLSearchParams({
      ApiUser: cfg.apiUser,
      ApiKey: cfg.apiKey,
      UserName: cfg.username,
      ClientIp: cfg.clientIp,
      Command: "namecheap.domains.create",
      DomainName: fqdn,
      Years: String(years),
      SLD: sld,
      TLD: tld,
    });

    const res = await fetch(`${baseUrl(cfg.sandbox)}?${params.toString()}`);
    const xml = await res.text();
    const parsed = parseXmlStatus(xml);
    details.push(`${fqdn}: ${parsed.message}`);
    if (!parsed.ok) allOk = false;
  }

  return {
    ok: allOk,
    message: allOk ? "Domains submitted to Namecheap" : "Some domains failed at Namecheap",
    details,
  };
}
