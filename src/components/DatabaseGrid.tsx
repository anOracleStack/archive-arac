"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { StrandItem, SilkCategory } from "@/types";
import { strands } from "@/data/strands";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { gloss } from "@/data/knowledgeGloss";

const FILTERS: { key: SilkCategory | "all"; label: string }[] = [
  { key: "all", label: "All Strands" },
  { key: "webgl", label: "Spatial" },
  { key: "ai", label: "Gen-AI" },
  { key: "ux", label: "Physics" },
];

interface DatabaseGridProps {
  onSelect: (item: StrandItem) => void;
}

export function DatabaseGrid({ onSelect }: DatabaseGridProps) {
  const [activeFilter, setActiveFilter] = useState<SilkCategory | "all">("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const animRef = useRef<number>(0);

  const filtered = activeFilter === "all" ? strands : strands.filter((i) => i.category === activeFilter);

  const setCardRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  // Draw web connections between cards on hover
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      frame++;

      if (hoveredId !== null) {
        const hoveredEl = cardRefs.current.get(hoveredId);
        if (!hoveredEl) {
          animRef.current = requestAnimationFrame(draw);
          return;
        }

        const hRect = hoveredEl.getBoundingClientRect();
        const hCenterX = hRect.left + hRect.width / 2;
        const hCenterY = hRect.top + hRect.height / 2;

        cardRefs.current.forEach((el, id) => {
          if (id === hoveredId) return;
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

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

            // Curved bezier
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
    return () => cancelAnimationFrame(animRef.current);
  }, [hoveredId]);

  return (
    <section id="index" className="relative z-10 py-24 px-6">
      {/* Overlay canvas for web connections */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-30" style={{ opacity: 0.8 }} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-4xl font-bold tracking-tight flex items-center gap-3 flex-1 text-balance">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1">
                  <path d="M12 2a10 10 0 0 1 7.07 17.07L12 22l-7.07-2.93A10 10 0 0 1 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>Index Araneae</span>
              </h2>
              <KnowledgeGateway article={gloss.indexAraneae} surface="cream" />
            </div>
            <p className="text-[#5A5653] text-pretty text-balance leading-relaxed flex flex-wrap items-center gap-2">
              <span>
                Curated strands of innovation. Filter by the specific &ldquo;Silk&rdquo; type used to build the experience.
              </span>
              <KnowledgeGateway article={gloss.silkStrand} surface="cream" compact />
            </p>
          </div>
          <div className="flex flex-wrap gap-2" id="filter-container">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`px-6 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === f.key
                    ? "bg-[#E67E22] text-[#F9F7F3] border-[#E67E22]"
                    : "border-[#D1CEC7] text-[#5A5653] hover:border-[#E67E22] hover:text-[#E67E22]"
                }`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              ref={(el) => setCardRef(item.id, el)}
              className="glass-card rounded-3xl p-8 cursor-pointer group flex flex-col h-full"
              onClick={() => onSelect(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex-grow">
                <div className="flex gap-2 mb-6 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
                <h3 className="text-3xl font-bold mb-4 group-hover:text-[#E67E22] transition-colors tracking-tighter">
                  {item.name}
                </h3>
                <p className="text-[#5A5653] text-sm leading-relaxed font-light">{item.shortDesc}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E8E5DF] flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E67E22]">
                  {item.categoryLabel}
                </span>
                <span className="text-[#D1CEC7] group-hover:text-[#E67E22] transform transition-all group-hover:translate-x-1">
                  ⟶
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#5A5653]">No strands match this silk type.</div>
        )}
      </div>
    </section>
  );
}
