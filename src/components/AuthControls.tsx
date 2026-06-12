"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function AuthControls({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { user, ready, isLoggedIn, logout } = useAuthSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!ready) {
    return <div className="h-8 w-16 shrink-0" aria-hidden />;
  }

  if (!isLoggedIn || !user) {
    return (
      <Link
        href="/login"
        className={`shrink-0 rounded-full border border-[#C4A882]/60 bg-white/80 font-bold uppercase tracking-widest text-[#2C2A29] transition-colors hover:border-[#E67E22] hover:text-[#E67E22] ${
          compact ? "px-3 py-1.5 text-[9px]" : "px-4 py-2 text-[10px]"
        }`}
      >
        Login
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C4A882]/60 bg-[#E67E22]/10 text-[11px] font-bold text-[#2C2A29] transition-colors hover:border-[#E67E22] hover:bg-[#E67E22]/20"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initials(user.name)}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-2xl border border-[#E8E5DF] bg-[#FDFCFA] py-2 shadow-xl">
          <p className="px-4 py-2 text-[10px] font-bold text-[#5A5653] truncate">{user.name}</p>
          <Link
            href="/profile"
            className="block px-4 py-2.5 text-[11px] font-bold text-[#2C2A29] transition-colors hover:bg-[#F9F7F3] hover:text-[#E67E22]"
          >
            Profile
          </Link>
          <Link
            href="/vault"
            className="block px-4 py-2.5 text-[11px] font-bold text-[#2C2A29] transition-colors hover:bg-[#F9F7F3] hover:text-[#E67E22]"
          >
            Archive
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="block w-full px-4 py-2.5 text-left text-[11px] font-bold text-[#5A5653] transition-colors hover:bg-[#F9F7F3] hover:text-[#E67E22]"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
