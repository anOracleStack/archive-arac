"use client";

import { useEffect, useCallback } from "react";
import type { StrandItem } from "@/types";
import { useScrollLock } from "@/hooks/useScrollLock";
import { FluidDemo } from "./demos/FluidDemo";
import { SpatialDemo } from "./demos/SpatialDemo";
import { MagneticDemo } from "./demos/MagneticDemo";
import { TypewriterDemo } from "./demos/TypewriterDemo";
import { CanvasDemo } from "./demos/CanvasDemo";
import { ScrollDemo } from "./demos/ScrollDemo";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { gloss } from "@/data/knowledgeGloss";
import { BalancedText } from "@/components/BalancedText";

interface ModalProps {
  item: StrandItem | null;
  onClose: () => void;
}

const demos: Record<string, React.FC> = {
  fluid: FluidDemo,
  spatial: SpatialDemo,
  magnetic: MagneticDemo,
  typewriter: TypewriterDemo,
  canvas: CanvasDemo,
  scroll: ScrollDemo,
};

export function Modal({ item, onClose }: ModalProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  }, [onClose]);

  useScrollLock(!!item);

  useEffect(() => {
    if (!item) return;
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [item, handleKey]);

  if (!item) return null;

  const Demo = demos[item.demoType];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2A29]/90 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#F9F7F3] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-modal-in">
        <div className="absolute top-6 left-6 z-20">
          <KnowledgeGateway article={gloss.strandModal} surface="cream" compact />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-[#E67E22] hover:text-white transition-all text-2xl z-10"
        >
          ⨯
        </button>

        <div className="p-8 md:p-12 pt-20 overflow-y-auto">
          <div className="flex gap-2 mb-6 flex-wrap">
            {item.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">{item.name}</h2>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-[#E8E5DF] pb-6 gap-4">
            <p className="text-[#E67E22] font-black tracking-widest uppercase text-xs">{item.categoryLabel}</p>
            <a
              href={item.realLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2C2A29] text-[#F9F7F3] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#E67E22] transition-colors flex items-center gap-3"
            >
              Visit Source Origin <span>↗</span>
            </a>
          </div>

          <div className="mb-12">
            <h4 className="font-black text-xs tracking-widest uppercase mb-4 text-[#5A5653] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" /> Interactive preview
            </h4>
            <div className="w-full bg-white rounded-2xl border border-[#E8E5DF] p-10 overflow-hidden flex items-center justify-center min-h-[300px] shadow-inner relative">
              {Demo ? <Demo /> : null}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-center">
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#2C2A29]">Why it stands out</h4>
              <BalancedText text={item.innovation} className="text-[#5A5653] text-sm" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#2C2A29]">Tech stack</h4>
              <BalancedText text={item.tech} className="text-[#5A5653] text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
