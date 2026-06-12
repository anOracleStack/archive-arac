import type { AnalysisResult } from "@/types/analysis";
import type { SiteComparison } from "@/lib/compareSites";
import { scrubPii } from "@/lib/scrubPii";

export type ContextLevel = "core" | "full";
export type ContextTier = "L0" | "L1";

export type ChatContextBundle = {
  context: string;
  contextVersion: 1;
  contextTier: ContextTier;
};

const APPROX_CHARS_PER_TOKEN = 4;
const CONTEXT_TOKEN_BUDGET = 2000;
const SUMMARY_MAX_CHARS = 400;

const L1_KEYWORDS =
  /accessib|a11y|seo|performance|speed|lighthouse|nav|navigation|wcag|core web vitals/i;

function estimateTokens(value: string): number {
  return Math.ceil(value.length / APPROX_CHARS_PER_TOKEN);
}

function truncateSummary(text: string): string {
  if (text.length <= SUMMARY_MAX_CHARS) return text;
  return `${text.slice(0, SUMMARY_MAX_CHARS - 1)}…`;
}

export function resolveContextTier(
  contextLevel: ContextLevel | undefined,
  lastUserMessage?: string
): ContextTier {
  if (contextLevel === "full") return "L1";
  if (lastUserMessage && L1_KEYWORDS.test(lastUserMessage)) return "L1";
  return "L0";
}

function buildSiteCore(result: AnalysisResult) {
  return {
    url: result.url,
    hostname: result.hostname,
    title: result.title,
    score: result.overview.score,
    vibe: result.overview.vibe,
    summary: truncateSummary(result.overview.summary),
    innovations: result.overview.innovations.slice(0, 8),
    uniqueFeatures: result.overview.uniqueFeatures.slice(0, 8),
    problems: result.overview.problems.slice(0, 8),
    tech: {
      frameworks: result.tech.frameworks,
      metaFramework: result.tech.metaFramework,
      confidence: result.tech.confidence,
    },
    design: {
      layout: result.design.layout,
      patterns: result.design.patterns.slice(0, 8),
      cssFramework: result.design.cssFramework,
    },
  };
}

function buildL1Extras(result: AnalysisResult) {
  const problems =
    result.overview.problems.length <= 12
      ? result.overview.problems
      : result.overview.problems.slice(0, 12);

  return {
    problems,
    ux: {
      accessibility: {
        score: result.ux.accessibility.score,
        issues: result.ux.accessibility.issues.slice(0, 5),
      },
      performance: {
        domSize: result.ux.performance.domSize,
        resourceCount: result.ux.performance.resourceCount,
        externalRequests: result.ux.performance.externalRequests,
        issues: result.ux.performance.issues.slice(0, 5),
      },
      seo: {
        title: result.ux.seo.title,
        description: result.ux.seo.description,
        ogTags: result.ux.seo.ogTags,
        issues: result.ux.seo.issues.slice(0, 5),
      },
      navigation: {
        type: result.ux.navigation.type,
        items: result.ux.navigation.items,
        issues: result.ux.navigation.issues.slice(0, 5),
      },
    },
    design: {
      designIssues: result.design.designIssues.slice(0, 6),
      colors: {
        palette: result.design.colors.palette.slice(0, 8),
        primary: result.design.colors.primary,
        secondary: result.design.colors.secondary,
        accent: result.design.colors.accent,
      },
    },
  };
}

function shrinkPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const copy = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
  const overview = copy.overview as Record<string, unknown> | undefined;
  if (overview) {
    if (Array.isArray(overview.innovations)) overview.innovations = overview.innovations.slice(0, 5);
    if (Array.isArray(overview.uniqueFeatures)) overview.uniqueFeatures = overview.uniqueFeatures.slice(0, 5);
    if (Array.isArray(overview.problems)) overview.problems = overview.problems.slice(0, 6);
  }

  const siteA = copy.siteA as Record<string, unknown> | undefined;
  const siteB = copy.siteB as Record<string, unknown> | undefined;
  for (const site of [siteA, siteB]) {
    if (!site) continue;
    if (Array.isArray(site.innovations)) site.innovations = site.innovations.slice(0, 5);
    if (Array.isArray(site.uniqueFeatures)) site.uniqueFeatures = site.uniqueFeatures.slice(0, 5);
    if (Array.isArray(site.problems)) site.problems = site.problems.slice(0, 6);
  }

  const l1 = copy.l1 as Record<string, unknown> | undefined;
  if (l1?.ux) {
    const ux = l1.ux as Record<string, Record<string, unknown>>;
    for (const key of Object.keys(ux)) {
      const section = ux[key];
      if (section && Array.isArray(section.issues)) section.issues = section.issues.slice(0, 3);
    }
    if (l1.design && typeof l1.design === "object") {
      const design = l1.design as Record<string, unknown>;
      if (Array.isArray(design.designIssues)) design.designIssues = design.designIssues.slice(0, 4);
    }
  }

  return copy;
}

function enforceTokenBudget(
  payload: Record<string, unknown>,
  tier: ContextTier
): { payload: Record<string, unknown>; tier: ContextTier } {
  let currentTier = tier;
  let working = payload;

  const serialize = (p: Record<string, unknown>) => scrubPii(JSON.stringify(p));

  let serialized = serialize(working);
  if (estimateTokens(serialized) <= CONTEXT_TOKEN_BUDGET) {
    return { payload: working, tier: currentTier };
  }

  if (currentTier === "L1") {
    const { l1: _drop, ...l0Only } = working;
    working = l0Only;
    currentTier = "L0";
    serialized = serialize(working);
    if (estimateTokens(serialized) <= CONTEXT_TOKEN_BUDGET) {
      return { payload: working, tier: currentTier };
    }
  }

  working = shrinkPayload(working);
  serialized = serialize(working);
  if (estimateTokens(serialized) <= CONTEXT_TOKEN_BUDGET) {
    return { payload: working, tier: currentTier };
  }

  working = shrinkPayload(working);
  return { payload: working, tier: currentTier };
}

function bundleFromPayload(
  payload: Record<string, unknown>,
  tier: ContextTier
): ChatContextBundle {
  const { payload: capped, tier: finalTier } = enforceTokenBudget(payload, tier);
  return {
    context: scrubPii(JSON.stringify(capped)),
    contextVersion: 1,
    contextTier: finalTier,
  };
}

export type BuildAnalysisChatOptions = {
  contextLevel?: ContextLevel;
  lastUserMessage?: string;
};

export function buildAnalysisChatSummary(
  result: AnalysisResult,
  options?: BuildAnalysisChatOptions
): ChatContextBundle {
  const tier = resolveContextTier(options?.contextLevel, options?.lastUserMessage);
  const payload: Record<string, unknown> = {
    mode: "single",
    ...buildSiteCore(result),
  };

  if (tier === "L1") {
    payload.l1 = buildL1Extras(result);
  }

  return bundleFromPayload(payload, tier);
}

export type BuildCompareChatOptions = BuildAnalysisChatOptions;

export function buildCompareChatSummary(
  a: AnalysisResult,
  b: AnalysisResult,
  comparison: SiteComparison,
  options?: BuildCompareChatOptions
): ChatContextBundle {
  const tier = resolveContextTier(options?.contextLevel, options?.lastUserMessage);

  const payload: Record<string, unknown> = {
    mode: "compare",
    siteA: buildSiteCore(a),
    siteB: buildSiteCore(b),
    comparison: {
      urls: { a: a.url, b: b.url },
      hostnames: { a: a.hostname, b: b.hostname },
      scores: { a: a.overview.score, b: b.overview.score },
      scoreDelta: comparison.scoreDelta,
      vibes: { a: comparison.vibeA, b: comparison.vibeB },
      highlights: comparison.highlights,
      frameworks: comparison.frameworks,
      libraries: {
        onlyA: comparison.libraries.onlyA.slice(0, 8),
        onlyB: comparison.libraries.onlyB.slice(0, 8),
        shared: comparison.libraries.shared.slice(0, 8),
      },
      accessibility: comparison.accessibility,
      performance: comparison.performance,
    },
  };

  if (tier === "L1") {
    payload.l1 = {
      siteA: buildL1Extras(a),
      siteB: buildL1Extras(b),
    };
  }

  return bundleFromPayload(payload, tier);
}

/** @deprecated Use buildAnalysisChatSummary().context — kept for quick migration. */
export function buildAnalysisChatSummaryLegacy(result: AnalysisResult): string {
  return buildAnalysisChatSummary(result).context;
}
