"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { AnalysisResult, AnalysisStatus } from "@/types/analysis";
import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";
import {
  loadAnalysisSession,
  saveAnalysisSession,
  clearAnalysisSession,
  syncAnalysisUrl,
} from "@/lib/analysisSession";

export interface UseSingleAnalyzeOptions {
  initialUrl?: string;
  restoreSession?: boolean;
  syncUrlOnComplete?: boolean;
}

export function useSingleAnalyze(
  initialUrl = "",
  options: UseSingleAnalyzeOptions = {}
) {
  const { restoreSession = true, syncUrlOnComplete = true } = options;
  const hydrated = useRef(false);

  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedAt, setAnalyzedAt] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    if (initialUrl.trim()) return;

    if (!restoreSession) return;

    const saved = loadAnalysisSession();
    if (!saved) return;

    setUrl(saved.url);
    setResult(saved.result);
    setStatus(saved.status);
    setError(saved.error);
    setAnalyzedAt(saved.analyzedAt);
  }, [initialUrl, restoreSession]);

  useEffect(() => {
    if (initialUrl.trim() && initialUrl !== url) {
      setUrl(initialUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync prefill when prop changes
  }, [initialUrl]);

  useEffect(() => {
    if (status !== "complete" || !result) return;
    saveAnalysisSession({ url, result, status, error, analyzedAt });
    if (syncUrlOnComplete) syncAnalysisUrl(result.url);
  }, [status, result, url, error, analyzedAt, syncUrlOnComplete]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setStatus("idle");
    setAnalyzedAt(null);
    clearAnalysisSession();
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
        const completedAt = new Date().toISOString();
        setUrl(submitUrl);
        setResult(data);
        setStatus("complete");
        setAnalyzedAt(completedAt);
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
    analyzedAt,
  };
}

export type SingleAnalyzeFlow = ReturnType<typeof useSingleAnalyze>;
