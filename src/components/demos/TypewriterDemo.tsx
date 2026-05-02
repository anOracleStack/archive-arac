"use client";

import { useEffect, useRef } from "react";

export function TypewriterDemo() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = textRef.current;
    if (!target) return;

    const lines = [
      "> Spinning web strand...",
      "> Threading intent layer...",
      "> Weaving UI silk...",
      "> Strand active.",
    ];
    let lineIdx = 0;
    let charIdx = 0;
    target.innerHTML = "";

    const tick = () => {
      if (lineIdx >= lines.length) return;
      const line = lines[lineIdx];
      if (charIdx < line.length) {
        target.innerHTML += line[charIdx];
        charIdx++;
        setTimeout(tick, 30);
      } else {
        target.innerHTML += "\n";
        lineIdx++;
        charIdx = 0;
        setTimeout(tick, 200);
      }
    };
    tick();

    return () => {
      target.innerHTML = "";
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-[#2C2A29] rounded-2xl p-6 font-mono text-sm h-36 flex flex-col justify-end shadow-xl">
      <div className="flex gap-2 mb-3">
        <span className="text-[#E67E22] shrink-0 font-bold">arac@weave:~$</span>
        <span className="text-[#8BA896]">spin --strand intent</span>
      </div>
      <div ref={textRef} className="flex-grow text-[#8BA896] whitespace-pre-wrap" />
      <span className="w-2 h-4 bg-[#E67E22] animate-pulse mt-1 inline-block" />
    </div>
  );
}
