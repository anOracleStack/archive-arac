import path from "path";
import fs from "fs";

export function getVaultDataRoot(): string {
  const root = process.env.VAULT_DATA_DIR ?? path.join(process.cwd(), "data", "vault");
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
  return root;
}

export function clientVaultDir(clientId: string): string {
  const safe = clientId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  const dir = path.join(getVaultDataRoot(), safe);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonFile(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}
