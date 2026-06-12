"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PlatformShell } from "@/components/PlatformShell";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, ready } = useAuthSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (ready && isLoggedIn) router.replace("/profile");
  }, [ready, isLoggedIn, router]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(name, email);
    router.push("/profile");
  };

  return (
    <PlatformShell>
      <section className="relative z-10 mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-tight text-[#2C2A29]">Login</h1>
        <p className="mb-8 text-sm text-[#5A5653]">
          Sign in to access your profile and saved archive.
        </p>
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4 text-left">
          <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5A5653]">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl border border-[#E8E5DF] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2C2A29] outline-none focus:border-[#E67E22]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5A5653]">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-[#E8E5DF] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2C2A29] outline-none focus:border-[#E67E22]"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-[#E67E22] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#2C2A29]"
          >
            Sign in
          </button>
        </form>
        <p className="mt-6 text-[10px] text-[#5A5653]">
          Demo session only — stored locally until you log out.
        </p>
        <Link href="/" className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline">
          Back home
        </Link>
      </section>
    </PlatformShell>
  );
}
