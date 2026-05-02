"use client";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-40 bg-[#F9F7F3]/90 backdrop-blur-md border-b border-[#E8E5DF]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#top" className="font-bold text-xl tracking-tighter flex items-center gap-2 group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-45 transition-transform duration-500">
            <path d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13"/>
            <circle cx="12" cy="12" r="3"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="9"/>
          </svg>
          ARCHIVE ARAC
        </a>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
          <a href="#weave" className="hover:text-[#E67E22] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#E67E22] after:transition-all hover:after:w-full">
            The Weave
          </a>
          <a href="#index" className="hover:text-[#E67E22] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#E67E22] after:transition-all hover:after:w-full">
            Araneae Index
          </a>
          <a href="#analyzer" className="hover:text-[#E67E22] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#E67E22] after:transition-all hover:after:w-full">
            Analyzer
          </a>
          <a href="#spinneret" className="hover:text-[#E67E22] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#E67E22] after:transition-all hover:after:w-full">
            Spinneret
          </a>
        </div>
      </div>
    </nav>
  );
}
