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

export function DatabaseGrid({ onSelect }: DatabaseGridProps) {
  const [activeFilter, setActiveFilter] = useState<SilkCategory | "all">("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [webView, setWebView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const animRef = useRef<number>(0);
  const webAnimRef = useRef<number>(0);

  const filtered = activeFilter === "all" ? strands : strands.filter((i) => i.category === activeFilter);
  const displayStrands = webView ? strands : filtered;

  const setCardRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  // Connection-lines canvas (grid mode) — scoped to Index section so lines sit behind cards, not over the whole page
  useEffect(() => {
    const cvs = canvasRef.current;
    const section = sectionRef.current;
    if (!cvs || !section || webView) return;
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
  }, [hoveredId, webView]);

  useEffect(() => {
    if (!webView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWebView(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [webView]);

  // Web View — radial/orbital node canvas
  useEffect(() => {
    if (!webView) {
      cancelAnimationFrame(webAnimRef.current);
      return;
    }

    const cvs = webCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = strands.map((s, i) => {
      const angle = (2 * Math.PI * i) / strands.length - Math.PI / 2;
      const radius = Math.min(cvs.width, cvs.height) * 0.3;
      const cx = cvs.width / 2 + Math.cos(angle) * radius;
      const cy = cvs.height / 2 + Math.sin(angle) * radius;
      return {
        id: s.id,
        name: s.name,
        category: s.category,
        cx,
        cy,
        targetX: cx,
        targetY: cy,
        vx: 0,
        vy: 0,
        pulse: 0,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        label: s.shortDesc,
      };
    });

    const connections: { a: number; b: number; alpha: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sameCat = nodes[i].category === nodes[j].category;
        connections.push({
          a: i,
          b: j,
          alpha: sameCat ? 0.35 : 0.12,
        });
      }
    }

    let hoveredNode: number | null = null;
    let mouseX = cvs.width / 2;
    let mouseY = cvs.height / 2;
    let isMouseOnCanvas = false;

    cvs.onmousemove = (e) => {
      const rect = cvs.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseOnCanvas = true;

      hoveredNode = null;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = mouseX - n.cx;
        const dy = mouseY - n.cy;
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
          hoveredNode = i;
          cvs.style.cursor = "pointer";
          break;
        }
      }
      if (hoveredNode === null) cvs.style.cursor = "default";
    };

    cvs.onmouseleave = () => {
      isMouseOnCanvas = false;
      hoveredNode = null;
      cvs.style.cursor = "default";
    };

    cvs.onclick = () => {
      if (hoveredNode !== null) {
        const strand = strands[nodes[hoveredNode].id - 1];
        if (strand) onSelect(strand);
      } else {
        setWebView(false);
      }
    };

    let frame = 0;

    const draw = () => {
      if (!ctx || !cvs) return;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      frame++;

      nodes.forEach((n) => {
        n.pulse += n.pulseSpeed;
        const driftAmp = 6;
        const driftX = Math.sin(frame * 0.005 + n.id * 1.7) * driftAmp;
        const driftY = Math.cos(frame * 0.004 + n.id * 2.3) * driftAmp;
        n.cx += (n.targetX + driftX - n.cx) * 0.02;
        n.cy += (n.targetY + driftY - n.cy) * 0.02;

        if (isMouseOnCanvas && hoveredNode !== nodes.indexOf(n)) {
          const dx = n.cx - mouseX;
          const dy = n.cy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150 * 3;
            n.cx += (dx / dist) * force;
            n.cy += (dy / dist) * force;
          }
        }
      });

      connections.forEach((conn) => {
        const na = nodes[conn.a];
        const nb = nodes[conn.b];
        const dist = Math.sqrt((na.cx - nb.cx) ** 2 + (na.cy - nb.cy) ** 2);
        const maxDist = Math.min(cvs.width, cvs.height) * 0.65;
        if (dist > maxDist) return;

        let alpha = conn.alpha;
        if (hoveredNode !== null) {
          if (hoveredNode === conn.a || hoveredNode === conn.b) {
            alpha = Math.min(alpha + 0.5, 0.7);
          } else {
            alpha *= 0.3;
          }
        }

        const pulse = 0.7 + 0.3 * Math.sin(frame * 0.02 + conn.a + conn.b);
        ctx.strokeStyle = `rgba(156, 124, 91, ${alpha * pulse})`;
        ctx.lineWidth = 0.5 + alpha * 1.5;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.moveTo(na.cx, na.cy);
        const midX = (na.cx + nb.cx) / 2;
        const midY = (na.cy + nb.cy) / 2 - 10;
        ctx.quadraticCurveTo(midX, midY, nb.cx, nb.cy);
        ctx.stroke();
      });

      nodes.forEach((n, i) => {
        const isHovered = hoveredNode === i;
        const catColor = CATEGORY_COLORS[n.category];
        const baseRadius = isHovered ? 36 : 24;
        const pulseR = isHovered ? 0 : Math.sin(n.pulse) * 3;
        const r = baseRadius + pulseR;

        if (isHovered) {
          const grad = ctx.createRadialGradient(n.cx, n.cy, 0, n.cx, n.cy, r + 20);
          grad.addColorStop(0, `${catColor}99`);
          grad.addColorStop(1, `${catColor}00`);
          ctx.beginPath();
          ctx.arc(n.cx, n.cy, r + 20, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.cx, n.cy, r, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? catColor : `${catColor}33`;
        ctx.fill();
        ctx.strokeStyle = catColor;
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.stroke();

        ctx.fillStyle = isHovered ? "#2C2A29" : "#5A5653";
        ctx.font = isHovered
          ? "bold 13px 'Outfit', sans-serif"
          : "11px 'Outfit', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const textMetrics = ctx.measureText(n.name);
        const labelW = textMetrics.width + 16;
        const labelH = isHovered ? 20 : 16;
        const labelX = n.cx - labelW / 2;
        const labelY = n.cy + r + 8;
        ctx.fillStyle = "rgba(249, 247, 243, 0.95)";
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelW, labelH, 4);
        ctx.fill();

        ctx.fillStyle = isHovered ? "#2C2A29" : "#5A5653";
        ctx.fillText(n.name, n.cx, labelY + (isHovered ? 2 : 1));

        if (isHovered) {
          ctx.font = "10px 'Outfit', sans-serif";
          ctx.fillStyle = "#6B543C";
          const descW = Math.min(220, ctx.measureText(n.label).width + 16);
          const descX = n.cx - descW / 2;
          const descY = labelY + labelH + 4;
          ctx.fillStyle = "rgba(249, 247, 243, 0.9)";
          ctx.beginPath();
          ctx.roundRect(descX, descY, descW, 18, 4);
          ctx.fill();
          ctx.fillStyle = "#5A5653";
          ctx.fillText(n.label, n.cx, descY + 5);
        }
      });

      webAnimRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(webAnimRef.current);
      window.removeEventListener("resize", resize);
      cvs.onmousemove = null;
      cvs.onmouseleave = null;
      cvs.onclick = null;
    };
  }, [webView, onSelect]);

  return (
    <section id="index" ref={sectionRef} className="relative z-10 overflow-hidden py-24 px-6">
      {/* Connection canvas — only this section; paints behind cards (z-0) */}
      {!webView && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          style={{ opacity: 0.75 }}
          aria-hidden
        />
      )}

      {/* Web View full-page canvas */}
      {webView && (
        <canvas
          ref={webCanvasRef}
          className="fixed inset-0 z-20 h-full w-full pointer-events-auto"
        />
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mb-16 flex flex-col items-center gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl text-center mx-auto">
              <div className="mb-4 flex items-start justify-center gap-3">
                <h2 className="flex flex-1 flex-wrap items-center justify-center gap-3 text-balance text-4xl font-bold tracking-tight">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0">
                    <path d="M12 2a10 10 0 0 1 7.07 17.07L12 22l-7.07-2.93A10 10 0 0 1 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <KnowledgeGateway article={gloss.indexAraneae} surface="cream">
                    <span className="cursor-pointer border-b-2 border-transparent font-bold text-[#9C7C5B] transition-colors duration-200 hover:border-[#E67E22] hover:text-[#E67E22]">Index Araneae</span>
                  </KnowledgeGateway>
                </h2>
              </div>
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
            <div className="flex flex-wrap items-center gap-3">
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
        </ScrollReveal>

        {/* Grid view */}
        {!webView && (
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

        {/* Web View — empty state, canvas handles rendering */}
        {webView && displayStrands.length === 0 && (
          <div className="text-center py-40 text-[#5A5653]">
            <BalancedText text="No strands match this silk type." className="mx-auto" />
          </div>
        )}
      </div>

      {/* Floating Grid/Web toggle */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-[#F9F7F3]/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-lg border border-[#C4A882]/30">
          <KnowledgeGateway article={gloss.gridWebView} surface="cream">
            <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 cursor-pointer text-[10px] uppercase tracking-widest mr-2">View</span>
          </KnowledgeGateway>
          <button
            onClick={() => setWebView(false)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              !webView
                ? "bg-[#E67E22] text-white shadow-sm"
                : "text-[#5A5653] hover:text-[#E67E22]"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setWebView(true)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              webView
                ? "bg-[#9C7C5B] text-white shadow-sm"
                : "text-[#5A5653] hover:text-[#9C7C5B]"
            }`}
          >
            Web
          </button>
        </div>
      </div>
    </section>
  );
}
