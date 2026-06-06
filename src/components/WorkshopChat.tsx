"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { buildAnalysisChatSummary } from "@/lib/analysisChatContext";
import { useScrollLock } from "@/hooks/useScrollLock";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Props = {
  result?: AnalysisResult | null;
};

/*
 * Phase 2 (deferred): Real-time agent "take over mouse" automation needs a browser
 * extension, Playwright session, or dedicated agent product — not feasible in this
 * web panel alone. This MVP is chat-only brainstorming on analysis context.
 */

export function WorkshopChat({ result }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => closeRef.current?.focus());
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          analysisContext: result ? buildAnalysisChatSummary(result) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [busy, input, messages, result]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-[#C4A882]/40 bg-[#2C2A29] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#F9F7F3] shadow-xl hover:bg-[#E67E22] transition-colors sm:px-5"
          aria-haspopup="dialog"
          aria-controls={panelId}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
          Workshop chat
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-3 sm:p-5 pointer-events-none">
          <button
            type="button"
            aria-label="Close workshop chat"
            className="absolute inset-0 bg-[#2C2A29]/30 backdrop-blur-[2px] pointer-events-auto"
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${panelId}-title`}
            className="relative pointer-events-auto flex w-full max-w-md flex-col rounded-3xl border border-[#E8E5DF] bg-[#FDFCFA] shadow-2xl max-h-[min(85dvh,640px)] animate-modal-in"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E8E5DF] px-5 py-4 shrink-0">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-1">
                  Workshop
                </p>
                <h2 id={`${panelId}-title`} className="text-lg font-bold tracking-tight text-[#2C2A29]">
                  Ask about your analysis
                </h2>
                {result && (
                  <p className="mt-1 text-[10px] text-[#5A5653] truncate max-w-[240px]">
                    Context: {result.hostname}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-xl border border-[#E8E5DF] p-2 text-[#5A5653] hover:border-[#E67E22] hover:text-[#2C2A29] transition-colors"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-[#5A5653] text-center py-6">
                  Brainstorm improvements, ask what the score means, or talk through branding and build options.
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "ml-8 bg-[#2C2A29] text-[#F9F7F3]"
                      : "mr-4 bg-[#F9F7F3] border border-[#E8E5DF] text-[#2C2A29]"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {busy && (
                <div className="mr-4 rounded-2xl px-4 py-3 text-sm bg-[#F9F7F3] border border-[#E8E5DF] text-[#5A5653]">
                  Thinking…
                </div>
              )}
              {error && (
                <p className="text-xs text-red-600 text-center" role="alert">
                  {error}
                </p>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-[#E8E5DF] p-4 shrink-0">
              <label htmlFor={`${panelId}-input`} className="sr-only">
                Message
              </label>
              <textarea
                id={`${panelId}-input`}
                ref={inputRef}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Ask about this site or your next move…"
                disabled={busy}
                className="w-full resize-none rounded-xl border border-[#E8E5DF] bg-white px-3 py-2 text-sm text-[#2C2A29] placeholder:text-[#B8B5AE] focus:outline-none focus:border-[#E67E22] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className="mt-2 w-full rounded-xl bg-[#E67E22] py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#2C2A29] disabled:opacity-40 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
