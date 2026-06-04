"use client";

import { KnowledgeGateway } from "@/components/KnowledgeGateway";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WeaveMotionDescriptors, WeaveMotionStage } from "@/components/WeaveMotion";
import { gloss } from "@/data/knowledgeGloss";

export function LandscapeSection() {
  return (
    <section id="weave" className="relative z-10 py-24 px-6 bg-white border-y border-[#C4A882]/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1 text-center">
            <ScrollReveal>
              <div className="mb-6">
                <h2 className="text-4xl font-bold tracking-tight text-balance">
                  <KnowledgeGateway article={gloss.weaveGrowth} surface="cream">
                    <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">
                      The Growth of the Weave
                    </span>
                  </KnowledgeGateway>
                </h2>
              </div>
            </ScrollReveal>
            <ScrollReveal index={1}>
              <p className="text-[#5A5653] mb-6 leading-relaxed copy-balanced">
                <span className="copy-balanced-line">
                  Traditional{" "}
                  <KnowledgeGateway article={gloss.whatIsUI} surface="cream">
                    <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">
                      UI
                    </span>
                  </KnowledgeGateway>{" "}
                  patterns are decaying.
                </span>
                <br />
                <span className="copy-balanced-line">
                  We illustrate how interfaces are shifting from static grids toward
                </span>
                <br />
                <span className="copy-balanced-line">
                  <KnowledgeGateway article={gloss.spatialCategory} surface="cream">
                    <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">
                      Spatial Silk
                    </span>
                  </KnowledgeGateway>{" "}
                  &{" "}
                  <KnowledgeGateway article={gloss.intentDrivenTerm} surface="cream">
                    <span className="font-bold text-[#9C7C5B] hover:text-[#E67E22] transition-colors duration-200 border-b-2 border-transparent hover:border-[#E67E22] cursor-pointer">
                      Intent-Driven
                    </span>
                  </KnowledgeGateway>{" "}
                  interfaces.
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
