import { BalancedText } from "@/components/BalancedText";

/** Shared body copy scale for hero badge, tagline, & subtext */
export const HERO_SUPPORT_COPY_SIZE = "text-lg md:text-xl leading-relaxed";
export const HERO_SUPPORT_COPY = `${HERO_SUPPORT_COPY_SIZE} text-[#5A5653] font-light`;

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
  /** Hero home badge uses support-copy scale; default keeps compact pill */
  size?: "default" | "hero";
};

/** Lore term as headline/badge + one plain-English line underneath. */
export function LoreTerm({
  term,
  plain,
  className = "",
  variant = "badge",
  tone = "light",
  size = "default",
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

  const badgeClass =
    size === "hero"
      ? `inline-flex items-center px-5 py-2 rounded-full border border-[#C4A882]/40 text-[#6B543C] font-bold bg-[#C4A882]/10 ${HERO_SUPPORT_COPY_SIZE}`
      : "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10";

  return (
    <div className={`text-center ${className}`}>
      <div className={badgeClass}>{term}</div>
      <BalancedText
        className={`${size === "hero" ? HERO_SUPPORT_COPY : "text-sm text-[#5A5653]"} mt-3 max-w-2xl mx-auto`}
        lines={plainLines}
      />
    </div>
  );
}
