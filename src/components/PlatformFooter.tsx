"use client";

import Link from "next/link";

export function PlatformFooter() {
  return (
    <footer className="fixed bottom-0 z-40 w-full border-t-2 border-[#E67E22]/35 bg-[#F9F7F3]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-5 py-3 sm:gap-4 sm:px-8">
        <p className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5A5653] sm:text-[10px] sm:tracking-[0.16em]">
          <span className="hidden sm:inline">&copy; 2026 Archive Arac &middot; An Oracle Vision</span>
          <span className="sm:hidden">&copy; Archive Arac</span>
        </p>
        <p className="hidden min-w-0 flex-1 truncate text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5A5653] lg:block xl:text-[10px] xl:tracking-[0.16em]">
          Vanguard weaving for the next digital era
        </p>
        <nav
          className="flex shrink-0 items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-[#2C2A29] sm:gap-4 sm:text-[10px]"
          aria-label="Footer"
        >
          <a href="mailto:contact@oidib.io" className="transition-colors hover:text-[#E67E22]">
            Contact
          </a>
          <Link href="/privacy" className="transition-colors hover:text-[#E67E22]">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-[#E67E22]">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
