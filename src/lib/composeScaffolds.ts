import type { DemoType } from "@/types";

const scaffolds: Record<DemoType, string> = {
  fluid: `// components/weave/BentoWeave.tsx — proximity-expand panels
"use client";
export function BentoWeave({ items }: { items: { id: string; title: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[120px]">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-neutral-200 p-4 transition-[flex-grow] duration-500 hover:flex-[2]"
        >
          <h3 className="font-semibold">{item.title}</h3>
        </article>
      ))}
    </div>
  );
}`,
  spatial: `// components/weave/SpatialTilt.tsx — cursor-facing 3D cards
"use client";
export function SpatialTilt({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="[perspective:1000px]"
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = \`rotateY(\${x * 12}deg) rotateX(\${-y * 12}deg)\`;
      }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
    >
      {children}
    </div>
  );
}`,
  magnetic: `// components/weave/MagneticPull.tsx — elements pull toward cursor
"use client";
import { useRef } from "react";
export function MagneticPull({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const pull = Math.min(24, 120 / d);
        el.style.transform = \`translate(\${(dx / d) * pull}px, \${(dy / d) * pull}px)\`;
      }}
      onMouseLeave={() => { if (ref.current) ref.current.style.transform = ""; }}
      className="inline-block transition-transform duration-200"
    >
      {children}
    </div>
  );
}`,
  typewriter: `// components/weave/IntentPalette.tsx — command-first navigation
"use client";
import { useState } from "react";
export function IntentPalette() {
  const [q, setQ] = useState("");
  return (
    <div className="max-w-lg mx-auto p-4 rounded-2xl border border-neutral-200 bg-neutral-50">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Weave a page… (e.g. pricing, docs)"
        className="w-full bg-transparent outline-none font-mono text-sm"
      />
      <p className="mt-2 text-xs text-neutral-500 font-mono">
        {q ? \`> spinning /\${q.replace(/\\s+/g, "-")} …\` : "> awaiting intent"}
      </p>
    </div>
  );
}`,
  canvas: `// components/weave/ParticleLoom.tsx — canvas particle web (see Archive Arac demo)
"use client";
import { useEffect, useRef } from "react";
export function ParticleLoom() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(230,126,34,0.35)";
      ctx.beginPath();
      ctx.arc(c.width / 2, c.height / 2, 40, 0, Math.PI * 2);
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={400} height={280} className="rounded-2xl border" />;
}`,
  scroll: `// components/weave/ScrollUnfurl.tsx — IntersectionObserver reveals
"use client";
import { useEffect, useRef, useState } from "react";
export function ScrollUnfurl({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={\`transition-all duration-700 \${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}\`}
    >
      {children}
    </div>
  );
}`,
};

export function scaffoldForDemoType(demoType: DemoType): string {
  return scaffolds[demoType];
}

export function buildFullComposePackage(
  projectName: string,
  demoTypes: DemoType[]
): string {
  const blocks = demoTypes.map((t) => scaffoldForDemoType(t)).join("\n\n");
  return `// Archive Arac — Full weave scaffold pack
// Project: ${projectName}
// Copy each block into your Next.js app/components/weave/

${blocks}
`;
}
