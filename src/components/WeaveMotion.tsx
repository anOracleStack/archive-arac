"use client";

const WEAVE_BEATS = [
  {
    title: "AI Intent-Driven",
    color: "#9C7C5B",
    descriptor: "Interfaces that infer what you mean, not just what you click.",
    dashed: false,
  },
  {
    title: "Spatial WebGL",
    color: "#8BA896",
    descriptor: "Depth, parallax, and scene-like layouts beyond flat grids.",
    dashed: false,
  },
  {
    title: "Physics Micro-UX",
    color: "#2C2A29",
    descriptor: "Motion with weight—scroll, drag, and spring that feel tangible.",
    dashed: true,
  },
] as const;

export function WeaveMotionDescriptors() {
  return (
    <div className="weave-descriptors flex flex-col items-center gap-4 motion-reduce:hidden">
      {WEAVE_BEATS.map((beat, i) => (
        <div
          key={beat.title}
          className={`weave-descriptor weave-descriptor-${i + 1} flex items-center justify-center gap-3 text-sm transition-colors duration-300`}
        >
          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: beat.color }}
          />
          <span className="font-bold text-[#9C7C5B]">{beat.title}</span>
          <span className="weave-descriptor-copy hidden text-[#5A5653] font-normal sm:inline">
            — {beat.descriptor}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WeaveMotionStaticCards() {
  return (
    <div className="hidden flex-col gap-3 p-4 motion-reduce:flex">
      {WEAVE_BEATS.map((beat) => (
        <div
          key={beat.title}
          className="rounded-2xl border border-[#C4A882]/30 bg-white/80 px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: beat.color }}
            />
            <span className="text-sm font-bold text-[#2C2A29]">{beat.title}</span>
          </div>
          <p className="text-xs text-[#5A5653] leading-relaxed">{beat.descriptor}</p>
        </div>
      ))}
    </div>
  );
}

export function WeaveMotionStage() {
  return (
    <div className="weave-stage relative aspect-[16/10] w-full min-h-[280px] max-h-[360px]">
      <div className="absolute inset-x-0 top-3 z-10 flex justify-center px-4">
        <span className="rounded-full border border-[#C4A882]/40 bg-[#F9F7F3]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#5A5653]">
          Illustrative trends · not live data
        </span>
      </div>

      <WeaveMotionStaticCards />

      <svg
        className="weave-motion-svg absolute inset-0 h-full w-full motion-reduce:hidden"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="weave-grid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D1CEC7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D1CEC7" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <g className="weave-grid opacity-0">
          {[100, 175, 250, 325, 400].map((y) => (
            <line
              key={y}
              x1="60"
              y1={y}
              x2="740"
              y2={y}
              stroke="#D1CEC7"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
          ))}
          <rect x="60" y="80" width="680" height="340" fill="url(#weave-grid-fade)" opacity="0.4" />
        </g>

        <path
          className="weave-thread weave-thread-1"
          pathLength="1"
          d="M 80 420 C 180 380, 280 320, 400 260 S 620 140, 720 100"
          fill="none"
          stroke="#9C7C5B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
        />
        <path
          className="weave-thread weave-thread-2"
          pathLength="1"
          d="M 720 400 C 580 360, 460 280, 340 220 S 160 120, 100 80"
          fill="none"
          stroke="#8BA896"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
        />
        <path
          className="weave-thread weave-thread-3"
          pathLength="1"
          d="M 120 120 C 240 180, 360 240, 480 300 S 660 380, 700 420"
          fill="none"
          stroke="#2C2A29"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="8 6"
          strokeDashoffset="1"
        />

        <g className="weave-label weave-label-1" opacity="0">
          <circle cx="720" cy="100" r="6" fill="#9C7C5B" />
          <text x="720" y="78" textAnchor="end" className="weave-label-text" fill="#9C7C5B">
            AI Intent-Driven
          </text>
        </g>
        <g className="weave-label weave-label-2" opacity="0">
          <circle cx="100" cy="80" r="6" fill="#8BA896" />
          <text x="100" y="58" textAnchor="start" className="weave-label-text" fill="#8BA896">
            Spatial WebGL
          </text>
        </g>
        <g className="weave-label weave-label-3" opacity="0">
          <circle cx="700" cy="420" r="6" fill="#2C2A29" />
          <text x="700" y="448" textAnchor="end" className="weave-label-text" fill="#2C2A29">
            Physics Micro-UX
          </text>
        </g>

        <g className="weave-knot-pulse" opacity="0">
          <circle cx="400" cy="260" r="12" fill="#9C7C5B" opacity="0.08" />
          <circle cx="340" cy="220" r="10" fill="#8BA896" opacity="0.08" />
        </g>
      </svg>
    </div>
  );
}
