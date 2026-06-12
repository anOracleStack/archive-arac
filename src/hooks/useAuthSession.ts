"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearAuthSession,
  createMockUser,
  readAuthSession,
  writeAuthSession,
  type AuthUser,
} from "@/lib/authSession";

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(readAuthSession());
    setReady(true);

    const sync = () => setUser(readAuthSession());
    window.addEventListener("auth-session-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-session-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback((name: string, email: string) => {
    const next = createMockUser(name, email);
    writeAuthSession(next);
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
  }, []);

  return { user, ready, isLoggedIn: !!user, login, logout };
}
