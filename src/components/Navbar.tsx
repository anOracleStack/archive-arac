"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AuthControls } from "@/components/AuthControls";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuthSession } from "@/hooks/useAuthSession";

const navGroups = [
  {
    label: "Discover",
    links: [
      { href: "/#weave", label: "Weave trends", plain: "Illustrated web trends — not live data", match: (p: string) => p === "/" },
      { href: "/#index", label: "Site library", plain: "Example sites to study by silk type", match: (p: string) => p === "/" },
    ],
  },
  {
    label: "Analyze",
    links: [
      { href: "/analyze", label: "Silk Analyzer", plain: "Paste a URL — see how it's built" },
      { href: "/collections", label: "Collections", plain: "Saved URL lists for batch scans" },
    ],
  },
  {
    label: "Build",
    links: [
      { href: "/studio/weave", label: "Weave", plain: "Describe the site you want" },
      { href: "/studio", label: "Studio", plain: "Hosting, connect & launch tools" },
      { href: "/compose", label: "Strand Composer", plain: "Pick examples & export code" },
    ],
  },
  {
    label: "Brand",
    links: [
      { href: "/identity", label: "Identity Lock", plain: "Claim domains & social handles" },
      { href: "/vault", label: "Vault", plain: "Everything you save — one drawer" },
      { href: "/mission", label: "Mission", plain: "How the product fits together" },
    ],
  },
] as const;

function NavDropdown({
  label,
  links,
  pathname,
}: {
  label: string;
  links: readonly {
    href: string;
    label: string;
    plain?: string;
    match?: (p: string) => boolean;
  }[];
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
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 uppercase tracking-[0.18em] transition-colors whitespace-nowrap ${
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
        <div className="absolute left-0 top-full mt-2 min-w-[240px] rounded-2xl border border-[#E8E5DF] bg-[#FDFCFA] py-2 shadow-xl z-50">
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
                className={`block px-4 py-2.5 transition-colors ${
                  isActive
                    ? "text-[#E67E22] bg-[#E67E22]/5"
                    : "text-[#2C2A29] hover:text-[#E67E22] hover:bg-[#F9F7F3]"
                }`}
                aria-current={isActive && !isHash ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="block text-[11px] font-bold">{link.label}</span>
                {link.plain && (
                  <span className="block text-[10px] font-normal text-[#5A5653] mt-0.5 leading-snug">
                    {link.plain}
                  </span>
                )}
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
  const { isLoggedIn } = useAuthSession();
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
      <nav className="fixed top-0 w-full z-40 bg-[#F9F7F3]/95 backdrop-blur-md border-b-2 border-[#E67E22]/35">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 py-3">
          <BrandLogo />

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 lg:gap-4 lg:flex">
            <div className="flex min-w-0 items-center gap-3 lg:gap-4 text-[9px] font-bold xl:text-[10px]">
              {navGroups.map((group) => (
                <NavDropdown key={group.label} label={group.label} links={group.links} pathname={pathname} />
              ))}
              {isLoggedIn && (
                <Link
                  href="/profile"
                  className={`shrink-0 uppercase tracking-[0.18em] transition-colors whitespace-nowrap ${
                    pathname === "/profile"
                      ? "text-[#E67E22]"
                      : "text-[#5A5653] hover:text-[#E67E22]"
                  }`}
                >
                  Profile
                </Link>
              )}
            </div>
            <AuthControls />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <AuthControls compact />
            <button
              ref={menuButtonRef}
              type="button"
              className="shrink-0 rounded-lg p-2 text-[#2C2A29] transition-colors hover:bg-[#E8E5DF]/80"
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
                      className={`transition-colors ${
                        isActive
                          ? "text-[#E67E22] underline underline-offset-4"
                          : "text-[#2C2A29] hover:text-[#E67E22]"
                      }`}
                      aria-current={isActive && !link.href.includes("#") ? "page" : undefined}
                      onClick={closeDrawer}
                    >
                      <span className="block text-sm font-bold">{link.label}</span>
                      {"plain" in link && link.plain && (
                        <span className="block text-xs font-normal text-[#5A5653] mt-0.5">
                          {link.plain}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}

          {isLoggedIn && (
            <section className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9C7C5B] mb-3">
                Account
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/profile" className="text-sm font-bold text-[#2C2A29] hover:text-[#E67E22]" onClick={closeDrawer}>
                  Profile
                </Link>
                <Link href="/vault" className="text-sm font-bold text-[#2C2A29] hover:text-[#E67E22]" onClick={closeDrawer}>
                  Archive
                </Link>
              </div>
            </section>
          )}

          <p className="text-[10px] text-[#5A5653] leading-relaxed border-t border-[#D1CEC7]/60 pt-4 mt-auto">
            Weave trends are illustrative · not live analytics
          </p>
        </div>
      </div>
    </>
  );
}
