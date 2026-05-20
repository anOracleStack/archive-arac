import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { ScrollReveal, StaggerGrid } from "@/components/ScrollReveal";
import { gloss } from "@/data/knowledgeGloss";

export function MethodologySection() {
  return (
    <section id="spinneret" className="relative z-10 py-24 px-6 bg-[#2C2A29] text-[#F9F7F3]">
      <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-balance">
              <KnowledgeGateway article={gloss.spinneret} surface="ink">
                <span className="font-bold text-[#C4A882] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">The Spinneret &mdash; Three Weaves</span>
              </KnowledgeGateway>
            </h2>
          </div>
          <p className="text-[#D1CEC7] mb-16 text-lg font-light text-pretty text-balance text-center max-w-2xl mx-auto">
            Every breakthrough interface uses one of these three silk types. Your next project should weave at least two.
        </p>

        <StaggerGrid className="grid md:grid-cols-3 gap-8 text-center" staggerMs={140}>
          <div className="relative flex flex-col items-center p-8 border border-[#5A5653] rounded-2xl hover:bg-[#3d3a38] hover:border-[#9C7C5B] transition-all group">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-6 group-hover:scale-110 transition-transform">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.29 7 12 12 20.71 7" />
              <line x1="12" y1="22" x2="12" y2="12" />
            </svg>
            <div className="text-3xl font-black mb-2 text-[#E67E22]">01</div>
            <h3 className="text-xl font-bold mb-3">
              <KnowledgeGateway article={gloss.elasticSilk} surface="ink">
                <span className="font-bold text-[#C4A882] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">Elastic Silk</span>
              </KnowledgeGateway>
            </h3>
            <p className="text-sm text-[#D1CEC7] leading-relaxed text-balance">
              Interfaces stretch & contract based on proximity, not clicks. Each panel is a strand of silk that tensions as the user nears, relaxing when focus shifts.
            </p>
          </div>
          <div className="relative flex flex-col items-center p-8 border border-[#5A5653] rounded-2xl hover:bg-[#3d3a38] transition-all group">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8BA896" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-6 group-hover:scale-110 transition-transform">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <div className="text-3xl font-black mb-2 text-[#8BA896]">02</div>
            <h3 className="text-xl font-bold mb-3">
              <KnowledgeGateway article={gloss.orbitalWeb} surface="ink">
                <span className="font-bold text-[#C4A882] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">Orbital Web</span>
              </KnowledgeGateway>
            </h3>
            <p className="text-sm text-[#D1CEC7] leading-relaxed text-balance">
              Navigation radiates from a central hub along concentric rings. Each level of depth is a ring further from the core — like a true spider web.
            </p>
          </div>
          <div className="relative flex flex-col items-center p-8 border border-[#5A5653] rounded-2xl hover:bg-[#3d3a38] transition-all group">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-6 group-hover:scale-110 transition-transform">
              <path d="M4 4 L20 20" />
              <path d="M4 20 L20 4" />
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="4" y1="12" x2="20" y2="12" />
            </svg>
            <div className="text-3xl font-black mb-2 text-[#E67E22]">03</div>
            <h3 className="text-xl font-bold mb-3">
              <KnowledgeGateway article={gloss.intentThread} surface="ink">
                <span className="font-bold text-[#C4A882] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">Intent Thread</span>
              </KnowledgeGateway>
            </h3>
            <p className="text-sm text-[#D1CEC7] leading-relaxed text-balance">
              The user speaks or types their goal. The interface weaves itself around that intent — a single thread pulled from the user&apos;s mind to the screen.
            </p>
          </div>
        </StaggerGrid>
      </div>
    </section>
  );
}
