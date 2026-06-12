import Link from "next/link";
import { PlatformShell } from "@/components/PlatformShell";

export default function PrivacyPage() {
  return (
    <PlatformShell>
      <section className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold uppercase tracking-tight text-[#2C2A29]">Privacy</h1>
        <p className="copy-balanced text-sm leading-relaxed text-[#5A5653]">
          This placeholder page will describe how Archive Arac collects, stores, and protects your data.
        </p>
        <Link href="/" className="mt-8 inline-block text-[10px] font-bold uppercase tracking-widest text-[#E67E22] hover:underline">
          Back home
        </Link>
      </section>
    </PlatformShell>
  );
}
