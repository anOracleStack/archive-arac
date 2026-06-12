/** Redact emails, phone numbers, and credential-like strings before LLM context. */
const EMAIL_RE = /\b[\w.+-]+@[\w.-]+\.\w+\b/gi;
const PHONE_RE =
  /\b(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const SECRET_RE = /(api[_-]?key|secret|token)\s*[:=]\s*\S+/gi;

export function scrubPii(text: string): string {
  return text
    .replace(EMAIL_RE, "[email redacted]")
    .replace(PHONE_RE, "[phone redacted]")
    .replace(SECRET_RE, "[credential redacted]");
}

export function scrubMessages<T extends { role: string; content: string }>(
  messages: T[]
): T[] {
  return messages.map((m) =>
    m.role === "user" ? { ...m, content: scrubPii(m.content) } : m
  );
}
