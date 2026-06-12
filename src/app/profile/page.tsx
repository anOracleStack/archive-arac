"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PlatformShell } from "@/components/PlatformShell";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, isLoggedIn, logout } = useAuthSession();

  useEffect(() => {
    if (ready && !isLoggedIn) router.replace("/login");
  }, [ready, isLoggedIn, router]);

  if (!user) {
    return (
      <PlatformShell>
        <div className="relative z-10 px-6 py-16 text-center text-sm text-[#5A5653]">Loading profile…</div>
      </PlatformShell>
    );
  }

  return (
    <PlatformShell>
      <section className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#C4A882]/60 bg-[#E67E22]/10 text-lg font-bold text-[#2C2A29]">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <h1 className="mb-1 text-2xl font-bold uppercase tracking-tight text-[#2C2A29]">Profile</h1>
        <p className="mb-1 text-sm font-semibold text-[#2C2A29]">{user.name}</p>
        <p className="mb-8 text-sm text-[#5A5653]">{user.email}</p>

        <div className="flex w-full flex-col gap-3">
          <Link
            href="/vault"
            className="rounded-full border border-[#C4A882]/60 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#2C2A29] transition-colors hover:border-[#E67E22] hover:text-[#E67E22]"
          >
            Open Archive
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-full bg-[#2C2A29] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#E67E22]"
          >
            Log out
          </button>
        </div>
      </section>
    </PlatformShell>
  );
}
