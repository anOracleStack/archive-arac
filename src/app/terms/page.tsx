import Link from "next/link";
import { PlatformShell } from "@/components/PlatformShell";

export default function TermsPage() {
  return (
    <PlatformShell>
      <section className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold uppercase tracking-tight text-[#2C2A29]">Terms</h1>
        <p className="copy-balanced text-sm leading-relaxed text-[#5A5653]">
          This placeholder page will outline the terms of use for Archive Arac and its platform tools.
        </p>
        <Link href="/" className="mt-8 inline-block text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline">
          Back home
        </Link>
      </section>
    </PlatformShell>
  );
}
