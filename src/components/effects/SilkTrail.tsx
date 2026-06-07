"use client";

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export function SilkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const trail: TrailPoint[] = [];
    const MAX_POINTS = 28;
    let mouseX = -100;
    let mouseY = -100;

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      trail.push({ x: mouseX, y: mouseY, age: 0 });
      if (trail.length > MAX_POINTS) trail.shift();
    };
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      if (trail.length < 2) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Age all points
      for (const p of trail) p.age++;

      // Draw silk strand along trail
      for (let i = 1; i < trail.length; i++) {
        const p0 = trail[i - 1];
        const p1 = trail[i];
        const ageRatio = 1 - p1.age / MAX_POINTS;
        if (ageRatio <= 0) continue;

        const alpha = ageRatio * 0.6;
        const width = ageRatio * 3;

        ctx.strokeStyle = `rgba(230, 126, 34, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      // Draw node at cursor tip (spinneret glow)
      const last = trail[trail.length - 1];
      if (last) {
        const glow = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 12);
        glow.addColorStop(0, "rgba(230, 126, 34, 0.9)");
        glow.addColorStop(1, "rgba(230, 126, 34, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(last.x, last.y, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: 0.7 }}
    />
  );
}
