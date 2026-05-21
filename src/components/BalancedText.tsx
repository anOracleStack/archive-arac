import { Fragment, type ReactNode } from "react";
import { proseToBalancedLines } from "@/lib/balancedCopy";

type BalancedTextProps = {
  /** Each entry is one visual line — keep lengths similar; put "&" at the start of a line, not after "," on the prior line. */
  lines?: ReactNode[];
  /** Auto-balance a prose string (applies & + line-length rules). */
  text?: string;
  balanceWidth?: number;
  className?: string;
  as?: "p" | "div";
};

/**
 * Center-aligned copy block with balanced line lengths.
 */
export function BalancedText({
  lines,
  text,
  balanceWidth,
  className = "",
  as: Tag = "p",
}: BalancedTextProps) {
  const resolved =
    lines ??
    (text
      ? proseToBalancedLines(text, balanceWidth).map((line) => line)
      : []);

  if (!resolved.length) return null;

  return (
    <Tag className={`copy-balanced ${className}`.trim()}>
      {resolved.map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          <span className="copy-balanced-line">{line}</span>
        </Fragment>
      ))}
    </Tag>
  );
}
