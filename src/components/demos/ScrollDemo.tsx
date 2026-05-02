"use client";

import { useEffect, useRef } from "react";

export function ScrollDemo() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-6", "blur-sm");
            entry.target.classList.add("opacity-100", "translate-y-0", "blur-0");
          }
        });
      },
      { root: box, threshold: 0.4 }
    );

    box.querySelectorAll(".weave-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={boxRef}
        className="w-full h-52 overflow-y-auto bg-[#E8E5DF] rounded-2xl p-5 relative"
      >
        <div className="h-16 mb-4 bg-white/60 rounded-xl flex items-center justify-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
          Scroll to Weave
        </div>
        <div className="weave-reveal opacity-0 translate-y-6 blur-sm transition-all duration-800 h-16 bg-[#E67E22] rounded-xl mb-3 flex items-center justify-center text-white text-xs font-bold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M12 2v20M2 12h20" />
          </svg>
          Strand 1 Woven
        </div>
        <div className="weave-reveal opacity-0 translate-y-6 blur-sm transition-all duration-800 delay-100 h-16 bg-[#8BA896] rounded-xl mb-3 flex items-center justify-center text-white text-xs font-bold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M12 2v20M2 12h20" />
          </svg>
          Strand 2 Woven
        </div>
        <div className="weave-reveal opacity-0 translate-y-6 blur-sm transition-all duration-800 delay-200 h-16 bg-[#2C2A29] rounded-xl mb-3 flex items-center justify-center text-white text-xs font-bold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M12 2v20M2 12h20" />
          </svg>
          Web Complete
        </div>
        <div className="h-8" />
      </div>
      <p className="mt-3 text-[10px] text-gray-400 text-center pointer-events-none">
        Scroll down — strands weave into view
      </p>
    </div>
  );
}
