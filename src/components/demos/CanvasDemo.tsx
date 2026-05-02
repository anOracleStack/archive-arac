"use client";

import { useEffect, useRef } from "react";

export function CanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = Array.from(
      { length: 22 },
      () => ({
        x: Math.random() * 380,
        y: Math.random() * 260,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        r: Math.random() * 3 + 2,
      })
    );

    const draw = () => {
      ctx.clearRect(0, 0, 380, 260);

      // Draw silk connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.3;
            ctx.strokeStyle = `rgba(230, 126, 34, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw and move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 380) p.vx *= -1;
        if (p.y < 0 || p.y > 260) p.vy *= -1;

        ctx.fillStyle = "#E67E22";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={380}
        height={260}
        className="border border-[#E8E5DF] rounded-xl bg-[#F9F7F3] max-w-full shadow-sm"
      />
      <p className="mt-3 text-[10px] text-gray-400 text-center pointer-events-none">
        Particle nodes connected by silk strands — a living data web
      </p>
    </div>
  );
}
