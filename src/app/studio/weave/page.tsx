"use client";

import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { LoreTerm } from "@/components/LoreTerm";
import { PlatformShell } from "@/components/PlatformShell";
import { WeaveWorkshop } from "@/components/weave/WeaveWorkshop";

export default function WeavePage() {
  return (
    <PlatformShell>
      <div className="relative z-10 pt-28 pb-24 px-6 max-w-4xl mx-auto text-center">
        <LoreTerm
          className="mb-6"
          term="Weave"
          plain="Describe the website you want — we save your answers to Vault."
        />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Tell us what you want your{" "}
          <span className="text-[#E67E22]">website</span> to be
        </h1>
        <BalancedText
          className="text-lg text-[#5A5653] mb-8"
          lines={[
            "Answer a few questions about your business,",
            "look, & pages. We save everything to your Vault.",
            "Full site building is on the way — start here.",
          ]}
        />

        <FeatureExplainer
          className="mb-8 max-w-2xl mx-auto"
          loreTerm="Weave workshop"
          plainMeaning="A simple chat — your business name, style, goals, & pages. Everything lands in Vault."
          whatThisIs="Answer five questions about what you want your site to look like & do. Optional AI follow-up when chat is configured."
          youCan={[
            "Walk through questions in a chat-style flow",
            "Save your answers to Vault & optional AI follow-up",
          ]}
        />

        <WeaveWorkshop />

        <p className="mt-8 text-xs text-[#5A5653]">
          <Link href="/studio" className="text-[#E67E22] font-bold hover:underline">
            ← Back to Studio
          </Link>
          {" · "}
          <Link href="/vault?tab=weave" className="text-[#E67E22] font-bold hover:underline">
            View saved site briefs
          </Link>
        </p>
      </div>
    </PlatformShell>
  );
}
