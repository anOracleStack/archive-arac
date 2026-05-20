import { strands } from "@/data/strands";
import type { StrandItem } from "@/types";
import type { AnalysisResult } from "@/types/analysis";

export interface StrandMatch {
  strand: StrandItem;
  score: number;
  reasons: string[];
}

function addScore(
  map: Map<number, { score: number; reasons: string[] }>,
  id: number,
  points: number,
  reason: string
) {
  const cur = map.get(id) ?? { score: 0, reasons: [] };
  cur.score += points;
  if (!cur.reasons.includes(reason)) cur.reasons.push(reason);
  map.set(id, cur);
}

/** Rank Archive Arac strands that best match an analyzed site. */
export function recommendStrands(result: AnalysisResult, limit = 4): StrandMatch[] {
  const map = new Map<number, { score: number; reasons: string[] }>();
  const libs = result.tech.libraries.map((l) => l.toLowerCase());
  const fw = result.tech.frameworks.map((f) => f.toLowerCase());
  const patterns = result.design.patterns.map((p) => p.toLowerCase());
  const scrollFx = result.interactions.scrollEffects.length;
  const hoverFx = result.interactions.hoverEffects.length;
  const highlights = result.interactionHighlights.filter((h) => h.isInnovative).length;

  if (libs.some((l) => ["gsap", "lenis", "locomotive", "aos"].some((k) => l.includes(k)))) {
    addScore(map, 6, 3, "Scroll-driven motion libraries detected");
    addScore(map, 8, 2, "Reveal / scroll choreography patterns");
  }
  if (scrollFx >= 2) addScore(map, 6, 4, `${scrollFx} scroll-triggered effects`);
  if (libs.some((l) => l.includes("three") || l.includes("pixi"))) {
    addScore(map, 2, 4, "3D / WebGL stack");
    addScore(map, 5, 2, "Particle / canvas-friendly visuals");
  }
  if (patterns.some((p) => p.includes("bento") || p.includes("grid"))) {
    addScore(map, 1, 5, "Bento / adaptive grid layout");
  }
  if (hoverFx >= 3 || highlights >= 2) {
    addScore(map, 3, 4, "Rich hover & micro-interaction layer");
  }
  if (fw.some((f) => f.includes("react") || f.includes("next"))) {
    addScore(map, 4, 2, "React-era product surface — command UI fits");
  }
  if (result.ux.navigation.hasMobileMenu && result.ux.navigation.items >= 5) {
    addScore(map, 7, 3, "Dense navigation — radial hub alternative");
  }
  if (result.design.responsive && result.overview.score >= 60) {
    addScore(map, 1, 1, "Strong responsive baseline");
  }
  if (result.ux.accessibility.score === "poor" || result.ux.accessibility.score === "fair") {
    addScore(map, 8, 3, "Progressive disclosure can reduce cognitive load");
  }
  if (result.overview.score < 45) {
    addScore(map, 3, 2, "Kinetic affordances can lift perceived polish");
    addScore(map, 1, 2, "Structured bento can clarify hierarchy");
  }

  const ranked = strands
    .map((strand) => {
      const entry = map.get(strand.id) ?? { score: 1, reasons: ["General weave upgrade path"] };
      return { strand, score: entry.score, reasons: entry.reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked;
}
