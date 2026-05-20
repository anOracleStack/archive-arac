import { strands } from "@/data/strands";
import type { StrandItem } from "@/types";

export function buildComposeExport(selected: StrandItem[], projectName: string): string {
  const name = projectName.trim() || "weave-launch";
  const strandList = selected.map((s) => `  - ${s.name} (${s.demoType})`).join("\n");

  return `// Archive Arac — Strand Compose Export
// Project: ${name}
// Strands:
${strandList}

/*
  Next steps:
  1. Visit /#index on Archive Arac to interact with each demoType live.
  2. Copy patterns from Analyzer code snippets into your stack.
  3. Run: npx create-next-app@latest ${name} --typescript --tailwind --app
*/

export const weaveManifest = ${JSON.stringify(
    selected.map((s) => ({
      id: s.id,
      name: s.name,
      demoType: s.demoType,
      tags: s.tags,
      takeaway: s.takeaway,
    })),
    null,
    2
  )} as const;

export type WeaveManifest = typeof weaveManifest;
`;
}

export function getStrandById(id: number): StrandItem | undefined {
  return strands.find((s) => s.id === id);
}
