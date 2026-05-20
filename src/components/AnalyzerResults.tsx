"use client";

import { useState, type FC } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { gloss } from "@/data/knowledgeGloss";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { CodeBlock } from "./CodeBlock";
import { StrandRecommendations } from "./analyzer/StrandRecommendations";
import { ReportActions } from "./analyzer/ReportActions";

interface Props {
  result: AnalysisResult;
}

type Tab = "overview" | "design" | "tech" | "interactions" | "ux" | "extracted";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "design", label: "Design" },
  { key: "tech", label: "Tech Stack" },
  { key: "interactions", label: "Interactions" },
  { key: "ux", label: "UX & A11y" },
  { key: "extracted", label: "Code Snippets" },
];

export const AnalyzerResults: FC<Props> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { overview, design, tech, interactions, ux, interactionHighlights, codeSnippets, extractedCSS } = result;

  return (
    <div className="max-w-5xl mx-auto mt-16">
      {/* Score badge */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight mb-1">{result.title}</h3>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#E67E22] hover:underline"
          >
            {result.hostname} ↗
          </a>
        </div>
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black border-2 ${
              overview.score >= 70
                ? "border-[#8BA896] text-[#8BA896]"
                : overview.score >= 45
                  ? "border-[#E67E22] text-[#E67E22]"
                  : "border-red-400 text-red-400"
            }`}
          >
            {overview.score}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">
              <KnowledgeGateway article={gloss.analyzerScore} surface="cream">
                <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 cursor-pointer">Score</span>
              </KnowledgeGateway>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE]">Result tabs</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#5A5653] hidden sm:inline">
            <KnowledgeGateway article={gloss.readingYourAnalysis} surface="cream">
              <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 cursor-pointer">How to read</span>
            </KnowledgeGateway>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E8E5DF] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.key
                ? "bg-[#2C2A29] text-white"
                : "text-[#5A5653] hover:text-[#2C2A29]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vibe badge */}
      {activeTab === "overview" && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E67E22]/10 text-[#E67E22] text-xs font-bold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
          Vibe: {overview.vibe}
        </div>
      )}

      {/* Tab content */}
      <div className="min-h-[300px]">
        {activeTab === "overview" && <OverviewTab overview={overview} />}
        {activeTab === "design" && <DesignTab design={design} />}
        {activeTab === "tech" && <TechTab tech={tech} />}
        {activeTab === "interactions" && <InteractionsTab interactions={interactions} highlights={interactionHighlights} />}
        {activeTab === "ux" && <UXTab ux={ux} />}
        {activeTab === "extracted" && (
          <ExtractedTab
            snippets={codeSnippets}
            extractedCSS={extractedCSS}
            design={design}
          />
        )}
      </div>

      <StrandRecommendations result={result} />
      <ReportActions result={result} />
    </div>
  );
};

/* ── Overview ── */
function OverviewTab({ overview }: { overview: AnalysisResult["overview"] }) {
  return (
    <div className="space-y-8">
      <p className="text-[#5A5653] leading-relaxed">{overview.summary}</p>

      {overview.innovations.length > 0 && (
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-[#8BA896] mb-3">✦ What&apos;s Innovative</h4>
          <ul className="space-y-2">
            {overview.innovations.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#2C2A29]">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#8BA896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {overview.uniqueFeatures.length > 0 && (
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-3">✦ Unique Features</h4>
          <ul className="space-y-2">
            {overview.uniqueFeatures.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#2C2A29]">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#E67E22]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {overview.problems.length > 0 && (
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-red-400 mb-3">⚠ Needs Attention</h4>
          <ul className="space-y-2">
            {overview.problems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#5A5653]">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary card */}
      <div className="bg-[#F9F7F3] rounded-2xl p-6 border border-[#E8E5DF]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-[#8BA896]">{overview.innovations.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">Innovations</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#E67E22]">{overview.uniqueFeatures.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">Unique Features</div>
          </div>
          <div>
            <div className="text-2xl font-black text-red-400">{overview.problems.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">Issues Found</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#2C2A29]">{overview.score}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Design ── */
function DesignTab({ design }: { design: AnalysisResult["design"] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">Layout & Patterns</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#5A5653]">Layout System</span>
            <span className="font-semibold">{design.layout}</span>
          </div>
          {design.cssFramework && (
            <div className="flex justify-between text-sm">
              <span className="text-[#5A5653]">CSS Framework</span>
              <span className="font-semibold text-[#E67E22]">{design.cssFramework}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[#5A5653]">Responsive</span>
            <span className={`font-semibold ${design.responsive ? "text-[#8BA896]" : "text-red-400"}`}>
              {design.responsive ? "✓ Yes" : "✗ No"}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h5 className="font-bold text-xs uppercase tracking-widest text-[#5A5653] mb-2">Detected Patterns</h5>
          <div className="flex flex-wrap gap-2">
            {design.patterns.map((p, i) => (
              <span key={i} className="tag-pill">{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">Color Palette</h4>
        <div className="space-y-2">
          {design.colors.palette.slice(0, 6).map((c, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg border border-[#E8E5DF] shrink-0" style={{ backgroundColor: c }} />
              <code className="font-mono text-xs text-[#5A5653">{c}</code>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h5 className="font-bold text-xs uppercase tracking-widest text-[#5A5653] mb-2">Typography</h5>
          {design.typography.fonts.length > 0 ? (
            <div className="space-y-1">
              {design.typography.fonts.map((f, i) => (
                <div key={i} className="text-sm font-mono text-[#2C2A29]" style={{ fontFamily: f }}>
                  {f}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#5A5653]">No custom fonts detected</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tech Stack ── */
function TechTab({ tech }: { tech: AnalysisResult["tech"] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">Frameworks</h4>
        {tech.frameworks.length > 0 ? (
          <div className="space-y-2">
            {tech.frameworks.map((fw, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-[#8BA896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /></svg>
                {fw}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#5A5653]">No major JS frameworks detected (may be static)</p>
        )}

        {tech.metaFramework && (
          <div className="mt-4 text-sm">
            <span className="text-[#5A5653]">Meta Framework: </span>
            <span className="font-semibold text-[#E67E22]">{tech.metaFramework}</span>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">Libraries</h4>
        {tech.libraries.length > 0 ? (
          <div className="space-y-2">
            {tech.libraries.map((lib, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-[#E67E22]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
                {lib}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#5A5653]">No common libraries detected</p>
        )}

        {tech.analytics.length > 0 && (
          <div className="mt-6">
            <h5 className="font-bold text-xs uppercase tracking-widest text-[#5A5653] mb-2">Analytics</h5>
            <div className="flex flex-wrap gap-2">
              {tech.analytics.map((a, i) => (
                <span key={i} className="tag-pill">{a}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-[#5A5653]">
          Confidence:{" "}
          <span className={`font-semibold ${
            tech.confidence === "high" ? "text-[#8BA896]" : tech.confidence === "medium" ? "text-[#E67E22]" : "text-red-400"
          }`}>
            {tech.confidence}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Interactions ── */
function InteractionsTab({
  interactions,
  highlights,
}: {
  interactions: AnalysisResult["interactions"];
  highlights: AnalysisResult["interactionHighlights"];
}) {
  return (
    <div className="space-y-8">
      {/* Highlights */}
      {highlights.length > 0 && (
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">✦ Interaction Highlights</h4>
          <div className="grid gap-4">
            {highlights.map((h, i) => (
              <div key={i} className="bg-[#F9F7F3] rounded-2xl p-5 border border-[#E8E5DF]">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-sm">{h.name}</span>
                  {h.isInnovative && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E67E22]/10 text-[#E67E22] text-[10px] font-bold uppercase tracking-widest">
                      Innovative
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5A5653] mb-3">{h.description}</p>
                <CodeBlock code={h.codeSnippet} language={h.language} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-[#5A5653] mb-3">CSS Animations</h4>
          {interactions.cssAnimations.length > 0 ? (
            <div className="space-y-2">
              {interactions.cssAnimations.slice(0, 5).map((a, i) => (
                <div key={i} className="text-xs font-mono text-[#5A5653] bg-white rounded-lg p-2 border border-[#E8E5DF]">
                  <div className="font-semibold text-[#2C2A29]">{a.selector}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#5A5653]">No CSS animations detected</p>
          )}
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-[#5A5653] mb-3">Effects & Methods</h4>
          <div className="space-y-2">
            {interactions.hoverEffects.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#E67E22]" /> {interactions.hoverEffects.length} hover effects
              </div>
            )}
            {interactions.scrollEffects.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#8BA896]" /> {s}
              </div>
            ))}
            {interactions.jsAnimations.map((j, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#2C2A29]" /> {j}
              </div>
            ))}
            {interactions.performanceWarnings.length === 0 &&
             interactions.scrollEffects.length === 0 &&
             interactions.jsAnimations.length === 0 && (
              <p className="text-sm text-[#5A5653]">No advanced interaction patterns detected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── UX & A11y ── */
function UXTab({ ux }: { ux: AnalysisResult["ux"] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">Accessibility</h4>
        <div className="flex items-center gap-3 mb-4">
          <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
            ux.accessibility.score === "excellent"
              ? "bg-[#8BA896]/20 text-[#8BA896]"
              : ux.accessibility.score === "good"
                ? "bg-green-100 text-green-700"
                : ux.accessibility.score === "fair"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
          }`}>
            {ux.accessibility.score}
          </div>
          <span className="text-xs text-[#5A5653]">score</span>
        </div>

        {ux.accessibility.passed.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#8BA896] mb-2">✓ Passed</h5>
            <ul className="space-y-1">
              {ux.accessibility.passed.map((p, i) => (
                <li key={i} className="text-xs text-[#5A5653] flex items-start gap-2">
                  <span className="text-[#8BA896] mt-0.5">✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {ux.accessibility.issues.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">✗ Issues</h5>
            <ul className="space-y-1">
              {ux.accessibility.issues.map((p, i) => (
                <li key={i} className="text-xs text-[#5A5653] flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">SEO</h4>
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-[#5A5653]">Title</span>
            <span className="font-mono text-xs max-w-[200px] truncate">{ux.seo.title || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A5653]">Meta Description</span>
            <span className="font-mono text-xs max-w-[200px] truncate">{ux.seo.description || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A5653]">OG Tags</span>
            <span className={`font-semibold ${ux.seo.ogTags ? "text-[#8BA896]" : "text-red-400"}`}>
              {ux.seo.ogTags ? "✓ Present" : "✗ Missing"}
            </span>
          </div>
        </div>

        <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">Performance</h4>
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-[#5A5653]">DOM Size</span>
            <span className="font-semibold">{ux.performance.domSize} elements</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A5653]">External Scripts</span>
            <span className="font-semibold">{ux.performance.externalRequests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A5653]">Resources</span>
            <span className="font-semibold">{ux.performance.resourceCount}</span>
          </div>
        </div>

        {ux.performance.issues.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Issues</h5>
            <ul className="space-y-1">
              {ux.performance.issues.map((p, i) => (
                <li key={i} className="text-xs text-[#5A5653]">{p}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-bold text-sm uppercase tracking-widest text-[#E67E22] mb-4">Navigation</h4>
          <div className="text-sm space-y-1">
            <p><span className="text-[#5A5653]">Type:</span> {ux.navigation.type}</p>
            <p><span className="text-[#5A5653]">Items:</span> {ux.navigation.items}</p>
            <p><span className="text-[#5A5653]">Mobile Menu:</span> {ux.navigation.hasMobileMenu ? "✓" : "✗"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Extracted Code ── */
function ExtractedTab({
  snippets,
  extractedCSS,
  design,
}: {
  snippets: AnalysisResult["codeSnippets"];
  extractedCSS: Record<string, string[]>;
  design: AnalysisResult["design"];
}) {
  const [activeCat, setActiveCat] = useState<"inspired" | "extracted">("inspired");

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveCat("inspired")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            activeCat === "inspired" ? "bg-[#E67E22] text-white" : "bg-[#F9F7F3] text-[#5A5653]"
          }`}
        >
          Inspired Code
        </button>
        <button
          onClick={() => setActiveCat("extracted")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            activeCat === "extracted" ? "bg-[#E67E22] text-white" : "bg-[#F9F7F3] text-[#5A5653]"
          }`}
        >
          Raw CSS Patterns
        </button>
      </div>

      {activeCat === "inspired" && (
        <div className="space-y-4">
          {snippets.length === 0 && (
            <p className="text-sm text-[#5A5653]">No code snippets could be generated from this site.</p>
          )}
          {snippets.map((s, i) => (
            <div key={i} className="bg-[#F9F7F3] rounded-2xl p-6 border border-[#E8E5DF]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-sm mb-1">{s.title}</h5>
                  <p className="text-xs text-[#5A5653]">{s.description}</p>
                </div>
                <span className="tag-pill">{s.category}</span>
              </div>
              <CodeBlock code={s.code} language={s.language} />
            </div>
          ))}
        </div>
      )}

      {activeCat === "extracted" && (
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(extractedCSS).length === 0 && (
            <p className="text-sm text-[#5A5653] col-span-2">No CSS patterns could be extracted.</p>
          )}
          {Object.entries(extractedCSS).map(([cat, vals]) => (
            <div key={cat} className="bg-[#F9F7F3] rounded-2xl p-5 border border-[#E8E5DF]">
              <h5 className="font-bold text-xs uppercase tracking-widest text-[#E67E22] mb-3">{cat}</h5>
              <div className="space-y-1">
                {vals.map((v, i) => (
                  <code key={i} className="block text-[11px] font-mono text-[#5A5653] leading-relaxed">{v};</code>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-[#2C2A29] rounded-2xl text-center">
        <p className="text-[10px] text-[#D1CEC7] uppercase tracking-widest">
          These code snippets are <strong className="text-white">inspired</strong> by the analyzed site.
          Copy, adapt, & use them in your own projects.
        </p>
      </div>
    </div>
  );
}
