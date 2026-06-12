export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

const SESSION_KEY = "archive-arac:auth-session";

export function readAuthSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAuthSession(user: AuthUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-session-changed"));
}

export function clearAuthSession(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("auth-session-changed"));
}

export function createMockUser(name: string, email: string): AuthUser {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || "Archive Member",
    email: email.trim() || "member@archive-arac.local",
  };
}
