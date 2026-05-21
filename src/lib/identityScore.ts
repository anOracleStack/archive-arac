import type { DomainCheck, IdentityCandidate, SocialHandleCheck } from "@/types/identity";

function pctAvailable(items: { status: string }[]): number {
  if (!items.length) return 0;
  const ok = items.filter((i) => i.status === "available").length;
  const unknown = items.filter((i) => i.status === "unknown").length;
  return Math.round(((ok + unknown * 0.35) / items.length) * 100);
}

function pronounceability(slug: string): number {
  const vowels = (slug.match(/[aeiou]/g) ?? []).length;
  const ratio = vowels / Math.max(slug.length, 1);
  if (ratio < 0.15 || ratio > 0.7) return 55;
  if (slug.length <= 12) return 92;
  if (slug.length <= 18) return 78;
  return 62;
}

function tldQuality(domains: DomainCheck[]): number {
  const weights: Record<string, number> = {
    ".com": 100,
    ".io": 88,
    ".ai": 85,
    ".co": 80,
    ".app": 78,
    ".dev": 76,
  };
  let best = 50;
  for (const d of domains) {
    if (d.status === "available") {
      best = Math.max(best, weights[d.tld] ?? 65);
    }
  }
  return best;
}

function buildHighlights(
  slug: string,
  domains: DomainCheck[],
  social: SocialHandleCheck[]
): { highlights: string[]; warnings: string[] } {
  const highlights: string[] = [];
  const warnings: string[] = [];

  const com = domains.find((d) => d.tld === ".com" && d.status === "available");
  if (com) highlights.push(`${com.fqdn} appears open`);

  const availSocial = social.filter((s) => s.status === "available");
  if (availSocial.length) {
    highlights.push(`${availSocial.map((s) => s.platformName).join(", ")} — handle may be free`);
  }

  const takenDomains = domains.filter((d) => d.status === "taken");
  if (takenDomains.length === domains.length) {
    warnings.push("All checked domains are registered");
  }

  const invalidSocial = social.filter((s) => s.status === "invalid");
  if (invalidSocial.length) {
    warnings.push(`Rules conflict on: ${invalidSocial.map((s) => s.platformName).join(", ")}`);
  }

  if (slug.length > 20) warnings.push("Long slug — harder to type & remember");

  return { highlights, warnings };
}

export function scoreCandidate(
  id: string,
  label: string,
  slug: string,
  domains: DomainCheck[],
  social: SocialHandleCheck[]
): IdentityCandidate {
  const domainCoverage = pctAvailable(domains);
  const socialCoverage = pctAvailable(social);
  const pronounce = pronounceability(slug);
  const tldQ = tldQuality(domains);
  const consistency =
    social.every((s) => s.status !== "invalid") && slug.length >= 3 ? 88 : 62;

  const score = Math.round(
    domainCoverage * 0.35 +
      socialCoverage * 0.25 +
      pronounce * 0.15 +
      tldQ * 0.15 +
      consistency * 0.1
  );

  const { highlights, warnings } = buildHighlights(slug, domains, social);

  return {
    id,
    label,
    slug,
    score: Math.min(99, Math.max(0, score)),
    scoreBreakdown: {
      consistency,
      pronounceability: pronounce,
      domainCoverage,
      socialCoverage,
      tldQuality: tldQ,
    },
    domains,
    social,
    highlights,
    warnings,
  };
}

export function sortCandidates(candidates: IdentityCandidate[]): IdentityCandidate[] {
  return [...candidates].sort((a, b) => b.score - a.score);
}
