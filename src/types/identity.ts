export type IdentityTier = 5 | 10 | 25 | 50;

export type AvailabilityStatus = "available" | "taken" | "unknown" | "invalid";

export interface SocialHandleCheck {
  platformId: string;
  platformName: string;
  handle: string;
  status: AvailabilityStatus;
  note?: string;
  claimUrl?: string;
}

export interface DomainCheck {
  fqdn: string;
  tld: string;
  status: AvailabilityStatus;
  registrarHint?: string;
}

export interface IdentityCandidate {
  id: string;
  label: string;
  slug: string;
  score: number;
  scoreBreakdown: {
    consistency: number;
    pronounceability: number;
    domainCoverage: number;
    socialCoverage: number;
    tldQuality: number;
  };
  domains: DomainCheck[];
  social: SocialHandleCheck[];
  highlights: string[];
  warnings: string[];
}

export interface IdentityScanRequest {
  brandName: string;
  keywords?: string;
  industry?: string;
  tier: IdentityTier;
  tlds?: string[];
  platforms?: string[];
}

export interface IdentityScanResult {
  brandName: string;
  tier: IdentityTier;
  scannedAt: string;
  candidates: IdentityCandidate[];
  meta: {
    domainsChecked: number;
    platformsChecked: string[];
    cacheHits?: number;
    topPick?: {
      slug: string;
      score: number;
      rationale: string;
    };
    disclaimer: string;
  };
}

export type IdentityLockStatus = "approved" | "checkout_pending" | "registered";

export interface IdentityLockPackage {
  id: string;
  savedAt: string;
  brandName: string;
  tier: IdentityTier;
  candidate: IdentityCandidate;
  scanSnapshot: IdentityScanResult;
  hostingTierId?: string;
  selectedDomains: string[];
  status: IdentityLockStatus;
  estimatedMonthlyUsd?: number;
}

export interface StudioBriefEntry {
  id: string;
  savedAt: string;
  platformId: string;
  title: string;
  body: string;
  url?: string;
}
