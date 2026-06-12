"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { StrandItem, SilkCategory } from "@/types";
import { strands } from "@/data/strands";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { ScrollReveal, StaggerGrid } from "@/components/ScrollReveal";
import { BalancedText } from "@/components/BalancedText";
import { gloss } from "@/data/knowledgeGloss";

const FILTERS: { key: SilkCategory | "all"; label: string; glossArticle: keyof typeof gloss }[] = [
  { key: "all", label: "All Strands", glossArticle: "allStrands" },
  { key: "webgl", label: "Spatial", glossArticle: "spatialCategory" },
  { key: "ai", label: "Gen-AI", glossArticle: "genAICategory" },
  { key: "ux", label: "Physics", glossArticle: "physicsCategory" },
];

const CATEGORY_COLORS: Record<SilkCategory, string> = {
  webgl: "#8BA896",
  ai: "#E67E22",
  ux: "#9C7C5B",
};

interface DatabaseGridProps {
  onSelect: (item: StrandItem) => void;
}

type ViewMode = "grid" | "map";

function buildTagEdges(items: StrandItem[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const shared = items[i].tags.some((t) => items[j].tags.includes(t));
      if (shared) edges.push([items[i].id, items[j].id]);
    }
  }
  return edges;
}

export function DatabaseGrid({ onSelect }: DatabaseGridProps) {
  const [activeFilter, setActiveFilter] = useState<SilkCategory | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mapHoverId, setMapHoverId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const animRef = useRef<number>(0);

  const filtered = activeFilter === "all" ? strands : strands.filter((i) => i.category === activeFilter);
  const displayStrands = filtered;
  const tagEdges = buildTagEdges(displayStrands);

  const mapPositions = displayStrands.map((item, i) => {
    const angle = (i / Math.max(displayStrands.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const r = 38;
    return {
      id: item.id,
      x: 50 + Math.cos(angle) * r,
      y: 50 + Math.sin(angle) * r,
      item,
    };
  });

  const setCardRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  // Connection-lines canvas (grid mode) — scoped to Index section so lines sit behind cards, not over the whole page
  useEffect(() => {
    const cvs = canvasRef.current;
    const section = sectionRef.current;
    if (!cvs || !section) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
      const w = section.clientWidth;
      const h = section.clientHeight;
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      cvs.width = Math.round(w * dpr);
      cvs.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(section);

    const draw = () => {
      const cw = section.clientWidth;
      const ch = section.clientHeight;
      ctx.clearRect(0, 0, cw, ch);
      frame++;

      const cRect = cvs.getBoundingClientRect();

      if (hoveredId !== null) {
        const hoveredEl = cardRefs.current.get(hoveredId);
        if (!hoveredEl) {
          animRef.current = requestAnimationFrame(draw);
          return;
        }

        const hRect = hoveredEl.getBoundingClientRect();
        const hCenterX = hRect.left + hRect.width / 2 - cRect.left;
        const hCenterY = hRect.top + hRect.height / 2 - cRect.top;

        cardRefs.current.forEach((el, id) => {
          if (id === hoveredId) return;
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2 - cRect.left;
          const cy = rect.top + rect.height / 2 - cRect.top;

          const dx = hCenterX - cx;
          const dy = hCenterY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 500) {
            const alpha = (1 - dist / 500) * 0.6;
            const pulse = 0.5 + 0.5 * Math.sin(frame * 0.03 + id);
            ctx.strokeStyle = `rgba(230, 126, 34, ${alpha * pulse})`;
            ctx.lineWidth = 0.5 + (1 - dist / 500) * 1.5;
            ctx.setLineDash([4, 8]);
            ctx.beginPath();
            ctx.moveTo(hCenterX, hCenterY);
            const midX = (hCenterX + cx) / 2;
            const midY = (hCenterY + cy) / 2 - 30;
            ctx.quadraticCurveTo(midX, midY, cx, cy);
            ctx.stroke();
          }
        });
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [hoveredId]);

  return (
    <section id="index" ref={sectionRef} className="relative z-10 overflow-hidden py-24 px-6">
      {/* Connection canvas — only this section; paints behind cards (z-0) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        style={{ opacity: 0.75 }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-16 flex flex-col items-center gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl text-center mx-auto">
              <div className="mb-4 flex items-start justify-center gap-3">
                <h2 className="flex flex-1 flex-wrap items-center justify-center gap-3 text-balance text-4xl font-bold tracking-tight text-[#2C2A29]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0" aria-hidden>
                    <path d="M12 2a10 10 0 0 1 7.07 17.07L12 22l-7.07-2.93A10 10 0 0 1 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Site library
                </h2>
              </div>
              <p className="text-sm text-[#6B543C] mb-2">
                Example sites to study — filter by the silk type behind each experience.
              </p>
              <p className="leading-relaxed copy-balanced text-[#5A5653]">
                <span className="copy-balanced-line">
                  <KnowledgeGateway article={gloss.curatedStrands} surface="cream">
                    <span className="cursor-pointer border-b-2 border-dotted border-[#C4A882]/60 font-semibold text-[#6B543C] transition-colors hover:border-[#E67E22] hover:text-[#E67E22]">
                      Curated strands of innovation.
                    </span>
                  </KnowledgeGateway>
                </span>
                <br />
                <span className="copy-balanced-line">
                  Filter by the specific{" "}
                  <KnowledgeGateway article={gloss.silkStrand} surface="cream">
                    <span className="cursor-pointer font-bold text-[#9C7C5B] transition-colors duration-200 hover:text-[#E67E22]">
                      &ldquo;Silk&rdquo;
                    </span>
                  </KnowledgeGateway>{" "}
                  type used to build the experience.
                </span>
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4 shrink-0 w-full md:max-w-xs">
              <div
                className="flex items-center gap-2 bg-[#F9F7F3]/95 backdrop-blur-md rounded-full px-3 py-2 border border-[#C4A882]/30"
                role="group"
                aria-label="Library view"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE] mr-1 hidden sm:inline">
                  View
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    viewMode === "grid"
                      ? "bg-[#E67E22] text-white shadow-sm"
                      : "text-[#5A5653] hover:text-[#E67E22]"
                  }`}
                  aria-pressed={viewMode === "grid"}
                >
                  Card grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    viewMode === "map"
                      ? "bg-[#E67E22] text-white shadow-sm"
                      : "text-[#5A5653] hover:text-[#E67E22]"
                  }`}
                  aria-pressed={viewMode === "map"}
                >
                  Connection map
                </button>
              </div>
              {viewMode === "map" && (
                <p className="text-xs text-[#5A5653] font-light leading-relaxed text-center md:text-right w-full">
                  Lines connect strands that share tags — hover a node to highlight its links.
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
              {FILTERS.map((f) => (
                <KnowledgeGateway key={f.key} article={gloss[f.glossArticle]} surface="cream" onOpen={() => setActiveFilter(f.key)}>
                  <span className={`inline-block px-6 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f.key
                      ? "bg-[#E67E22] text-[#F9F7F3] border-[#E67E22]"
                      : "border-[#D1CEC7] text-[#5A5653] hover:border-[#E67E22] hover:text-[#E67E22]"
                  }`}>
                    {f.label}
                  </span>
                </KnowledgeGateway>
              ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {viewMode === "map" && displayStrands.length > 0 ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-[#E8E5DF] bg-[#FDFCFA]/90 p-6 shadow-sm">
            <svg viewBox="0 0 100 100" className="w-full aspect-square max-h-[420px]" role="img" aria-label="Strand connection map by shared tags">
              {tagEdges.map(([a, b]) => {
                const pa = mapPositions.find((p) => p.id === a);
                const pb = mapPositions.find((p) => p.id === b);
                if (!pa || !pb) return null;
                const active =
                  mapHoverId === null || mapHoverId === a || mapHoverId === b;
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke="#E67E22"
                    strokeOpacity={active ? 0.35 : 0.08}
                    strokeWidth={0.35}
                  />
                );
              })}
              {mapPositions.map((node) => (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setMapHoverId(node.id)}
                  onMouseLeave={() => setMapHoverId(null)}
                  onClick={() => onSelect(node.item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(node.item);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={node.item.name}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={mapHoverId === node.id ? 3.2 : 2.6}
                    fill={CATEGORY_COLORS[node.item.category]}
                    stroke="#FDFCFA"
                    strokeWidth={0.6}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5.5}
                    textAnchor="middle"
                    className="fill-[#5A5653] text-[2.8px] font-semibold pointer-events-none"
                  >
                    {node.item.name.length > 14
                      ? `${node.item.name.slice(0, 12)}…`
                      : node.item.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerMs={80}>
            {displayStrands.length > 0 ? (
              displayStrands.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => setCardRef(item.id, el)}
                  className="glass-card rounded-3xl p-8 cursor-pointer group flex flex-col h-full"
                  onClick={() => onSelect(item)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="flex-grow text-center">
                    <div className="flex gap-2 mb-6 flex-wrap justify-center">
                      {item.tags.map((tag) => (
                        <KnowledgeGateway key={tag} article={gloss.strandTags} surface="cream">
                          <span className="font-bold text-[#6B543C] hover:text-[#E67E22] transition-colors duration-200 text-[0.7rem] px-[0.3rem] py-[0.1rem] rounded bg-[#E8E5DF] uppercase tracking-wider cursor-pointer">{tag}</span>
                        </KnowledgeGateway>
                      ))}
                    </div>
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-[#E67E22] transition-colors tracking-tighter">
                      {item.name}
                    </h3>
                    <BalancedText text={item.shortDesc} className="text-[#5A5653] text-sm font-light" />
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#E8E5DF] flex justify-between items-center">
                    <KnowledgeGateway article={
                      item.category === "webgl" ? gloss.spatialCategory :
                      item.category === "ai" ? gloss.genAICategory :
                      gloss.physicsCategory
                    } surface="cream">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#9C7C5B] hover:text-[#E67E22] transition-colors cursor-pointer">
                        {item.categoryLabel}
                      </span>
                    </KnowledgeGateway>
                    <span className="text-[#D1CEC7] group-hover:text-[#E67E22] transform transition-all group-hover:translate-x-1">
                      ⟶
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-[#5A5653]">
                <BalancedText text="No strands match this silk type." className="mx-auto" />
              </div>
            )}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}
