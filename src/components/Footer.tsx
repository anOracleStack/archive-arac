import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { gloss } from "@/data/knowledgeGloss";

export function Footer() {
  return (
      <footer className="relative z-10 bg-[#2C2A29] py-20 px-6 text-[#F9F7F3] border-t border-[#9C7C5B]/30">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
        <div>
          <div className="font-bold text-2xl tracking-tighter mb-2 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <KnowledgeGateway article={gloss.archiveArac} surface="ink">
                <span className="font-bold text-[#C4A882] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">ARCHIVE ARAC</span>
              </KnowledgeGateway>
            </span>
          </div>
          <p className="text-[#D1CEC7] text-sm font-light">Vanguard Weaving for the next digital era.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#3d3a38] bg-[#2C2A29] flex items-center justify-center"
                style={{ transform: `rotate(${i * 45}deg)` }}
              >
                <div className="w-2 h-2 rounded-full bg-[#E67E22] opacity-60" />
              </div>
            ))}
          </div>
          <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#5A5653]">
            &copy; 2026 Index Araneae &mdash; No Threads Left Unspun
          </span>
        </div>
      </div>
    </footer>
  );
}
