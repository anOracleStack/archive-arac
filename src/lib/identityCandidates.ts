const TLD_PRIORITY = [".com", ".io", ".ai", ".co", ".app", ".dev", ".net", ".org"];

const SUFFIXES = ["hq", "labs", "studio", "co", "app", "io", "hub", "works", "group"];
const PREFIXES = ["get", "try", "use", "go", "meet", "hello", "the"];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

function tokenize(brand: string, keywords?: string): string[] {
  const parts = [
    ...brand.split(/\s+/),
    ...(keywords?.split(/[,\s]+/) ?? []),
  ]
    .map((p) => slugify(p))
    .filter((p) => p.length >= 2);
  return [...new Set(parts)];
}

/** Build a diverse set of brand slugs up to `limit` candidates. */
export function generateCandidateSlugs(
  brandName: string,
  keywords: string | undefined,
  limit: number
): { slug: string; label: string }[] {
  const tokens = tokenize(brandName, keywords);
  const base = slugify(brandName) || tokens[0] || "brand";
  const joined = tokens.join("");
  const seen = new Set<string>();
  const out: { slug: string; label: string }[] = [];

  const push = (slug: string, label: string) => {
    const s = slugify(slug);
    if (!s || s.length < 2 || seen.has(s)) return;
    seen.add(s);
    out.push({ slug: s, label });
  };

  push(base, brandName.trim());
  if (joined && joined !== base) push(joined, tokens.join(" "));
  if (tokens.length >= 2) {
    push(tokens[0] + tokens[1], `${tokens[0]} ${tokens[1]}`);
    push(tokens[0] + tokens[tokens.length - 1], `${tokens[0]} · ${tokens[tokens.length - 1]}`);
  }

  for (const t of tokens) {
    push(t, t);
    push(t + "app", `${t} app`);
    push(t + "hq", `${t} HQ`);
  }

  for (const pre of PREFIXES) {
    push(pre + base, `${pre}${base}`);
    if (joined) push(pre + joined, `${pre}${joined}`);
  }

  for (const suf of SUFFIXES) {
    push(base + suf, `${brandName} ${suf}`);
    if (tokens[0]) push(tokens[0] + suf, `${tokens[0]} ${suf}`);
  }

  for (let i = 0; i < 8 && out.length < limit; i++) {
    push(base + String(i + 1), `${brandName} ${i + 1}`);
    if (tokens[0]) push(tokens[0] + String(i + 2), `${tokens[0]} ${i + 2}`);
  }

  if (tokens.length >= 2) {
    for (let i = 0; i < tokens.length - 1 && out.length < limit; i++) {
      const hybrid = tokens[i].slice(0, 4) + tokens[i + 1].slice(0, 6);
      push(hybrid, `${tokens[i]}-${tokens[i + 1]}`);
    }
  }

  let salt = 0;
  while (out.length < limit && salt < 200) {
    const variant = base.slice(0, 10) + ["x", "z", "ly", "ify", "able"][salt % 5] + String(salt % 9);
    push(variant, variant);
    salt++;
  }

  return out.slice(0, limit);
}

export function getTldsForScan(requested?: string[]): string[] {
  if (requested?.length) {
    return requested.map((t) => (t.startsWith(".") ? t : `.${t}`));
  }
  return TLD_PRIORITY;
}
