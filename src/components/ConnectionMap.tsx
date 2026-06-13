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

function isNodeConnected(nodeId: number, hoverId: number | null, edges: [number, number][]): boolean {
  if (hoverId === null) return true;
  if (nodeId === hoverId) return true;
  return edges.some(
    ([a, b]) =>
      (a === hoverId && b === nodeId) || (b === hoverId && a === nodeId)
  );
}

export function ConnectionMap({
  tagEdges,
  mapPositions,
  mapHoverId,
  onHover,
  onSelect,
}: ConnectionMapProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-[#E8E5DF] bg-[#FDFCFA]/90 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
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
              strokeOpacity={active ? 0.45 : 0.06}
              strokeWidth={active ? 0.5 : 0.25}
              className="transition-all duration-300 ease-out"
            />
          );
        })}
        {mapPositions.map((node) => {
          const hovered = mapHoverId === node.id;
          const connected = isNodeConnected(node.id, mapHoverId, tagEdges);
          const dimmed = mapHoverId !== null && !connected;

          return (
            <g
              key={node.id}
              className={`cursor-pointer transition-opacity duration-300 ${dimmed ? "opacity-30" : "opacity-100"}`}
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
              {hovered && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={5}
                  fill="none"
                  stroke="#E67E22"
                  strokeOpacity={0.25}
                  strokeWidth={0.4}
                  className="animate-pulse"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={hovered ? 3.4 : 2.6}
                fill={CATEGORY_COLORS[node.item.category]}
                stroke="#FDFCFA"
                strokeWidth={hovered ? 0.8 : 0.6}
                className="transition-all duration-200 ease-out"
              />
              <text
                x={node.x}
                y={node.y + 5.5}
                textAnchor="middle"
                className={`fill-[#5A5653] text-[2.8px] font-semibold pointer-events-none transition-all duration-200 ${
                  hovered ? "fill-[#2C2A29]" : ""
                }`}
              >
                {node.item.name.length > 14
                  ? `${node.item.name.slice(0, 12)}…`
                  : node.item.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
