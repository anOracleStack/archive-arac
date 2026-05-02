export type SilkCategory = "webgl" | "ai" | "ux";

export interface StrandItem {
  id: number;
  name: string;
  category: SilkCategory;
  categoryLabel: string;
  tags: string[];
  shortDesc: string;
  innovation: string;
  tech: string;
  takeaway: string;
  realLink: string;
  realName: string;
  demoType: DemoType;
}

export type DemoType = "fluid" | "spatial" | "magnetic" | "typewriter" | "canvas" | "scroll";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export interface SilkPoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  connections: number[];
}
