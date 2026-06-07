"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSingleAnalyze, type SingleAnalyzeFlow } from "@/hooks/useSingleAnalyze";

const AnalyzerFlowContext = createContext<SingleAnalyzeFlow | null>(null);

export function AnalyzerFlowProvider({
  children,
  initialUrl = "",
  syncUrlOnComplete = true,
}: {
  children: ReactNode;
  initialUrl?: string;
  syncUrlOnComplete?: boolean;
}) {
  const flow = useSingleAnalyze(initialUrl, { syncUrlOnComplete });
  return (
    <AnalyzerFlowContext.Provider value={flow}>{children}</AnalyzerFlowContext.Provider>
  );
}

export function useAnalyzerFlow(): SingleAnalyzeFlow {
  const ctx = useContext(AnalyzerFlowContext);
  if (!ctx) {
    throw new Error("useAnalyzerFlow must be used within AnalyzerFlowProvider");
  }
  return ctx;
}
