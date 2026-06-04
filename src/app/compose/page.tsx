"use client";

import { useMemo, useState } from "react";
import { strands } from "@/data/strands";
import { BalancedText } from "@/components/BalancedText";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { PlatformShell } from "@/components/PlatformShell";
import { buildComposeExport } from "@/lib/composeExport";
import { buildFullComposePackage } from "@/lib/composeScaffolds";

export default function ComposePage() {
  const [selected, setSelected] = useState<number[]>([1, 3]);
  const [projectName, setProjectName] = useState("my-weave");
  const [copied, setCopied] = useState(false);
  const [exportMode, setExportMode] = useState<"manifest" | "scaffolds">("manifest");

  const selectedStrands = useMemo(
    () => strands.filter((s) => selected.includes(s.id)),
    [selected]
  );

  const exportText = useMemo(() => {
    if (exportMode === "scaffolds") {
      return buildFullComposePackage(
        projectName,
        selectedStrands.map((s) => s.demoType)
      );
    }
    return buildComposeExport(selectedStrands, projectName);
  }, [selectedStrands, projectName, exportMode]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
          Strand Composer
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Weave your <span className="text-[#E67E22]">launch stack</span>
        </h1>
        <BalancedText
          className="text-[#5A5653] mb-10"
          lines={[
            "Select up to five strands. Export a manifest",
            "you can drop into a Next.js repo — the first step",
            "toward a strand-native site builder, not a generic",
            "drag-and-drop host.",
          ]}
        />

        <FeatureExplainer
          className="mb-10 text-left"
          whatThisIs="Pick up to five strands from the index and export a launch manifest or full scaffold package for your repo."
          youCan={[
            "Copy export text",
            "Tune project name and export mode",
          ]}
        />

        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {strands.map((s) => {
            const on = selected.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  on
                    ? "border-[#E67E22] bg-[#E67E22]/5 shadow-md"
                    : "border-[#E8E5DF] bg-white hover:border-[#C4A882]/50"
                }`}
              >
                <div className="flex justify-between gap-2 mb-1">
                  <span className="font-bold text-sm">{s.name}</span>
                  <span className="text-[10px] text-[#9C7C5B] uppercase">{s.demoType}</span>
                </div>
                <BalancedText text={s.shortDesc} className="text-xs text-[#5A5653] line-clamp-2" />
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setExportMode("manifest")}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors ${
              exportMode === "manifest"
                ? "border-[#E67E22] bg-[#E67E22]/10 text-[#E67E22]"
                : "border-[#D1CEC7] text-[#5A5653]"
            }`}
          >
            Manifest
          </button>
          <button
            type="button"
            onClick={() => setExportMode("scaffolds")}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors ${
              exportMode === "scaffolds"
                ? "border-[#E67E22] bg-[#E67E22]/10 text-[#E67E22]"
                : "border-[#D1CEC7] text-[#5A5653]"
            }`}
          >
            React scaffolds
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-end mb-6">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8B5AE]">
              Project slug
            </span>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#D1CEC7] bg-white text-sm outline-none focus:border-[#E67E22]"
            />
          </label>
          <button
            type="button"
            onClick={handleCopy}
            className="px-6 py-2.5 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22] transition-colors"
          >
            {copied ? "Copied" : "Copy export"}
          </button>
          <a
            href="/#analyzer"
            className="px-6 py-2.5 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest text-[#5A5653] hover:text-[#E67E22]"
          >
            Analyze a URL first →
          </a>
        </div>

        <pre className="p-4 rounded-2xl bg-[#2C2A29] text-[#E8E5DF] text-xs overflow-x-auto max-h-80 overflow-y-auto font-mono leading-relaxed">
          {exportText}
        </pre>
      </div>
    </PlatformShell>
  );
}
