/** Target character width for visually even centered lines. */
const DEFAULT_TARGET = 42;

/**
 * Replace " and " with " & " (user-facing copy convention).
 */
export function replaceAndWithAmpersand(text: string): string {
  return text.replace(/\s+and\s+/gi, " & ");
}

/**
 * Move "&" to its own line after a comma (never end a line with ", &").
 */
export function splitAmpersandLines(text: string): string {
  let t = replaceAndWithAmpersand(text);
  t = t.replace(/,\s*&\s*/g, ",\n& ");
  t = t.replace(/(?<!,\n)\s+&\s+/g, "\n& ");
  return t;
}

function wrapWords(text: string, targetLen: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (word.startsWith("&") && current) {
      lines.push(current);
      current = word;
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= targetLen) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Turn prose into center-aligned balanced lines: & convention + even-ish widths.
 */
export function proseToBalancedLines(
  text: string,
  targetLen = DEFAULT_TARGET
): string[] {
  const normalized = splitAmpersandLines(text);
  const chunks = normalized.split("\n").map((c) => c.trim()).filter(Boolean);
  const lines: string[] = [];

  for (const chunk of chunks) {
    if (chunk.startsWith("&") && lines.length > 0) {
      lines.push(chunk);
      continue;
    }
    lines.push(...wrapWords(chunk, targetLen));
  }

  return lines.length ? lines : [text];
}
