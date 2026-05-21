export type BuildPathId =
  | "cursor"
  | "lovable"
  | "wix"
  | "vercel"
  | "wordpress"
  | "shopify"
  | "squarespace"
  | "webflow"
  | "existing";

export type ConnectionStatus = "available" | "coming_soon" | "connect";

export interface BuildPlatform {
  id: BuildPathId;
  name: string;
  tagline: string;
  forAudience: string;
  connectionStatus: ConnectionStatus;
  connectLabel: string;
  externalUrl?: string;
  features: string[];
}

export const buildPlatforms: BuildPlatform[] = [
  {
    id: "cursor",
    name: "Cursor build",
    tagline: "We architect & ship in your repo with you",
    forAudience: "No site yet — want a custom Next.js / React product",
    connectionStatus: "connect",
    connectLabel: "Request Cursor build",
    features: ["Custom codebase", "Analyzer-informed stack", "Handoff + hosting bundle"],
  },
  {
    id: "lovable",
    name: "Lovable",
    tagline: "Import or sync AI-generated apps",
    forAudience: "Started in Lovable; want audit + deploy path",
    connectionStatus: "coming_soon",
    connectLabel: "Connect Lovable",
    externalUrl: "https://lovable.dev",
    features: ["Export sync", "Stack detection", "Deploy bridge"],
  },
  {
    id: "wix",
    name: "Wix",
    tagline: "Manage sites you already run on Wix",
    forAudience: "Live Wix site — edit, audit, extend",
    connectionStatus: "connect",
    connectLabel: "Connect Wix site",
    externalUrl: "https://www.wix.com",
    features: ["Site link + audit", "Domain alignment", "Extension roadmap"],
  },
  {
    id: "vercel",
    name: "Vercel / Next.js",
    tagline: "Hosting included in Archive Arac plans",
    forAudience: "Ready to host what we or you build",
    connectionStatus: "available",
    connectLabel: "Included with hosting",
    externalUrl: "https://vercel.com",
    features: ["SSL", "Preview URLs", "Custom domain DNS"],
  },
  {
    id: "wordpress",
    name: "WordPress",
    tagline: "Connect existing WP installs",
    forAudience: "Blog / marketing site on WordPress",
    connectionStatus: "coming_soon",
    connectLabel: "Connect WordPress",
    features: ["Plugin health", "Performance scan", "Theme audit"],
  },
  {
    id: "shopify",
    name: "Shopify",
    tagline: "Storefront + theme intelligence",
    forAudience: "Commerce on Shopify",
    connectionStatus: "coming_soon",
    connectLabel: "Connect Shopify",
    externalUrl: "https://www.shopify.com",
    features: ["Theme signals", "App stack hints", "Compare competitors"],
  },
  {
    id: "webflow",
    name: "Webflow",
    tagline: "Design-led sites with export path",
    forAudience: "Webflow-native brands",
    connectionStatus: "coming_soon",
    connectLabel: "Connect Webflow",
    externalUrl: "https://webflow.com",
    features: ["Class audit", "CMS patterns", "Hosting bridge"],
  },
  {
    id: "existing",
    name: "Any URL",
    tagline: "Paste a link — full Silk breakdown",
    forAudience: "Already live anywhere (Wix, custom, etc.)",
    connectionStatus: "available",
    connectLabel: "Run Analyzer",
    features: ["Tech stack", "UX & a11y", "Innovation vs gaps"],
  },
];

export const hostingTiers = [
  {
    id: "starter",
    name: "Starter",
    monthlyUsd: 19,
    sites: 1,
    domains: 1,
    includes: ["Vercel hosting", "SSL", "DNS setup", "Monthly health scan"],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyUsd: 39,
    sites: 3,
    domains: 3,
    includes: ["Everything in Starter", "Staging previews", "Batch analyzer", "Priority support"],
  },
  {
    id: "orbit",
    name: "Orbit",
    monthlyUsd: 79,
    sites: 10,
    domains: 10,
    includes: ["Everything in Growth", "Identity Lock scans", "White-label reports", "Cursor build credits"],
  },
] as const;

export const socialConnectors = [
  {
    id: "x",
    name: "X (Twitter)",
    status: "connect" as ConnectionStatus,
    purpose: "Post consistency, handle monitor, bio alignment",
  },
  {
    id: "tiktok",
    name: "TikTok",
    status: "connect" as ConnectionStatus,
    purpose: "Handle availability alerts, link-in-bio sync",
  },
  {
    id: "instagram",
    name: "Instagram",
    status: "coming_soon" as ConnectionStatus,
    purpose: "Brand handle guardrails, profile audit",
  },
];
