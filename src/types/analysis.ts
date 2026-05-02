export type AnalysisStatus = "idle" | "fetching" | "analyzing" | "complete" | "error";

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  palette: string[];
}

export interface TypographyInfo {
  fonts: string[];
  headings: string[];
  bodySize: string;
}

export interface DesignAnalysis {
  layout: string;
  patterns: string[];
  colors: ColorScheme;
  typography: TypographyInfo;
  responsive: boolean;
  cssFramework: string | null;
  designHighlights: string[];
  designIssues: string[];
}

export interface TechStackInfo {
  frameworks: string[];
  libraries: string[];
  bundler: string | null;
  metaFramework: string | null;
  cssPreprocessor: string | null;
  hosting: string | null;
  analytics: string[];
  cdn: string[];
  confidence: "low" | "medium" | "high";
}

export interface AnimationInfo {
  cssAnimations: { selector: string; properties: string[] }[];
  cssTransitions: { selector: string; properties: string[] }[];
  jsAnimations: string[];
  hoverEffects: string[];
  scrollEffects: string[];
  performanceWarnings: string[];
}

export interface UXAnalysis {
  navigation: { type: string; items: number; hasMobileMenu: boolean; issues: string[] };
  forms: { count: number; hasValidation: boolean; accessible: boolean };
  accessibility: { score: "poor" | "fair" | "good" | "excellent"; issues: string[]; passed: string[] };
  seo: { title: string | null; description: string | null; ogTags: boolean; issues: string[] };
  performance: { domSize: number; resourceCount: number; externalRequests: number; issues: string[] };
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description: string;
  source: string;
  category: "css" | "html" | "javascript" | "react" | "interaction";
}

export interface InteractionHighlight {
  name: string;
  description: string;
  codeSnippet: string;
  language: string;
  isInnovative: boolean;
}

export interface AnalysisResult {
  url: string;
  hostname: string;
  title: string;
  description: string | null;
  overview: {
    summary: string;
    innovations: string[];
    uniqueFeatures: string[];
    problems: string[];
    vibe: string;
    score: number;
  };
  design: DesignAnalysis;
  tech: TechStackInfo;
  interactions: AnimationInfo;
  ux: UXAnalysis;
  interactionHighlights: InteractionHighlight[];
  codeSnippets: CodeSnippet[];
  extractedCSS: Record<string, string[]>;
}
