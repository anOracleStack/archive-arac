"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Base delay in ms between each staggered child */
  staggerMs?: number;
  /** Which index this child is in the stagger group */
  index?: number;
  /** Custom threshold (default 0.1) */
  threshold?: number;
  /** Apply to each direct child instead of wrapping one element */
  cascade?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  staggerMs = 120,
  index = 0,
  threshold = 0.08,
  cascade = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = index * staggerMs;
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerMs, index, threshold]);

  if (cascade) {
    return (
      <div ref={ref} className={className}>
        {visible ? children : null}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform will-change-opacity will-change-filter ${
        visible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-8 blur-[3px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Convenience: wrap children in a stagger-aware container.
 *  Each child gets its own ScrollReveal with incremental index. */
export function StaggerGrid({
  children,
  className = "",
  staggerMs = 100,
  threshold = 0.05,
}: {
  children: ReactNode | ReactNode[];
  className?: string;
  staggerMs?: number;
  threshold?: number;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className={className}>
      {items.map((child, i) => (
        <ScrollReveal key={i} index={i} staggerMs={staggerMs} threshold={threshold}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
