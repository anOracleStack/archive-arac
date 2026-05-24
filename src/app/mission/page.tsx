import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";
import { WeaveJourney } from "@/components/mission/WeaveJourney";
import { ScrollReveal } from "@/components/ScrollReveal";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://oidib.io";

export default function MissionPage() {
  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
            Your map through the weave
          </div>
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

        <WeaveJourney appUrl={appUrl} />
      </div>
    </PlatformShell>
  );
}
