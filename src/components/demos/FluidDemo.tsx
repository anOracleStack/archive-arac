"use client";

export function FluidDemo() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full flex h-40 gap-4">
        <div className="fluid-panel bg-[#E8E5DF] rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-[#5A5653] hover:text-white transition-colors">
          Touch
        </div>
        <div className="fluid-panel bg-[#E67E22] rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white">
          Strand
        </div>
        <div className="fluid-panel bg-[#2C2A29] rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white">
          Weaves
        </div>
      </div>
      <p className="mt-3 text-[10px] text-gray-400 text-center pointer-events-none">
        Hover over a panel — the silk tensions & stretches
      </p>
    </div>
  );
}
