import { BalancedText } from "@/components/BalancedText";

type LoreTermProps = {
  /** Brand / lore label (headline or badge) */
  term: string;
  /** Plain-English one-liner — what it means for a regular person */
  plain: string | string[];
  className?: string;
  /** Page hero badge vs compact inline stack */
  variant?: "badge" | "stack";
  /** Light cream sections vs dark ink panels */
  tone?: "light" | "dark";
};

/** Lore term as headline/badge + one plain-English line underneath. */
export function LoreTerm({
  term,
  plain,
  className = "",
  variant = "badge",
  tone = "light",
}: LoreTermProps) {
  const plainLines = Array.isArray(plain) ? plain : [plain];
  const termClass =
    tone === "dark"
      ? "text-3xl font-bold tracking-tight text-[#F9F7F3]"
      : variant === "stack"
        ? "text-sm font-bold text-[#2C2A29]"
        : "";
  const plainClass =
    tone === "dark" ? "text-[#E8E5DF]/90 text-base" : "text-xs text-[#5A5653]";

  if (variant === "stack") {
    return (
      <div className={`text-center ${className}`}>
        <p className={`${termClass} ${tone === "light" ? "text-sm font-bold text-[#2C2A29]" : ""}`}>
          {term}
        </p>
        <BalancedText
          className={`${plainClass} mt-2 leading-relaxed`}
          lines={plainLines}
        />
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
        {term}
      </div>
      <BalancedText
        className="text-sm text-[#5A5653] mt-3 max-w-md mx-auto"
        lines={plainLines}
      />
    </div>
  );
}
