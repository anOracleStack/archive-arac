"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { WeaveMotionDescriptors, WeaveMotionStage } from "@/components/WeaveMotion";

export function LandscapeSection() {
  return (
    <section id="weave" className="relative z-10 py-24 px-6 bg-white border-y border-[#C4A882]/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 text-center lg:text-left">
            <ScrollReveal>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E67E22] mb-3">
                Wormhole Weave
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-balance mb-3">
                Three threads, one loop
              </h2>
              <p className="text-sm text-[#5A5653] font-light leading-relaxed mb-4">
                Illustrative trends in motion and layout — not live market data.
              </p>
            </ScrollReveal>
            <ScrollReveal index={1}>
              <p className="text-[#5A5653] mb-6 leading-relaxed copy-balanced">
                <span className="copy-balanced-line">
                  Static grids are giving way to interfaces with depth, intent, and motion that feels real.
                </span>
                <br />
                <span className="copy-balanced-line">
                  This weave is an illustration of those shifts — not a live market feed.
                </span>
              </p>
            </ScrollReveal>
            <ScrollReveal index={2}>
              <WeaveMotionDescriptors />
            </ScrollReveal>
          </div>
          <div className="lg:col-span-2 weave-stage-shell bg-[#F9F7F3] rounded-3xl p-6 border border-[#C4A882]/20">
            <ScrollReveal index={3}>
              <WeaveMotionStage />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
