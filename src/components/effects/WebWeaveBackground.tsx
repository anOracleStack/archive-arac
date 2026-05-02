"use client";

import { useEffect, useRef } from "react";
import type { SilkPoint } from "@/types";

export function WebWeaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let mouseX = -9999;
    let mouseY = -9999;
    const SILK_DIST = 140;
    const MOUSE_PULL = 40;
    const NODES = 55;

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const points: SilkPoint[] = Array.from({ length: NODES }, () => {
      const x = Math.random() * cvs.width;
      const y = Math.random() * cvs.height;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        connections: [],
      };
    });

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    const CREAM = { r: 249, g: 247, b: 243 };
    const SOFT_ORANGE = { r: 255, g: 246, b: 236 };
    const SILK_ORANGE = { r: 230, g: 126, b: 34 };
    const PERIOD_MS = 72000;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      const phase = (Math.sin((performance.now() / PERIOD_MS) * Math.PI * 2) + 1) / 2;
      const bgR = lerp(CREAM.r, SOFT_ORANGE.r, phase);
      const bgG = lerp(CREAM.g, SOFT_ORANGE.g, phase);
      const bgB = lerp(CREAM.b, SOFT_ORANGE.b, phase);
      document.body.style.backgroundColor = `rgb(${Math.round(bgR)},${Math.round(bgG)},${Math.round(bgB)})`;

      const sR = lerp(SILK_ORANGE.r, CREAM.r, phase);
      const sG = lerp(SILK_ORANGE.g, CREAM.g, phase);
      const sB = lerp(SILK_ORANGE.b, CREAM.b, phase);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Mouse influence — silk is drawn toward the cursor
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const force = (250 - dist) / 250;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Spring back to base
        p.vx += (p.baseX - p.x) * 0.008;
        p.vy += (p.baseY - p.y) * 0.008;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        // Keep in bounds
        if (p.x < 0 || p.x > cvs.width) p.vx *= -1;
        if (p.y < 0 || p.y > cvs.height) p.vy *= -1;
      }

      // Draw silk connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < SILK_DIST) {
            const baseAlpha = (1 - dist / SILK_DIST) * (0.32 + phase * 0.18);
            // Thicker strands closer to cursor
            const cursorDist = Math.min(
              Math.sqrt((mouseX - (a.x + b.x) / 2) ** 2 + (mouseY - (a.y + b.y) / 2) ** 2),
              300
            );
            const width = 0.5 + (1 - cursorDist / 300) * 1.5;
            ctx.strokeStyle = `rgba(${Math.round(sR)},${Math.round(sG)},${Math.round(sB)},${baseAlpha})`;
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const p of points) {
        const distToMouse = Math.sqrt((mouseX - p.x) ** 2 + (mouseY - p.y) ** 2);
        const size = distToMouse < 150 ? 2 + (1 - distToMouse / 150) * 3 : 1.5;
        const nodeAlpha = distToMouse < 150 ? 0.75 + phase * 0.1 : 0.28 + phase * 0.2;
        ctx.fillStyle = `rgba(${Math.round(sR)},${Math.round(sG)},${Math.round(sB)},${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      document.body.style.backgroundColor = "";
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
