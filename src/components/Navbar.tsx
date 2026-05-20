"use client";

import Link from "next/link";

const homeSections = [
  { href: "/#weave", label: "Weave" },
  { href: "/#index", label: "Index" },
  { href: "/#analyzer", label: "Analyzer" },
];

const platformLinks = [
  { href: "/compose", label: "Compose" },
  { href: "/collections", label: "Collections" },
  { href: "/vault", label: "Vault" },
  { href: "/mission", label: "Mission" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-40 bg-[#F9F7F3]/90 backdrop-blur-md border-b border-[#C4A882]/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex flex-col items-start gap-0 group shrink-0">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#9C7C5B] uppercase leading-none mb-0.5">
            an Oracle Vision
          </span>
          <span className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E67E22"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-45 transition-transform duration-500"
            >
              <path d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13" />
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            ARCHIVE ARAC
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          {homeSections.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#5A5653] hover:text-[#E67E22] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <span className="w-px h-4 bg-[#D1CEC7]" />
          {platformLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#2C2A29] hover:text-[#E67E22] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/mission"
          className="lg:hidden shrink-0 px-3 py-1.5 rounded-lg bg-[#E67E22]/10 text-[#E67E22] text-[10px] font-bold uppercase tracking-widest"
        >
          Mission
        </Link>
      </div>
    </nav>
  );
}
