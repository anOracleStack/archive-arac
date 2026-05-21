import type { IdentityScanRequest, IdentityScanResult, IdentityTier } from "@/types/identity";
import { defaultPlatformIds } from "@/data/socialPlatformRules";
import { generateCandidateSlugs, getTldsForScan } from "@/lib/identityCandidates";
import { checkDomainsForSlug, type DomainCache } from "@/lib/domainAvailability";
import { checkSocialHandles } from "@/lib/socialAvailability";
import { scoreCandidate, sortCandidates } from "@/lib/identityScore";
import { mapPool } from "@/lib/pool";

function tierConfig(tier: IdentityTier): {
  tldCount: number;
  platformIds: string[];
  concurrency: number;
} {
  switch (tier) {
    case 5:
      return { tldCount: 5, platformIds: defaultPlatformIds, concurrency: 6 };
    case 10:
      return { tldCount: 4, platformIds: defaultPlatformIds, concurrency: 8 };
    case 25:
      return { tldCount: 3, platformIds: defaultPlatformIds.slice(0, 5), concurrency: 10 };
    case 50:
      return { tldCount: 2, platformIds: ["github", "x", "instagram", "tiktok"], concurrency: 12 };
    default:
      return { tldCount: 4, platformIds: defaultPlatformIds, concurrency: 8 };
  }
}

async function scanCandidate(
  id: string,
  label: string,
  slug: string,
  tlds: string[],
  tldCount: number,
  platformIds: string[],
  cache: DomainCache
) {
  const [domains, social] = await Promise.all([
    checkDomainsForSlug(slug, tlds, tldCount, cache),
    checkSocialHandles(slug, platformIds),
  ]);
  return scoreCandidate(id, label, slug, domains, social);
}

export async function runIdentityScan(req: IdentityScanRequest): Promise<IdentityScanResult> {
  const tier = req.tier;
  const { tldCount, platformIds, concurrency } = tierConfig(tier);
  const tlds = getTldsForScan(req.tlds);
  const slugs = generateCandidateSlugs(req.brandName, req.keywords, tier);
  const cache: DomainCache = new Map();
  const platforms = req.platforms ?? platformIds;

  const candidates = await mapPool(slugs, concurrency, (item, i) =>
    scanCandidate(`c-${i}`, item.label, item.slug, tlds, tldCount, platforms, cache)
  );

  const ranked = sortCandidates(candidates);
  const top = ranked[0];

  return {
    brandName: req.brandName,
    tier,
    scannedAt: new Date().toISOString(),
    candidates: ranked,
    meta: {
      domainsChecked: tldCount,
      platformsChecked: platforms,
      cacheHits: cache.size,
      topPick: top
        ? {
            slug: top.slug,
            score: top.score,
            rationale: top.highlights[0] ?? "Highest composite match across domains and handles.",
          }
        : undefined,
      disclaimer:
        "Domain checks use public RDAP (deduplicated per scan). GitHub availability is live; other social networks need in-app verification before you claim. We register domains and configure hosting — you complete social signups with our checklist.",
    },
  };
}
