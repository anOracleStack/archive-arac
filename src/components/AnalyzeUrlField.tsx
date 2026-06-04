"use client";

import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  compact?: boolean;
};

export function AnalyzeUrlField({
  value,
  onChange,
  placeholder = "stripe.com or www.example.com",
  disabled = false,
  id,
  compact = false,
}: Props) {
  return (
    <div className="relative flex-1 min-w-0">
      <svg
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5653] ${
          compact ? "w-4 h-4" : "w-5 h-5"
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onChange(tryNormalizeCanonicalUrl(value))}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 rounded-2xl border border-[#D1CEC7] bg-[#F9F7F3] text-[#2C2A29] outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/10 transition-all disabled:opacity-50 ${
          compact ? "py-3 text-sm" : "py-4 text-sm"
        }`}
        disabled={disabled}
        aria-label="Website URL to analyze"
      />
    </div>
  );
}
