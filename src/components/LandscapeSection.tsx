"use client";

import { useEffect, useRef } from "react";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { ScrollReveal } from "@/components/ScrollReveal";
import { gloss } from "@/data/knowledgeGloss";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

export function LandscapeSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.color = "#5A5653";

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["2023", "2024", "2025", "2026"],
        datasets: [
          {
            label: "AI Intent",
            data: [10, 25, 70, 95],
            borderColor: "#9C7C5B",
            backgroundColor: "rgba(156, 124, 91, 0.05)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#F9F7F3",
            pointBorderColor: "#9C7C5B",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
          {
            label: "Spatial WebGL",
            data: [30, 45, 60, 80],
            borderColor: "#8BA896",
            backgroundColor: "rgba(139, 168, 150, 0.05)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#F9F7F3",
            pointBorderColor: "#8BA896",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
          },
          {
            label: "Physics Micro-UX",
            data: [40, 55, 70, 82],
            borderColor: "#2C2A29",
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false,
            pointBackgroundColor: "#F9F7F3",
            pointBorderColor: "#2C2A29",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { usePointStyle: true, boxWidth: 8, padding: 20, font: { weight: "500" } as any },
          },
          tooltip: {
            backgroundColor: "rgba(44, 42, 41, 0.9)",
            titleFont: { size: 14, family: "'Outfit', sans-serif" } as any,
            bodyFont: { size: 13, family: "'Outfit', sans-serif" } as any,
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: "rgba(209, 206, 199, 0.3)" } as any,
            ticks: { callback: (v: any) => v + "%", padding: 10 },
          },
          x: {
            grid: { display: false } as any,
            ticks: { padding: 10 },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return (
    <section id="weave" className="relative z-10 py-24 px-6 bg-white border-y border-[#C4A882]/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 text-center lg:text-left">
            <ScrollReveal>
              <div className="mb-6">
                <h2 className="text-4xl font-bold tracking-tight text-balance">
                  <KnowledgeGateway article={gloss.weaveGrowth} surface="cream">
                    <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">The Growth of the Weave</span>
                  </KnowledgeGateway>
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal index={1}>
              <p className="text-[#5A5653] mb-6 leading-relaxed text-pretty text-balance">
                Traditional <KnowledgeGateway article={gloss.whatIsUI} surface="cream"><span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">UI</span></KnowledgeGateway> patterns are decaying. Our data tracks the shift from static grids to{" "}
                <KnowledgeGateway article={gloss.spatialCategory} surface="cream"><span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">Spatial Silk</span></KnowledgeGateway> & <KnowledgeGateway article={gloss.intentDrivenTerm} surface="cream"><span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">Intent-Driven</span></KnowledgeGateway> interfaces.
              </p>
            </ScrollReveal>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <div className="flex items-center justify-center gap-3 text-sm font-bold lg:justify-start">
                <div className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-[#9C7C5B]" />{" "}
                <KnowledgeGateway article={gloss.intentDrivenTerm} surface="cream">
                  <span className="cursor-pointer font-bold text-[#9C7C5B] transition-colors duration-200 hover:text-[#E67E22]">AI Intent-Driven</span>
                </KnowledgeGateway>{" "}
                (+82%)
              </div>
              <div className="flex items-center justify-center gap-3 text-sm font-bold lg:justify-start">
                <div className="h-3 w-3 shrink-0 rounded-full bg-[#8BA896]" />{" "}
                <KnowledgeGateway article={gloss.spatialCategory} surface="cream">
                  <span className="cursor-pointer font-bold text-[#9C7C5B] transition-colors duration-200 hover:text-[#E67E22]">Spatial WebGL</span>
                </KnowledgeGateway>{" "}
                (+45%)
              </div>
              <div className="flex items-center justify-center gap-3 text-sm font-bold lg:justify-start">
                <div className="h-3 w-3 shrink-0 rounded-full bg-[#2C2A29]" />{" "}
                <KnowledgeGateway article={gloss.physicsCategory} surface="cream">
                  <span className="cursor-pointer font-bold text-[#9C7C5B] transition-colors duration-200 hover:text-[#E67E22]">Physics Micro-UX</span>
                </KnowledgeGateway>{" "}
                (+30%)
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 chart-container bg-[#F9F7F3] rounded-3xl p-6 border border-[#C4A882]/20">
            <ScrollReveal index={2}>
              <canvas ref={canvasRef} />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
