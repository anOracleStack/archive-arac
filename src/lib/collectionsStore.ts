const COLLECTIONS_KEY = "archive-arac:collections";

export interface SilkCollection {
  id: string;
  name: string;
  description: string;
  urls: string[];
  createdAt: string;
  updatedAt: string;
}

function read(): SilkCollection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SilkCollection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: SilkCollection[]) {
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(items));
}

export function listCollections(): SilkCollection[] {
  return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getCollection(id: string): SilkCollection | null {
  return read().find((c) => c.id === id) ?? null;
}

export function createCollection(name: string, description = ""): SilkCollection {
  const now = new Date().toISOString();
  const item: SilkCollection = {
    id: crypto.randomUUID(),
    name: name.trim() || "Untitled collection",
    description: description.trim(),
    urls: [],
    createdAt: now,
    updatedAt: now,
  };
  write([item, ...read()]);
  return item;
}

export function updateCollection(id: string, patch: Partial<Pick<SilkCollection, "name" | "description" | "urls">>) {
  const next = read().map((c) =>
    c.id === id
      ? { ...c, ...patch, updatedAt: new Date().toISOString() }
      : c
  );
  write(next);
}

export function deleteCollection(id: string) {
  write(read().filter((c) => c.id !== id));
}

export function addUrlToCollection(id: string, url: string) {
  const col = getCollection(id);
  if (!col) return;
  const trimmed = url.trim();
  if (!trimmed || col.urls.includes(trimmed)) return;
  updateCollection(id, { urls: [...col.urls, trimmed] });
}

export function removeUrlFromCollection(id: string, url: string) {
  const col = getCollection(id);
  if (!col) return;
  updateCollection(id, { urls: col.urls.filter((u) => u !== url) });
}
