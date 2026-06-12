"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const navGroups = [
  {
    label: "Discover",
    links: [
      { href: "/#weave", label: "Weave trends", match: (p: string) => p === "/" },
      { href: "/#index", label: "Index", match: (p: string) => p === "/" },
    ],
  },
  {
    label: "Analyze",
    links: [
      { href: "/analyze", label: "Silk Analyzer" },
      { href: "/collections", label: "Collections" },
    ],
  },
  {
    label: "Build",
    links: [
      { href: "/studio/weave", label: "Weave — site brief" },
      { href: "/studio", label: "Studio" },
      { href: "/compose", label: "Strand Composer" },
    ],
  },
  {
    label: "Brand",
    links: [
      { href: "/identity", label: "Identity Lock" },
      { href: "/vault", label: "Vault" },
      { href: "/mission", label: "Mission" },
    ],
  },
] as const;

function NavDropdown({
  label,
  links,
  pathname,
}: {
  label: string;
  links: readonly { href: string; label: string; match?: (p: string) => boolean }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const groupActive = links.some((l) =>
    l.match ? l.match(pathname) : pathname === l.href || pathname.startsWith(`${l.href}/`)
  );

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 uppercase tracking-widest transition-colors ${
          groupActive ? "text-[#E67E22]" : "text-[#5A5653] hover:text-[#E67E22]"
        }`}
        aria-expanded={open}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-[200px] rounded-2xl border border-[#E8E5DF] bg-[#FDFCFA] py-2 shadow-xl z-50">
          {links.map((link) => {
            const isActive =
              "match" in link && link.match
                ? link.match(pathname)
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            const isHash = link.href.includes("#");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 text-[11px] font-bold transition-colors ${
                  isActive
                    ? "text-[#E67E22] bg-[#E67E22]/5"
                    : "text-[#2C2A29] hover:text-[#E67E22] hover:bg-[#F9F7F3]"
                }`}
                aria-current={isActive && !isHash ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
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

  let drawerLinkIndex = 0;

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-[#F9F7F3]/90 backdrop-blur-md border-b border-[#C4A882]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-3">
          <Link href="/" className="flex flex-col items-start gap-0 group shrink-0">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#9C7C5B] uppercase leading-none mb-0.5">
              an Oracle Vision
            </span>
            <span className="font-bold text-lg sm:text-xl tracking-tighter flex items-center gap-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E67E22"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:rotate-45 transition-transform duration-500 shrink-0"
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

          <div className="hidden md:flex items-center gap-5 text-[10px] font-bold">
            {navGroups.map((group) => (
              <NavDropdown key={group.label} label={group.label} links={group.links} pathname={pathname} />
            ))}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden shrink-0 p-2 -mr-2 rounded-lg text-[#2C2A29] hover:bg-[#E8E5DF]/80 transition-colors"
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
          className="fixed inset-0 z-40 bg-[#2C2A29]/40 md:hidden"
          aria-label="Close menu"
          onClick={closeDrawer}
        />
      )}

      <div
        id={drawerId}
        ref={drawerRef}
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-[320px] bg-[#F9F7F3] border-l border-[#C4A882]/40 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">
          {navGroups.map((group) => (
            <section key={group.label} className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-3">
                {group.label}
              </p>
              <div className="flex flex-col gap-3">
                {group.links.map((link) => {
                  const isActive =
                    "match" in link && link.match
                      ? link.match(pathname)
                      : pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const assignRef = drawerLinkIndex++ === 0 ? firstFocusRef : undefined;
                  return (
                    <Link
                      key={link.href}
                      ref={assignRef}
                      href={link.href}
                      className={`text-sm font-bold transition-colors ${
                        isActive
                          ? "text-[#E67E22] underline underline-offset-4"
                          : "text-[#2C2A29] hover:text-[#E67E22]"
                      }`}
                      aria-current={isActive && !link.href.includes("#") ? "page" : undefined}
                      onClick={closeDrawer}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}

          <p className="text-[10px] text-[#5A5653] leading-relaxed border-t border-[#D1CEC7]/60 pt-4 mt-auto">
            Weave trends are illustrative · not live analytics
          </p>
        </div>
      </div>
    </>
  );
}
