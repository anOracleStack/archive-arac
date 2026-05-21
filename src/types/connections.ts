export type SocialPlatformId = "x" | "tiktok" | "instagram";

export interface SocialConnection {
  id: string;
  platformId: SocialPlatformId;
  connectedAt: string;
  handle?: string;
  displayName?: string;
  profileUrl?: string;
  /** Server-only; never sent to client in full */
  hasToken: boolean;
  lastSyncAt?: string;
  monitorNotes?: string[];
}

export interface WixSiteConnection {
  id: string;
  siteUrl: string;
  displayName?: string;
  wixSiteId?: string;
  connectedAt: string;
  lastAnalyzedAt?: string;
  lastAnalyzerScore?: number;
  meta?: Record<string, string>;
}

export interface RegistrarOrder {
  id: string;
  lockId: string;
  clientId: string;
  domains: string[];
  hostingTierId: string;
  status: "pending" | "paid" | "registering" | "complete" | "failed";
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
  registrarProvider: "namecheap_reseller" | "manual";
  notes?: string;
}
