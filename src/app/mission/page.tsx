import { BalancedText } from "@/components/BalancedText";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { LoreTerm } from "@/components/LoreTerm";
import { PlatformShell } from "@/components/PlatformShell";
import { WeaveJourney } from "@/components/mission/WeaveJourney";
import { ScrollReveal } from "@/components/ScrollReveal";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://oidib.io";

export default function MissionPage() {
  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <LoreTerm
            className="mb-6"
            term="Mission"
            plain="Your map through the weave — four moves, one Vault."
          />
        </ScrollReveal>

        <ScrollReveal index={1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[0.95]">
            How Archive Arac <br className="hidden sm:block" />
            <span className="text-[#E67E22]">actually works</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal index={2}>
          <BalancedText
            className="text-lg text-[#5A5653] mb-16 max-w-2xl mx-auto"
            lines={[
              "No phase numbers. No jargon soup.",
              "Four clear moves — & one vault",
              "that holds everything you save.",
            ]}
          />
        </ScrollReveal>

        <ScrollReveal index={3}>
          <FeatureExplainer
            className="mb-12"
            loreTerm="Archive Arac"
            plainMeaning="See any site, claim a name, ship hosting, & export the strands that fit."
            whatThisIs="Four moves — Unravel → Claim → Spin → Weave — with links into real tools. One Vault holds everything you save."
            youCan="Understand the flow end-to-end before committing to Identity Lock or Studio."
          />
        </ScrollReveal>

        <WeaveJourney appUrl={appUrl} />
      </div>
    </PlatformShell>
  );
}
