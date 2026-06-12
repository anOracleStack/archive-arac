"use client";

import type { StrandItem, SilkCategory } from "@/types";

const CATEGORY_COLORS: Record<SilkCategory, string> = {
  webgl: "#8BA896",
  ai: "#E67E22",
  ux: "#9C7C5B",
};

type MapNode = {
  id: number;
  x: number;
  y: number;
  item: StrandItem;
};

interface ConnectionMapProps {
  tagEdges: [number, number][];
  mapPositions: MapNode[];
  mapHoverId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (item: StrandItem) => void;
}

export function ConnectionMap({
  tagEdges,
  mapPositions,
  mapHoverId,
  onHover,
  onSelect,
}: ConnectionMapProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-[#E8E5DF] bg-[#FDFCFA]/90 p-6 shadow-sm">
      <svg viewBox="0 0 100 100" className="w-full aspect-square max-h-[420px]" role="img" aria-label="Strand connection map by shared tags">
        {tagEdges.map(([a, b]) => {
          const pa = mapPositions.find((p) => p.id === a);
          const pb = mapPositions.find((p) => p.id === b);
          if (!pa || !pb) return null;
          const active =
            mapHoverId === null || mapHoverId === a || mapHoverId === b;
          return (
            <line
              key={`${a}-${b}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke="#E67E22"
              strokeOpacity={active ? 0.35 : 0.08}
              strokeWidth={0.35}
            />
          );
        })}
        {mapPositions.map((node) => (
          <g
            key={node.id}
            className="cursor-pointer"
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(node.item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(node.item);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={node.item.name}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={mapHoverId === node.id ? 3.2 : 2.6}
              fill={CATEGORY_COLORS[node.item.category]}
              stroke="#FDFCFA"
              strokeWidth={0.6}
            />
            <text
              x={node.x}
              y={node.y + 5.5}
              textAnchor="middle"
              className="fill-[#5A5653] text-[2.8px] font-semibold pointer-events-none"
            >
              {node.item.name.length > 14
                ? `${node.item.name.slice(0, 12)}…`
                : node.item.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
