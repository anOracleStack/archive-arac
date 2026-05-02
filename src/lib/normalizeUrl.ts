const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIPv4(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

/**
 * Canonical URL for display and API: always https, adds www. for apex domains (e.g. stripe.com → https://www.stripe.com).
 * Preserves subdomains (blog.example.com), ports, paths, and query strings.
 */
export function normalizeCanonicalUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  let rest = trimmed.replace(/^https?:\/\//i, "");
  const pathMatch = rest.match(/([/?#].*)/);
  const path = pathMatch ? pathMatch[1] : "";
  const authority = pathMatch ? rest.slice(0, pathMatch.index!) : rest;

  let hostname: string;
  let port = "";
  if (authority.startsWith("[")) {
    const closing = authority.indexOf("]");
    if (closing >= 0) {
      hostname = authority.slice(1, closing);
      if (authority[closing + 1] === ":") {
        port = authority.slice(closing + 1);
      }
    } else {
      hostname = authority;
    }
  } else {
    const colon = authority.lastIndexOf(":");
    const maybePort = colon > 0 ? authority.slice(colon + 1) : "";
    if (colon > 0 && /^\d+$/.test(maybePort)) {
      hostname = authority.slice(0, colon);
      port = authority.slice(colon);
    } else {
      hostname = authority;
    }
  }

  const hostLower = hostname.toLowerCase();
  if (LOCAL_HOSTS.has(hostLower) || isIPv4(hostname)) {
    return `https://${authority}${path}`;
  }

  const parts = hostname.split(".").filter(Boolean);
  if (parts.length === 0) {
    return `https://${authority}${path}`;
  }

  let hostOut = parts.map((p) => p.toLowerCase()).join(".");
  if (parts.length === 2) {
    hostOut = `www.${hostOut}`;
  }

  return `https://${hostOut}${port}${path}`;
}

/** Returns normalized URL when valid; otherwise the trimmed input (so typing in progress does not break). */
export function tryNormalizeCanonicalUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  try {
    const n = normalizeCanonicalUrl(t);
    new URL(n);
    return n;
  } catch {
    return t;
  }
}
