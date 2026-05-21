import crypto from "crypto";

function secret(): string {
  return process.env.OAUTH_STATE_SECRET ?? process.env.VAULT_DATA_DIR ?? "dev-oauth-state";
}

export function signOAuthState(payload: { clientId: string; platform: string }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyOAuthState(state: string): { clientId: string; platform: string } | null {
  const [body, sig] = state.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  if (sig !== expected) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      clientId: string;
      platform: string;
    };
    if (!parsed.clientId || !parsed.platform) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function appOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL?.replace(/^/, "https://") ??
    "http://localhost:3000"
  );
}
