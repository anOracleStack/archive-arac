import fs from "fs";
import { get, put } from "@vercel/blob";
import {
  clientVaultDir,
  readJsonFile,
  writeJsonFile,
} from "@/lib/server/dataPaths";

export function safeClientId(clientId: string): string {
  return clientId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}

/** True when Vercel Blob is configured (OIDC on Vercel or BLOB_READ_WRITE_TOKEN). */
export function vaultUsesBlob(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)
  );
}

function blobPathname(clientId: string, filename: string): string {
  return `vault/${safeClientId(clientId)}/${filename}`;
}

function fsPath(clientId: string, filename: string): string {
  return `${clientVaultDir(clientId)}/${filename}`;
}

export async function readVaultJson<T>(
  clientId: string,
  filename: string,
  fallback: T
): Promise<T> {
  if (vaultUsesBlob()) {
    try {
      const pathname = blobPathname(clientId, filename);
      const result = await get(pathname, { access: "private" });
      if (!result?.stream) return fallback;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as T;
    } catch {
      return fallback;
    }
  }

  return readJsonFile(fsPath(clientId, filename), fallback);
}

export async function writeVaultJson(
  clientId: string,
  filename: string,
  data: unknown
): Promise<void> {
  const payload = JSON.stringify(data, null, 2);

  if (vaultUsesBlob()) {
    await put(blobPathname(clientId, filename), payload, {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  writeJsonFile(fsPath(clientId, filename), data);
}

export async function vaultJsonExists(
  clientId: string,
  filename: string
): Promise<boolean> {
  if (vaultUsesBlob()) {
    try {
      const result = await get(blobPathname(clientId, filename), {
        access: "private",
      });
      return Boolean(result?.stream);
    } catch {
      return false;
    }
  }
  return fs.existsSync(fsPath(clientId, filename));
}
