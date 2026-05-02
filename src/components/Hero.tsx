import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { gloss } from "@/data/knowledgeGloss";

export function Hero() {
  return (
    <header className="relative pt-40 pb-20 px-6 max-w-5xl mx-auto text-center z-10">
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#E8E5DF] text-[#5A5653] text-[10px] font-black tracking-[0.2em] uppercase bg-white/80 backdrop-blur-sm shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
        Vanguard Thread v2.0
      </div>
      <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter">
        Spinning the <br />
        <span className="text-[#E67E22] relative inline-block">
          Next Web.
          <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
            <path d="M0 4 Q50 0 100 4 Q150 8 200 4" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
          </svg>
        </span>
      </h1>
      <p className="text-xl text-[#5A5653] leading-relaxed max-w-2xl mx-auto font-light text-pretty text-balance">
        A specialized index of digital architectures that break the mold. We track the threads of{" "}
        <span className="inline-flex items-center gap-1.5 flex-wrap justify-center align-middle">
          <span className="font-semibold text-[#2C2A29]">Synapse &amp; Silk</span>
          <KnowledgeGateway article={gloss.synapseSilk} surface="cream" compact />
        </span>{" "}
        — where high-performance code meets organic interactivity.
      </p>
      <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-[#D1CEC7] font-bold text-balance max-w-md mx-auto">
        Spot a word you don&apos;t know? Tap the thread icon in any section — same page, three depth levels.
      </p>
    </header>
  );
}
