import Link from "next/link";

const platformLinks = [
  { href: "/identity", label: "Identity Lock" },
  { href: "/studio", label: "Studio" },
  { href: "/analyze", label: "Silk Analyzer" },
  { href: "/compose", label: "Strand Composer" },
  { href: "/collections", label: "Collections" },
  { href: "/vault", label: "Vault" },
  { href: "/mission", label: "Mission" },
];

const homeSections = [
  { href: "/#weave", label: "Weave" },
  { href: "/#index", label: "Index" },
];

export function PlatformFooter() {
  return (
    <footer className="relative z-10 border-t border-[#C4A882]/30 bg-[#F9F7F3] px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-2">
              Platform
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-[#2C2A29]"
              aria-label="Platform navigation"
            >
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#E67E22] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-2">
              Home
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-[#5A5653]"
              aria-label="Home sections"
            >
              {homeSections.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#E67E22] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <p className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#5A5653]">
          &copy; 2026 Index Araneae &mdash; No Threads Left Unspun
        </p>
      </div>
    </footer>
  );
}
