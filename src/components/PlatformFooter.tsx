"use client";

import Link from "next/link";
import { AuthControls } from "@/components/AuthControls";
import { useAuthSession } from "@/hooks/useAuthSession";

export function PlatformFooter() {
  const { isLoggedIn } = useAuthSession();

  return (
    <footer className="fixed bottom-0 z-40 w-full border-t-2 border-[#E67E22]/35 bg-[#F9F7F3]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 py-3">
        <p className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5A5653] sm:text-[10px] sm:tracking-[0.16em]">
          Vanguard weaving for the next digital era
        </p>
        <nav
          className="flex shrink-0 items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-[#2C2A29] sm:gap-4 sm:text-[10px]"
          aria-label="Footer"
        >
          <Link href="/privacy" className="transition-colors hover:text-[#E67E22]">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-[#E67E22]">
            Terms
          </Link>
          {!isLoggedIn && (
            <Link href="/login" className="transition-colors hover:text-[#E67E22]">
              Login
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
