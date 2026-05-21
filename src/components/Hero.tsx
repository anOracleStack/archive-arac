import Link from "next/link";
import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { ScrollReveal } from "@/components/ScrollReveal";
import { gloss } from "@/data/knowledgeGloss";

export function Hero() {
  return (
    <header className="relative pt-40 pb-20 px-6 max-w-5xl mx-auto text-center z-10">
      <ScrollReveal>
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10 backdrop-blur-sm shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
          Vanguard Thread v2.0
        </div>
      </ScrollReveal>
      <ScrollReveal index={1}>
        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter">
          Spinning the <br />
          <span className="text-[#E67E22] relative inline-block">
            Next Web.
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
              <path d="M0 4 Q50 0 100 4 Q150 8 200 4" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
            </svg>
          </span>
        </h1>
      </ScrollReveal>
      <ScrollReveal index={2}>
        <div className="text-xl text-[#5A5653] leading-relaxed max-w-2xl mx-auto font-light text-pretty text-balance text-center">
          <span className="block">A specialized index of digital architectures that break the mold.</span>
          <span className="block">We track the threads of{" "}
            <KnowledgeGateway article={gloss.synapseSilk} surface="cream">
              <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">Synapse &amp; Silk</span>
            </KnowledgeGateway>{" "}
            — where high-performance <KnowledgeGateway article={gloss.whatIsUI} surface="cream"><span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">UI</span></KnowledgeGateway> meets organic interactivity.</span>
        </div>
      </ScrollReveal>
      <ScrollReveal index={3}>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            { href: "/identity", label: "Identity Lock" },
            { href: "/studio", label: "Studio" },
            { href: "/analyze", label: "Analyzer" },
            { href: "/vault", label: "Vault" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full border border-[#E8E5DF] text-[10px] font-bold uppercase tracking-widest text-[#5A5653] hover:border-[#E67E22] hover:text-[#E67E22] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </ScrollReveal>
    </header>
  );
}
