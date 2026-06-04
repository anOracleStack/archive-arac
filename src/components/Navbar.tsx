"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const homeSections = [
  { href: "/#weave", label: "Weave" },
  { href: "/#index", label: "Index" },
];

const platformLinks = [
  { href: "/identity", label: "Identity Lock" },
  { href: "/studio", label: "Studio" },
  { href: "/analyze", label: "Silk Analyzer" },
  { href: "/compose", label: "Strand Composer" },
  { href: "/collections", label: "Collections" },
  { href: "/vault", label: "Vault" },
  { href: "/mission", label: "Mission" },
];

function linkClass(isActive: boolean, variant: "home" | "platform") {
  const base =
    variant === "home"
      ? "text-[#5A5653] hover:text-[#E67E22]"
      : "text-[#2C2A29] hover:text-[#E67E22]";
  const active = isActive ? " text-[#E67E22] underline underline-offset-4 decoration-[#E67E22]/60" : "";
  return `${base} transition-colors${active}`;
}

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLAnchorElement>(null);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const isPlatformActive = (href: string) => pathname === href;

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    firstFocusRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <>
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
                aria-hidden="true"
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
              <Link key={link.href} href={link.href} className={linkClass(false, "home")}>
                {link.label}
              </Link>
            ))}
            <span className="w-px h-4 bg-[#D1CEC7]" aria-hidden="true" />
            {platformLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(isPlatformActive(link.href), "platform")}
                aria-current={isPlatformActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="lg:hidden shrink-0 p-2 -mr-2 rounded-lg text-[#2C2A29] hover:bg-[#E8E5DF]/80 transition-colors"
            aria-expanded={drawerOpen}
            aria-controls={drawerId}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {drawerOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {drawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#2C2A29]/40 lg:hidden"
          aria-label="Close menu"
          onClick={closeDrawer}
        />
      )}

      <div
        id={drawerId}
        ref={drawerRef}
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-[320px] bg-[#F9F7F3] border-l border-[#C4A882]/40 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">
          <section className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-3">
              On the home page
            </p>
            <div className="flex flex-col gap-3">
              {homeSections.map((link, i) => (
                <Link
                  key={link.href}
                  ref={i === 0 ? firstFocusRef : undefined}
                  href={link.href}
                  className="text-sm font-bold text-[#5A5653] hover:text-[#E67E22] transition-colors"
                  onClick={closeDrawer}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-8 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-3">
              Platform
            </p>
            <div className="flex flex-col gap-3">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold transition-colors ${
                    isPlatformActive(link.href)
                      ? "text-[#E67E22] underline underline-offset-4"
                      : "text-[#2C2A29] hover:text-[#E67E22]"
                  }`}
                  aria-current={isPlatformActive(link.href) ? "page" : undefined}
                  onClick={closeDrawer}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          <p className="text-[10px] text-[#5A5653] leading-relaxed border-t border-[#D1CEC7]/60 pt-4">
            Illustrative trends on home · not live analytics
          </p>
        </div>
      </div>
    </>
  );
}
