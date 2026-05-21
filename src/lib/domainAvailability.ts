import type { AvailabilityStatus, DomainCheck } from "@/types/identity";

const RDAP_SERVERS: Record<string, string> = {
  ".com": "https://rdap.verisign.com/com/v1/domain/",
  ".net": "https://rdap.verisign.com/net/v1/domain/",
  ".org": "https://rdap.org/domain/",
  ".io": "https://rdap.nic.io/domain/",
  ".co": "https://rdap.nic.co/domain/",
  ".ai": "https://rdap.nic.ai/domain/",
  ".app": "https://rdap.nic.google/domain/",
  ".dev": "https://rdap.nic.google/domain/",
};

export type DomainCache = Map<string, AvailabilityStatus>;

async function rdapLookup(fqdn: string, tld: string): Promise<AvailabilityStatus> {
  const server = RDAP_SERVERS[tld];
  if (!server) return "unknown";

  const url = `${server}${fqdn.toLowerCase()}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/rdap+json, application/json" },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 0 },
    });
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function checkDomain(
  slug: string,
  tld: string,
  cache?: DomainCache
): Promise<DomainCheck> {
  const fqdn = `${slug}${tld}`;
  let status: AvailabilityStatus;

  if (cache?.has(fqdn)) {
    status = cache.get(fqdn)!;
  } else {
    status = await rdapLookup(fqdn, tld);
    cache?.set(fqdn, status);
  }

  return {
    fqdn,
    tld,
    status,
    registrarHint: status === "available" ? "Likely registrable — confirm at checkout" : undefined,
  };
}

export async function checkDomainsForSlug(
  slug: string,
  tlds: string[],
  maxTlds = 4,
  cache?: DomainCache
): Promise<DomainCheck[]> {
  const slice = tlds.slice(0, maxTlds);
  return Promise.all(slice.map((tld) => checkDomain(slug, tld, cache)));
}
