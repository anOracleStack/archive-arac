"use client";

import { useEffect, useState } from "react";

interface CopyToastProps {
  message: string | null;
  onClear: () => void;
}

/** Premium cream/ink toast for clipboard confirmations. */
export function CopyToast({ message, onClear }: CopyToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onClear, 300);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-2xl border border-[#C4A882]/40 bg-[#2C2A29] px-5 py-3 shadow-xl">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8BA896]/20 text-[#8BA896]">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span className="text-xs font-semibold tracking-wide text-[#F9F7F3]">{message}</span>
      </div>
    </div>
  );
}
