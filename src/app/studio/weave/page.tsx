"use client";

import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { PlatformShell } from "@/components/PlatformShell";
import { WeaveWorkshop } from "@/components/weave/WeaveWorkshop";

export default function WeavePage() {
  return (
    <PlatformShell>
      <div className="relative z-10 pt-28 pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
          Weave
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Weave your <span className="text-[#E67E22]">presence</span>
        </h1>
        <BalancedText
          className="text-lg text-[#5A5653] mb-8"
          lines={[
            "Describe what you want — we gather context",
            "& save it to your Vault. Build delivery",
            "is coming; honest intake works today.",
          ]}
        />

        <FeatureExplainer
          className="mb-8 text-left max-w-2xl mx-auto"
          whatThisIs="Archive Arac's conversational build workshop — gather business context, vibe, goals, & pages before we ship your site."
          youCan={[
            "Complete intake in a chat-style flow",
            "Save sessions to Vault & optional AI follow-up",
          ]}
        />

        <WeaveWorkshop />

        <p className="mt-8 text-xs text-[#5A5653]">
          <Link href="/studio" className="text-[#E67E22] font-bold hover:underline">
            ← Back to Studio
          </Link>
          {" · "}
          <Link href="/vault?tab=weave" className="text-[#E67E22] font-bold hover:underline">
            View saved weaves
          </Link>
        </p>
      </div>
    </PlatformShell>
  );
}
