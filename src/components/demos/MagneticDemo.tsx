"use client";

import { useCallback, useRef } from "react";

export function MagneticDemo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    if (Math.sqrt(dx * dx + dy * dy) < 200) {
      btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
    } else {
      btn.style.transform = "translate(0,0)";
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        ref={wrapperRef}
        className="w-full h-48 flex items-center justify-center relative"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <button
          ref={btnRef}
          className="magnet-btn px-10 py-5 bg-[#2C2A29] text-white rounded-full font-black text-xs tracking-widest uppercase shadow-lg relative"
        >
          <span className="relative z-10">Magnetic Strand</span>
          <span className="absolute inset-0 rounded-full border border-[#E67E22]/30 animate-pulse" />
        </button>
      </div>
      <p className="mt-3 text-[10px] text-gray-400 text-center pointer-events-none">
        Move cursor close — the strand pulls toward you
      </p>
    </div>
  );
}
