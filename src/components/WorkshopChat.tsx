"use client";

import { memo, useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { AnalysisResult } from "@/types/analysis";
import type { SiteComparison } from "@/lib/compareSites";
import {
  buildAnalysisChatSummary,
  buildCompareChatSummary,
  resolveContextTier,
  type ContextLevel,
} from "@/lib/analysisChatContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import {
  loadWorkshopThread,
  saveWorkshopThread,
  parseActionPlanPayload,
  type ActionPlanPayload,
  type StoredChatMessage,
} from "@/lib/workshopThreadStore";

type ChatMessage = StoredChatMessage;

type CompareContext = {
  a: AnalysisResult;
  b: AnalysisResult;
  comparison: SiteComparison;
};

type Props = {
  result?: AnalysisResult | null;
  compare?: CompareContext | null;
};

type RetryPayload = {
  userText: string;
  actionPlan: boolean;
  messagesBefore: ChatMessage[];
};

const SINGLE_STARTER_PROMPTS = [
  { label: "Top 3 improvements", message: "What are the top 3 improvements I should make to this site?" },
  { label: "Explain the stack", message: "Explain the tech stack detected in this analysis in plain language." },
  { label: "Brand alignment tips", message: "How well does this site align with modern brand and design trends? Give specific tips." },
  { label: "Turn into action plan", message: "Turn the key findings into a prioritized action plan I can execute this week.", actionPlan: true },
] as const;

const COMPARE_STARTER_PROMPTS = [
  { label: "Who wins on score?", message: "Compare the innovation scores and vibes of both sites. Which leads and why?" },
  { label: "Stack differences", message: "Explain the biggest tech stack differences between these two sites and what they imply." },
  { label: "What should A steal?", message: "What should site A borrow from site B based on this comparison?" },
  { label: "Compare action plan", message: "Build a prioritized action plan for improving the lower-scoring site using this comparison.", actionPlan: true },
] as const;

const ACTION_PLAN_JSON_HINT =
  "Respond with ONLY valid JSON matching the action-plan schema (goal, quickWins, medium, larger, firstMove).";

function isActionPlanRequest(text: string): boolean {
  return /action plan|checklist|to-?do|next steps|roadmap|priorities/i.test(text);
}

type StreamEvent = {
  type: string;
  delta?: string;
  message?: string;
};

type StreamOutcome = {
  completed: boolean;
  streamError?: string;
};

function parseSseChunk(raw: string): StreamEvent | null {
  const line = raw.trim();
  if (!line.startsWith("data:")) return null;
  try {
    return JSON.parse(line.slice(5).trim()) as StreamEvent;
  } catch {
    return null;
  }
}

async function consumeChatStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (text: string) => void
): Promise<StreamOutcome> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;
  let streamError: string | undefined;

  const handleEvent = (event: StreamEvent) => {
    if (event.type === "text-delta" && event.delta) onDelta(event.delta);
    if (event.type === "done") completed = true;
    if (event.type === "error") {
      streamError = event.message || "Stream error";
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const event = parseSseChunk(part);
        if (!event) continue;
        handleEvent(event);
        if (streamError) break;
      }
      if (streamError) break;
    }

    if (!streamError && buffer.trim()) {
      const event = parseSseChunk(buffer);
      if (event) handleEvent(event);
    }

    if (!streamError && !completed) {
      streamError = "Connection closed before the reply finished";
    }
  } catch (err) {
    streamError = err instanceof Error ? err.message : "Stream failed";
  }

  return { completed: completed && !streamError, streamError };
}

function resolveContextLevel(text: string): ContextLevel {
  return resolveContextTier(undefined, text) === "L1" ? "full" : "core";
}

function buildChatContext(
  text: string,
  result: AnalysisResult | null | undefined,
  compare: CompareContext | null | undefined
): string | null {
  const level = resolveContextLevel(text);
  const options = { contextLevel: level, lastUserMessage: text };

  if (compare) {
    return buildCompareChatSummary(compare.a, compare.b, compare.comparison, options).context;
  }
  if (result) {
    return buildAnalysisChatSummary(result, options).context;
  }
  return null;
}

function threadHostname(
  result: AnalysisResult | null | undefined,
  compare: CompareContext | null | undefined
): string {
  if (compare) {
    return `compare:${compare.a.hostname}|${compare.b.hostname}`;
  }
  return result?.hostname ?? "";
}

function ActionPlanView({ plan }: { plan: ActionPlanPayload }) {
  const sections: { title: string; items: ActionPlanPayload["quickWins"] }[] = [
    { title: "Quick wins (this week)", items: plan.quickWins },
    { title: "Medium effort (this month)", items: plan.medium },
    { title: "Larger bets (when ready)", items: plan.larger },
  ];

  return (
    <div className="space-y-4 text-sm">
      <p className="font-semibold text-[#2C2A29]">{plan.goal}</p>
      {sections.map(
        (sec) =>
          sec.items.length > 0 && (
            <div key={sec.title}>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9C7C5B] mb-2">
                {sec.title}
              </p>
              <ul className="space-y-2.5">
                {sec.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[#C4A882]/60 bg-white text-[9px] font-bold text-[#E67E22]">
                      {item.effort}
                    </span>
                    <span>
                      <span className="font-medium">{item.task}</span>
                      {item.why && (
                        <span className="block text-xs text-[#5A5653] mt-0.5">{item.why}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
      {plan.firstMove && (
        <p className="text-xs border-t border-[#E8E5DF] pt-3 text-[#5A5653]">
          <span className="font-bold text-[#E67E22]">First move today: </span>
          {plan.firstMove}
        </p>
      )}
    </div>
  );
}

const MessageContent = memo(function MessageContent({
  content,
  asChecklist,
  actionPlanData,
}: {
  content: string;
  asChecklist?: boolean;
  actionPlanData?: ActionPlanPayload | null;
}) {
  if (actionPlanData) {
    return <ActionPlanView plan={actionPlanData} />;
  }

  const lines = content.split("\n").filter((l) => l.trim());
  const looksLikeList =
    asChecklist ||
    lines.some((l) => /^(\s*[-*•]|\s*\d+[.)]\s|\s*[-*]\s*\[[ xX]?\])/.test(l));

  if (!looksLikeList) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  const items = lines
    .map((line) => {
      const checkbox = line.match(/^\s*[-*]\s*\[([ xX]?)\]\s*(.+)/);
      if (checkbox) return { type: "checkbox" as const, done: checkbox[1].toLowerCase() === "x", text: checkbox[2] };
      const bullet = line.match(/^\s*[-*•]\s+(.+)/);
      if (bullet) return { type: "bullet" as const, text: bullet[1] };
      const numbered = line.match(/^\s*\d+[.)]\s+(.+)/);
      if (numbered) return { type: "numbered" as const, text: numbered[1] };
      return { type: "text" as const, text: line };
    })
    .filter((item) => item.type !== "text" || item.text.trim());

  if (items.length < 2 && !asChecklist) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => {
        if (item.type === "checkbox") {
          return (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                  item.done
                    ? "border-[#8BA896] bg-[#8BA896]/15 text-[#8BA896]"
                    : "border-[#C4A882]/60 bg-white text-transparent"
                }`}
                aria-hidden
              >
                ✓
              </span>
              <span className={item.done ? "text-[#5A5653] line-through decoration-[#B8B5AE]" : ""}>{item.text}</span>
            </li>
          );
        }
        if (item.type === "numbered") {
          return (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E67E22]/10 text-[10px] font-bold text-[#E67E22]">
                {i + 1}
              </span>
              <span>{item.text}</span>
            </li>
          );
        }
        if (item.type === "bullet") {
          return (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E67E22]" aria-hidden />
              <span>{item.text}</span>
            </li>
          );
        }
        return (
          <li key={i} className="text-[#5A5653] text-xs pt-1">
            {item.text}
          </li>
        );
      })}
    </ul>
  );
});

export function WorkshopChat({ result, compare = null }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryPayload, setRetryPayload] = useState<RetryPayload | null>(null);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hostname = threadHostname(result, compare);
  const starterPrompts = compare ? COMPARE_STARTER_PROMPTS : SINGLE_STARTER_PROMPTS;
  const hasContext = !!result || !!compare;

  useScrollLock(open);

  useEffect(() => {
    if (!hostname) {
      setMessages([]);
      return;
    }
    const saved = loadWorkshopThread(hostname);
    setMessages(saved ?? []);
  }, [hostname]);

  useEffect(() => {
    if (!hostname || messages.length === 0) return;

    if (busy) {
      const timer = window.setTimeout(() => {
        saveWorkshopThread(hostname, messages);
      }, 500);
      return () => window.clearTimeout(timer);
    }

    saveWorkshopThread(hostname, messages);
  }, [hostname, messages, busy]);

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

  const send = useCallback(
    async (
      textOverride?: string,
      opts?: { actionPlan?: boolean; retryFrom?: RetryPayload }
    ) => {
      const text = (textOverride ?? input).trim();
      if (!text || busy) return;

      const actionPlan = opts?.actionPlan ?? isActionPlanRequest(text);
      const baseMessages = opts?.retryFrom?.messagesBefore ?? messages;
      const nextMessages: ChatMessage[] = [...baseMessages, { role: "user", content: text }];

      setMessages(nextMessages);
      setInput("");
      setError(null);
      setRetryPayload(null);
      setBusy(true);

      const snapshot: RetryPayload = {
        userText: text,
        actionPlan,
        messagesBefore: baseMessages,
      };

      const assistantPlaceholder: ChatMessage = {
        role: "assistant",
        content: "",
        actionPlan,
      };
      setMessages((prev) => [...prev, assistantPlaceholder]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages,
            analysisContext: buildChatContext(text, result, compare),
            formatHint: actionPlan ? ACTION_PLAN_JSON_HINT : undefined,
            stream: true,
          }),
        });

        const contentType = res.headers.get("content-type") ?? "";

        if (!res.ok) {
          const data = contentType.includes("application/json")
            ? await res.json().catch(() => ({}))
            : {};
          throw new Error(data.error || `Chat failed (${res.status})`);
        }

        let fullReply = "";

        if (contentType.includes("text/event-stream") && res.body) {
          let streamRaf = 0;
          const flushStream = () => {
            const snapshotText = fullReply;
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = { ...last, content: snapshotText };
              }
              return copy;
            });
          };

          const outcome = await consumeChatStream(res.body, (delta) => {
            fullReply += delta;
            if (streamRaf) return;
            streamRaf = requestAnimationFrame(() => {
              streamRaf = 0;
              flushStream();
            });
          });

          if (streamRaf) {
            cancelAnimationFrame(streamRaf);
            flushStream();
          }

          if (outcome.streamError) {
            setRetryPayload(snapshot);
            throw new Error(outcome.streamError);
          }
        } else {
          const data = await res.json();
          fullReply = data.reply ?? "";
          if (!fullReply) throw new Error("Empty response from chat");
        }

        const actionPlanData = actionPlan ? parseActionPlanPayload(fullReply) : null;
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            copy[copy.length - 1] = {
              ...last,
              content: fullReply,
              actionPlan,
              actionPlanData,
            };
          }
          return copy;
        });
      } catch (err) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) return prev.slice(0, -1);
          return prev;
        });
        setRetryPayload(snapshot);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setBusy(false);
        queueMicrotask(() => inputRef.current?.focus());
      }
    },
    [busy, compare, input, messages, result]
  );

  const retryLast = useCallback(() => {
    if (!retryPayload || busy) return;
    setMessages(retryPayload.messagesBefore);
    void send(retryPayload.userText, {
      actionPlan: retryPayload.actionPlan,
      retryFrom: retryPayload,
    });
  }, [busy, retryPayload, send]);

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
          className="workshop-fab fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-[#C4A882]/40 bg-[#2C2A29] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#F9F7F3] shadow-xl hover:bg-[#E67E22] transition-all duration-300 sm:px-5"
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
            className="absolute inset-0 bg-[#2C2A29]/30 backdrop-blur-[2px] pointer-events-auto transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${panelId}-title`}
            className="workshop-panel relative pointer-events-auto flex w-full max-w-md flex-col rounded-3xl border border-[#D1CEC7]/80 bg-[#FDFCFA] shadow-2xl max-h-[min(85dvh,640px)] animate-modal-in overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#E8E5DF] px-5 py-4 shrink-0 bg-[#F9F7F3]/80">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-1">
                  Workshop
                </p>
                <h2 id={`${panelId}-title`} className="text-lg font-bold tracking-tight text-[#2C2A29]">
                  Ask about your analysis
                </h2>
                {compare && (
                  <p className="mt-1 text-[10px] text-[#5A5653] truncate max-w-[260px]">
                    Context: {compare.a.hostname} vs {compare.b.hostname}
                  </p>
                )}
                {!compare && result && (
                  <p className="mt-1 text-[10px] text-[#5A5653] truncate max-w-[240px]">
                    Context: {result.hostname}
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-xl border border-[#E8E5DF] p-2 text-[#5A5653] hover:border-[#E67E22] hover:text-[#2C2A29] hover:scale-105 active:scale-95 transition-all duration-200"
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
                <div className="text-center py-4">
                  <p className="text-sm text-[#5A5653] mb-4 leading-relaxed">
                    Brainstorm improvements, decode the score,
                    <br />
                    or shape your next build move.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2" role="list">
                    {starterPrompts.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        role="listitem"
                        disabled={busy || !hasContext}
                        onClick={() => void send(chip.message, { actionPlan: "actionPlan" in chip && chip.actionPlan })}
                        className="rounded-full border border-[#E8E5DF] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#2C2A29] hover:border-[#E67E22] hover:text-[#E67E22] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-40"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all duration-300 ${
                    msg.role === "user"
                      ? "ml-8 bg-[#2C2A29] text-[#F9F7F3] shadow-sm"
                      : "mr-4 bg-[#F9F7F3] border border-[#E8E5DF] text-[#2C2A29] shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    msg.content || (busy && i === messages.length - 1) ? (
                      <MessageContent
                        content={msg.content}
                        asChecklist={msg.actionPlan && !msg.actionPlanData}
                        actionPlanData={msg.actionPlanData}
                      />
                    ) : null
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
              ))}
              {busy && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="mr-4 rounded-2xl px-4 py-3 text-sm bg-[#F9F7F3] border border-[#E8E5DF] text-[#5A5653]">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse [animation-delay:300ms]" />
                    </span>
                    Thinking…
                  </span>
                </div>
              )}
              {error && (
                <div className="text-center space-y-2" role="alert">
                  <p className="text-xs text-red-600">{error}</p>
                  {retryPayload && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => retryLast()}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-700 hover:bg-red-100 disabled:opacity-40"
                    >
                      Retry message
                    </button>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-[#E8E5DF] p-4 shrink-0 bg-[#FDFCFA]">
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {starterPrompts.slice(0, 3).map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      disabled={busy}
                      onClick={() => void send(chip.message, { actionPlan: "actionPlan" in chip && chip.actionPlan })}
                      className="rounded-full border border-[#E8E5DF]/80 bg-[#F9F7F3] px-2.5 py-1 text-[10px] font-semibold text-[#5A5653] hover:border-[#C4A882] hover:text-[#2C2A29] transition-colors disabled:opacity-40"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
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
                className="w-full resize-none rounded-xl border border-[#E8E5DF] bg-white px-3 py-2 text-sm text-[#2C2A29] placeholder:text-[#B8B5AE] focus:outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/15 disabled:opacity-50 transition-shadow"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                className="mt-2 w-full rounded-xl bg-[#E67E22] py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#2C2A29] disabled:opacity-40 transition-all duration-200 hover:shadow-md active:scale-[0.99]"
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
