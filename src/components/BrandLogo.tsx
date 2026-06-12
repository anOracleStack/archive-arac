"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LOGO_GAP = "0.625rem";

export function BrandLogo() {
  const brandRowRef = useRef<HTMLDivElement>(null);
  const [taglineWidth, setTaglineWidth] = useState<number | undefined>();

  useEffect(() => {
    const el = brandRowRef.current;
    if (!el) return;

    const update = () => setTaglineWidth(el.offsetWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link href="/" className="group shrink-0 min-w-0">
      <div className="inline-flex flex-col items-start">
        <span
          className="mb-0.5 block text-[10px] font-bold uppercase leading-none text-[#9C7C5B] whitespace-nowrap"
          style={{
            width: taglineWidth ? `${taglineWidth}px` : undefined,
            letterSpacing: taglineWidth ? "0.22em" : undefined,
          }}
        >
          an Oracle Vision
        </span>
        <div
          ref={brandRowRef}
          className="flex items-center font-bold text-base sm:text-lg tracking-tight"
          style={{ gap: LOGO_GAP }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E67E22"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 transition-transform duration-500 group-hover:rotate-45"
            aria-hidden="true"
          >
            <path d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13" />
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="9" />
          </svg>
          <span>ARCHIVE</span>
          <span>ARAC</span>
        </div>
      </div>
    </Link>
  );
}
