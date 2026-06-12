import type { AnalysisResult } from "@/types/analysis";
import { scrubPii } from "@/lib/scrubPii";

export function buildAnalysisChatSummary(result: AnalysisResult): string {
  const raw = JSON.stringify(
    {
      url: result.url,
      hostname: result.hostname,
      title: result.title,
      score: result.overview.score,
      vibe: result.overview.vibe,
      summary: result.overview.summary,
      innovations: result.overview.innovations.slice(0, 8),
      uniqueFeatures: result.overview.uniqueFeatures.slice(0, 8),
      problems: result.overview.problems.slice(0, 8),
      tech: {
        frameworks: result.tech.frameworks,
        libraries: result.tech.libraries.slice(0, 12),
        metaFramework: result.tech.metaFramework,
        confidence: result.tech.confidence,
      },
      design: {
        layout: result.design.layout,
        patterns: result.design.patterns.slice(0, 8),
        cssFramework: result.design.cssFramework,
      },
    },
    null,
    2
  );
  return scrubPii(raw);
}
