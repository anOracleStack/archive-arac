"use client";

import { useState, useCallback } from "react";
import type { AnalysisResult, AnalysisStatus } from "@/types/analysis";
import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";

export function useSingleAnalyze(initialUrl = "") {
  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setStatus("idle");
  }, []);

  const submit = useCallback(
    async (overrideUrl?: string) => {
      const raw = (overrideUrl ?? url).trim();
      if (!raw) return null;

      setError(null);
      setResult(null);
      setStatus("fetching");

      const submitUrl = tryNormalizeCanonicalUrl(raw);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: submitUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Analysis failed");
        setUrl(submitUrl);
        setResult(data);
        setStatus("complete");
        return data as AnalysisResult;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
        return null;
      }
    },
    [url]
  );

  const busy = status === "fetching" || status === "analyzing";

  return {
    url,
    setUrl,
    status,
    result,
    error,
    busy,
    submit,
    reset,
    setError,
    setStatus,
  };
}

export type SingleAnalyzeFlow = ReturnType<typeof useSingleAnalyze>;
