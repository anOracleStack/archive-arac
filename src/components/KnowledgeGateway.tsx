"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { GatewayArticle } from "@/data/knowledgeGloss";

type Level = "beginner" | "moderate" | "advanced";

function usePanelEnter(open: boolean) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);
  return entered;
}

const LEVELS: { key: Level; label: string; sub: string }[] = [
  { key: "beginner", label: "New here", sub: "Plain words" },
  { key: "moderate", label: "Comfortable", sub: "Some jargon" },
  { key: "advanced", label: "Deep cut", sub: "Industry terms" },
];

type Props = {
  article: GatewayArticle;
  /** Trigger sits on cream sections vs ink (dark) sections */
  surface?: "cream" | "ink";
  /** Visually smaller trigger for tight rows */
  compact?: boolean;
};

export function KnowledgeGateway({ article, surface = "cream", compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<Level>("beginner");
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelEntered = usePanelEnter(open);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    queueMicrotask(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onKey]);

  const block = article[level];

  const triggerBase =
    surface === "ink"
      ? "border-white/25 text-[#F9F7F3]/90 hover:border-[#E67E22] hover:text-[#E67E22] hover:bg-white/5"
      : "border-[#D1CEC7] text-[#5A5653] hover:border-[#E67E22] hover:text-[#E67E22] hover:bg-[#E67E22]/5";

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        title={`Break down: ${article.headline}`}
        className={`inline-flex shrink-0 items-center justify-center rounded-full border bg-transparent transition-all duration-300 ${triggerBase} ${
          compact ? "h-7 w-7" : "h-9 w-9"
        } motion-reduce:transition-none`}
      >
        <span className="sr-only">Explain {article.headline}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end md:justify-end" role="presentation">
          <button
            type="button"
            aria-label="Close explanation"
            className={`absolute inset-0 bg-[#2C2A29]/40 backdrop-blur-[2px] motion-reduce:backdrop-blur-none transition-opacity duration-200 ${
              panelEntered ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${panelId}-title`}
            className={`relative m-0 h-full w-full max-w-md border-l border-[#E8E5DF] bg-[#FDFCFA] shadow-[-24px_0_60px_-20px_rgba(44,42,41,0.25)] flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
              panelEntered ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E8E5DF] px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-1">Thread unravel</p>
                <h2 id={`${panelId}-title`} className="text-xl font-bold tracking-tight text-[#2C2A29] pr-2">
                  {article.headline}
                </h2>
                {article.say && (
                  <p className="mt-2 text-xs text-[#5A5653] font-mono">
                    <span className="text-[#D1CEC7] font-sans not-italic">Say it:</span> {article.say}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-xl border border-[#E8E5DF] p-2 text-[#5A5653] hover:border-[#E67E22] hover:text-[#2C2A29] transition-colors"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex gap-1 border-b border-[#E8E5DF] px-4 py-3 bg-[#F9F7F3]/80">
              {LEVELS.map(({ key, label, sub }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLevel(key)}
                  className={`flex-1 rounded-xl px-2 py-2 text-center transition-all ${
                    level === key
                      ? "bg-[#2C2A29] text-white shadow-sm"
                      : "text-[#5A5653] hover:bg-white/80"
                  }`}
                >
                  <span className="block text-[10px] font-black uppercase tracking-widest">{label}</span>
                  <span className={`block text-[9px] mt-0.5 ${level === key ? "text-[#D1CEC7]" : "text-[#B8B5AE]"}`}>
                    {sub}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8BA896] mb-2">What it is</h3>
                <p className="text-sm text-[#2C2A29] leading-relaxed text-pretty">{block.what}</p>
              </section>
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E67E22] mb-2">Why it matters</h3>
                <p className="text-sm text-[#2C2A29] leading-relaxed text-pretty">{block.why}</p>
              </section>
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2C2A29] mb-2">What we do with it</h3>
                <p className="text-sm text-[#5A5653] leading-relaxed text-pretty">{block.action}</p>
              </section>
            </div>

            <div className="border-t border-[#E8E5DF] px-6 py-4 bg-[#F9F7F3]/90">
              <p className="text-[10px] text-[#B8B5AE] leading-relaxed text-center text-pretty">
                Gateways are editorial signposts—not legal, medical, or financial advice. Tune copy per release.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
