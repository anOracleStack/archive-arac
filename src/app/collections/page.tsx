"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { PlatformShell } from "@/components/PlatformShell";
import {
  listCollections,
  createCollection,
  deleteCollection,
  addUrlToCollection,
  removeUrlFromCollection,
  getCollection,
  type SilkCollection,
} from "@/lib/collectionsStore";
import type { AnalysisResult } from "@/types/analysis";
import { tryNormalizeCanonicalUrl } from "@/lib/normalizeUrl";

interface BatchRow {
  result: AnalysisResult;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<SilkCollection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [batchRows, setBatchRows] = useState<BatchRow[]>([]);
  const [batchErrors, setBatchErrors] = useState<{ url: string; error: string }[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  const refresh = () => setCollections(listCollections());

  useEffect(() => {
    refresh();
    const first = listCollections()[0];
    if (first) setActiveId(first.id);
  }, []);

  const active = activeId ? getCollection(activeId) : null;

  const handleCreate = () => {
    const col = createCollection(newName || "Benchmark set");
    setNewName("");
    refresh();
    setActiveId(col.id);
  };

  const handleAddUrl = () => {
    if (!activeId || !urlInput.trim()) return;
    addUrlToCollection(activeId, tryNormalizeCanonicalUrl(urlInput));
    setUrlInput("");
    refresh();
  };

  const runBatch = async () => {
    if (!active?.urls.length) return;
    setBatchLoading(true);
    setBatchRows([]);
    setBatchErrors([]);
    try {
      const res = await fetch("/api/analyze/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: active.urls }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Batch failed");
      setBatchRows(data.results.map((r: AnalysisResult) => ({ result: r })));
      setBatchErrors(data.errors ?? []);
    } catch (e) {
      setBatchErrors([
        { url: "—", error: e instanceof Error ? e.message : "Batch failed" },
      ]);
    } finally {
      setBatchLoading(false);
    }
  };

  const exportBenchmark = () => {
    if (!batchRows.length) return;
    const lines = [
      `# Silk Benchmark — ${active?.name ?? "Collection"}`,
      "",
      ...batchRows
        .sort((a, b) => b.result.overview.score - a.result.overview.score)
        .map(
          (row, i) =>
            `${i + 1}. **${row.result.hostname}** — ${row.result.overview.score}/100 (${row.result.overview.vibe})\n   ${row.result.url}`
        ),
      "",
      "---",
      "Archive Arac Collections",
    ];
    void navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <PlatformShell>
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#C4A882]/40 text-[#6B543C] text-[10px] font-black tracking-[0.2em] uppercase bg-[#C4A882]/10">
          Phase 3 — Collections
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          URL <span className="text-[#E67E22]">collections</span>
        </h1>
        <BalancedText
          className="text-[#5A5653] mb-10"
          lines={[
            "Curate competitor sets, batch-analyze",
            "up to eight URLs, & export agency-ready",
            "benchmark sheets — hall-of-fame boards",
            "without leaving the weave.",
          ]}
        />

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 text-left">
          <aside className="space-y-4">
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New collection name"
                className="flex-1 px-3 py-2 rounded-xl border border-[#D1CEC7] text-sm outline-none focus:border-[#E67E22]"
              />
              <button
                type="button"
                onClick={handleCreate}
                className="px-3 py-2 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22]"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {collections.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                      activeId === c.id
                        ? "border-[#E67E22] bg-[#E67E22]/5"
                        : "border-[#E8E5DF] bg-white hover:border-[#C4A882]/50"
                    }`}
                  >
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-[10px] text-[#B8B5AE]">{c.urls.length} URLs</p>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-6">
            {!active ? (
              <BalancedText text="Create a collection to begin." className="text-[#5A5653] mx-auto" />
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{active.name}</h2>
                    <p className="text-sm text-[#5A5653]">{active.urls.length} / 8 URLs (batch cap)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      deleteCollection(active.id);
                      refresh();
                      setActiveId(listCollections()[0]?.id ?? null);
                      setBatchRows([]);
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-500"
                  >
                    Delete collection
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onBlur={() => setUrlInput((v) => tryNormalizeCanonicalUrl(v))}
                    placeholder="Add URL"
                    className="flex-1 px-4 py-3 rounded-xl border border-[#D1CEC7] text-sm"
                    disabled={active.urls.length >= 8}
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={active.urls.length >= 8}
                    className="px-5 py-3 rounded-xl bg-[#2C2A29] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#E67E22] disabled:opacity-40"
                  >
                    Add URL
                  </button>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {active.urls.map((u) => (
                    <li
                      key={u}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9F7F3] border border-[#E8E5DF] text-xs"
                    >
                      <span className="text-[#5A5653] max-w-[200px] truncate">{u}</span>
                      <button
                        type="button"
                        onClick={() => {
                          removeUrlFromCollection(active.id, u);
                          refresh();
                        }}
                        className="text-red-400 hover:text-red-600"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={runBatch}
                    disabled={!active.urls.length || batchLoading}
                    className="px-6 py-3 rounded-xl bg-[#E67E22] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2C2A29] disabled:opacity-40"
                  >
                    {batchLoading ? "Weaving batch…" : "Batch analyze"}
                  </button>
                  {batchRows.length > 0 && (
                    <button
                      type="button"
                      onClick={exportBenchmark}
                      className="px-6 py-3 rounded-xl border border-[#D1CEC7] text-[10px] font-bold uppercase tracking-widest"
                    >
                      Copy benchmark sheet
                    </button>
                  )}
                </div>

                {batchErrors.length > 0 && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                    {batchErrors.map((e) => (
                      <p key={e.url}>
                        {e.url}: {e.error}
                      </p>
                    ))}
                  </div>
                )}

                {batchRows.length > 0 && (
                  <div className="overflow-x-auto rounded-2xl border border-[#E8E5DF] bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E8E5DF] text-left text-[10px] uppercase tracking-widest text-[#B8B5AE]">
                          <th className="p-4">Site</th>
                          <th className="p-4">Score</th>
                          <th className="p-4">Vibe</th>
                          <th className="p-4">Frameworks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchRows
                          .sort((a, b) => b.result.overview.score - a.result.overview.score)
                          .map(({ result }) => (
                            <tr key={result.url} className="border-b border-[#F9F7F3]">
                              <td className="p-4">
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-[#E67E22] hover:underline"
                                >
                                  {result.hostname}
                                </a>
                              </td>
                              <td className="p-4 font-black tabular-nums">{result.overview.score}</td>
                              <td className="p-4 text-[#5A5653]">{result.overview.vibe}</td>
                              <td className="p-4 text-xs text-[#5A5653]">
                                {result.tech.frameworks.slice(0, 3).join(", ") || "—"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <p className="mt-12 text-sm text-[#B8B5AE]">
          Cloud sync & public hall-of-fame boards — next orbit.{" "}
          <Link href="/mission" className="text-[#E67E22] hover:underline">
            Mission Control →
          </Link>
        </p>
      </div>
    </PlatformShell>
  );
}
