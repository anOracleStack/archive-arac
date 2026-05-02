"use client";

import { useCallback, useRef } from "react";

export function SpatialDemo() {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const w = wrapperRef.current;
    const c = cardRef.current;
    if (!w || !c) return;
    const r = w.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / 10;
    const y = (e.clientY - r.top - r.height / 2) / -10;
    c.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateX(0) rotateY(0)";
    }
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        ref={wrapperRef}
        className="perspective-1000 w-full h-64 flex items-center justify-center"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div
          ref={cardRef}
          className="w-48 h-64 bg-gradient-to-br from-[#E67E22] to-[#BF6516] rounded-3xl shadow-2xl preserve-3d flex items-center justify-center font-black text-white tracking-widest border-4 border-white/20 relative"
        >
          <div className="absolute inset-0 rounded-3xl border border-white/10" />
          <span className="text-xl" style={{ transform: "translateZ(40px)" }}>
            SILK
          </span>
          {/* Orb web lines radiating from center */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 192 256"
            style={{ transform: "translateZ(20px)" }}
          >
            <line x1="96" y1="0" x2="96" y2="256" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <line x1="0" y1="128" x2="192" y2="128" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <line x1="0" y1="0" x2="192" y2="256" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <line x1="192" y1="0" x2="0" y2="256" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <circle cx="96" cy="128" r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15" />
            <circle cx="96" cy="128" r="60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
          </svg>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-gray-400 text-center pointer-events-none">
        Move mouse inside — the web facet tilts in 3D
      </p>
    </div>
  );
}
