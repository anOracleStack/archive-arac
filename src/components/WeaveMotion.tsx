"use client";

const WEAVE_BEATS = [
  {
    title: "Intent-driven UI",
    color: "#9C7C5B",
    descriptor: "Interfaces that infer what you mean, not just what you click.",
  },
  {
    title: "Spatial depth",
    color: "#8BA896",
    descriptor: "Parallax, scene-like layouts, and depth beyond flat grids.",
  },
  {
    title: "Motion with weight",
    color: "#E67E22",
    descriptor: "Scroll, drag, and spring that feel tangible — not decorative.",
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
          <span className="font-bold text-[#2C2A29]">{beat.title}</span>
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
          Illustrative · not live data
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
          <linearGradient id="weave-strand-1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9C7C5B" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#9C7C5B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C4A882" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="weave-strand-2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8BA896" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#8BA896" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8BA896" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="weave-strand-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E67E22" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#E67E22" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#9C7C5B" stopOpacity="0.4" />
          </linearGradient>
          <filter id="weave-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="weave-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E67E22" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F9F7F3" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          className="weave-orbit-ring"
          cx="400"
          cy="250"
          rx="165"
          ry="115"
          fill="none"
          stroke="#D1CEC7"
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="6 10"
        />

        <circle cx="400" cy="250" r="120" fill="url(#weave-core-glow)" className="weave-core-pulse" />

        <g className="weave-strand-group weave-strand-group-1" filter="url(#weave-glow)">
          <path
            className="weave-thread weave-thread-1"
            pathLength="1"
            d="M 120 380 C 220 300, 320 220, 400 250 S 520 180, 680 140"
            fill="none"
            stroke="url(#weave-strand-1)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            opacity="0.75"
          />
        </g>
        <g className="weave-strand-group weave-strand-group-2" filter="url(#weave-glow)">
          <path
            className="weave-thread weave-thread-2"
            pathLength="1"
            d="M 680 360 C 560 300, 440 240, 400 250 S 200 160, 100 120"
            fill="none"
            stroke="url(#weave-strand-2)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            opacity="0.75"
          />
        </g>
        <g className="weave-strand-group weave-strand-group-3" filter="url(#weave-glow)">
          <path
            className="weave-thread weave-thread-3"
            pathLength="1"
            d="M 140 140 C 260 200, 340 230, 400 250 S 560 320, 660 380"
            fill="none"
            stroke="url(#weave-strand-3)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            opacity="0.7"
          />
        </g>

        <g className="weave-orbit weave-orbit-motion" opacity="0.85">
          <circle cx="565" cy="250" r="8" fill="#9C7C5B" opacity="0.5" />
          <circle cx="400" cy="135" r="7" fill="#8BA896" opacity="0.5" />
          <circle cx="235" cy="250" r="7" fill="#E67E22" opacity="0.5" />
        </g>

        <g className="weave-label weave-label-1" opacity="0">
          <circle cx="680" cy="140" r="5" fill="#9C7C5B" />
          <text x="680" y="118" textAnchor="end" className="weave-label-text" fill="#9C7C5B">
            Intent-driven UI
          </text>
        </g>
        <g className="weave-label weave-label-2" opacity="0">
          <circle cx="100" cy="120" r="5" fill="#8BA896" />
          <text x="100" y="98" textAnchor="start" className="weave-label-text" fill="#8BA896">
            Spatial depth
          </text>
        </g>
        <g className="weave-label weave-label-3" opacity="0">
          <circle cx="660" cy="380" r="5" fill="#E67E22" />
          <text x="660" y="408" textAnchor="end" className="weave-label-text" fill="#E67E22">
            Motion with weight
          </text>
        </g>

        <g className="weave-knot-pulse" opacity="0">
          <circle cx="400" cy="250" r="14" fill="#E67E22" opacity="0.15" />
          <circle cx="400" cy="250" r="6" fill="#9C7C5B" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
