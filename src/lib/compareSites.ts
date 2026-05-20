import type { AnalysisResult } from "@/types/analysis";

export interface SiteComparison {
  scoreDelta: number;
  vibeA: string;
  vibeB: string;
  frameworks: { onlyA: string[]; onlyB: string[]; shared: string[] };
  libraries: { onlyA: string[]; onlyB: string[]; shared: string[] };
  analytics: { onlyA: string[]; onlyB: string[]; shared: string[] };
  accessibility: { a: string; b: string };
  performance: { domDelta: number; resourceDelta: number };
  highlights: string[];
}

function diffLists(a: string[], b: string[]): { onlyA: string[]; onlyB: string[]; shared: string[] } {
  const setA = new Set(a);
  const setB = new Set(b);
  const onlyA = a.filter((x) => !setB.has(x));
  const onlyB = b.filter((x) => !setA.has(x));
  const shared = a.filter((x) => setB.has(x));
  return { onlyA, onlyB, shared };
}

export function compareAnalyses(a: AnalysisResult, b: AnalysisResult): SiteComparison {
  const scoreDelta = b.overview.score - a.overview.score;
  const frameworks = diffLists(a.tech.frameworks, b.tech.frameworks);
  const libraries = diffLists(a.tech.libraries, b.tech.libraries);
  const analytics = diffLists(a.tech.analytics, b.tech.analytics);

  const highlights: string[] = [];
  if (scoreDelta > 8) highlights.push(`${b.hostname} scores higher on innovation signals (+${scoreDelta}).`);
  else if (scoreDelta < -8) highlights.push(`${a.hostname} leads on innovation signals (${scoreDelta}).`);
  else highlights.push("Both sites sit in a similar innovation band.");

  if (libraries.onlyB.length > libraries.onlyA.length) {
    highlights.push(`${b.hostname} uses more motion / UI libraries.`);
  } else if (libraries.onlyA.length > libraries.onlyB.length) {
    highlights.push(`${a.hostname} uses more motion / UI libraries.`);
  }

  if (frameworks.onlyA.length || frameworks.onlyB.length) {
    highlights.push("Framework stacks diverge — check migration cost if consolidating.");
  }

  return {
    scoreDelta,
    vibeA: a.overview.vibe,
    vibeB: b.overview.vibe,
    frameworks,
    libraries,
    analytics,
    accessibility: { a: a.ux.accessibility.score, b: b.ux.accessibility.score },
    performance: {
      domDelta: b.ux.performance.domSize - a.ux.performance.domSize,
      resourceDelta: b.ux.performance.resourceCount - a.ux.performance.resourceCount,
    },
    highlights,
  };
}
