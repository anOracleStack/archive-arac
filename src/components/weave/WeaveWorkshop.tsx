"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BalancedText } from "@/components/BalancedText";
import { saveWeaveSession } from "@/lib/weaveStore";
import type { WeaveChatMessage } from "@/types/weave";

type IntakeField = "businessName" | "building" | "vibe" | "goals" | "pages";

const INTAKE_STEPS: { field: IntakeField; prompt: string; placeholder: string }[] = [
  {
    field: "businessName",
    prompt: "First — what's your business or project name?",
    placeholder: "e.g. Northwind Studio, my podcast, personal brand…",
  },
  {
    field: "building",
    prompt: "What are you building? Tell me the shape of it.",
    placeholder: "e.g. marketing site, portfolio, SaaS landing, shop…",
  },
  {
    field: "vibe",
    prompt: "What look or style should your site have?",
    placeholder: "e.g. warm minimal like Aesop, bold editorial, dark luxury…",
  },
  {
    field: "goals",
    prompt: "What should this website do for you?",
    placeholder: "e.g. book calls, sell templates, grow a waitlist…",
  },
  {
    field: "pages",
    prompt: "Which pages or sections do you need?",
    placeholder: "e.g. home, about, pricing, blog, contact…",
  },
];

type IntakeData = Record<IntakeField, string>;

const EMPTY_INTAKE: IntakeData = {
  businessName: "",
  building: "",
  vibe: "",
  goals: "",
  pages: "",
};

export function WeaveWorkshop() {
  const [messages, setMessages] = useState<WeaveChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to Weave — tell us about the site you want to build.\n\nI'll ask a few questions about your business, look, & goals. When you're done, we'll save it to your Vault.",
    },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [intake, setIntake] = useState<IntakeData>(EMPTY_INTAKE);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"intake" | "complete" | "followup">("intake");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [chatEnabled, setChatEnabled] = useState<boolean | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (stepIndex === 0 && messages.length === 1) {
      const first = INTAKE_STEPS[0];
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: first.prompt },
      ]);
    }
  }, [stepIndex, messages.length]);

  useEffect(() => {
    void fetch("/api/weave/status")
      .then((r) => r.json())
      .then((d: { chatAvailable?: boolean }) => setChatEnabled(!!d.chatAvailable))
      .catch(() => setChatEnabled(false));
  }, []);

  const advanceIntake = useCallback(
    (value: string) => {
      const step = INTAKE_STEPS[stepIndex];
      if (!step) return;

      const trimmed = value.trim();
      if (!trimmed) return;

      const nextIntake = { ...intake, [step.field]: trimmed };
      setIntake(nextIntake);

      const nextMessages: WeaveChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];

      const nextStep = stepIndex + 1;
      if (nextStep < INTAKE_STEPS.length) {
        nextMessages.push({
          role: "assistant",
          content: INTAKE_STEPS[nextStep].prompt,
        });
        setMessages(nextMessages);
        setStepIndex(nextStep);
        setInput("");
        return;
      }

      const summary = [
        `Got it — here's your site brief for **${nextIntake.businessName}**:`,
        "",
        `**Building:** ${nextIntake.building}`,
        `**Vibe:** ${nextIntake.vibe}`,
        `**Goals:** ${nextIntake.goals}`,
        `**Pages:** ${nextIntake.pages}`,
        "",
        "Saved to your Vault. Full site building is coming soon — your notes are ready when we ship.",
      ].join("\n");

      nextMessages.push({ role: "assistant", content: summary });
      setMessages(nextMessages);
      setStepIndex(nextStep);
      setInput("");
      setPhase("complete");

      const saved = saveWeaveSession({
        ...nextIntake,
        status: "intake_complete",
        messages: nextMessages,
      });
      setSavedId(saved.id);
    },
    [intake, messages, stepIndex]
  );

  const sendFollowUp = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || phase !== "complete") return;

    const nextMessages: WeaveChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setBusy(true);
    setPhase("followup");

    const context = [
      `Weave intake for ${intake.businessName}`,
      `Building: ${intake.building}`,
      `Vibe: ${intake.vibe}`,
      `Goals: ${intake.goals}`,
      `Pages: ${intake.pages}`,
    ].join("\n");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-8),
          analysisContext: context,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat unavailable");
      const withReply = [...nextMessages, { role: "assistant" as const, content: data.reply }];
      setMessages(withReply);
      if (savedId) {
        saveWeaveSession({
          id: savedId,
          ...intake,
          status: "intake_complete",
          messages: withReply,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Follow-up unavailable");
    } finally {
      setBusy(false);
    }
  }, [busy, input, intake, messages, phase, savedId]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "intake") advanceIntake(input);
    else if (phase === "complete" || phase === "followup") void sendFollowUp();
  };

  const currentPlaceholder =
    phase === "intake" && stepIndex < INTAKE_STEPS.length
      ? INTAKE_STEPS[stepIndex].placeholder
      : "Optional follow-up — layout ideas, priorities, timeline…";

  const intakeDone = phase !== "intake";

  return (
    <div className="flex flex-col h-[min(72dvh,680px)] max-w-2xl mx-auto rounded-3xl border border-[#E8E5DF] bg-white/90 shadow-xl overflow-hidden">
      <div className="border-b border-[#E8E5DF] px-6 py-5 bg-[#F9F7F3]/80 text-center shrink-0">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E67E22] mb-1">
          Weave
        </p>
        <h2 className="text-xl font-bold tracking-tight text-[#2C2A29]">
          Describe your website
        </h2>
        <BalancedText
          className="text-xs text-[#5A5653] mt-2"
          lines={[
            "Quick questions — saved to your Vault.",
            "Site building is on the way; tell us",
            "what you want today.",
          ]}
        />
      </div>

      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 space-y-3"
      >
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-10 bg-[#2C2A29] text-[#F9F7F3]"
                : "mr-6 bg-[#F9F7F3] border border-[#E8E5DF] text-[#2C2A29]"
            }`}
          >
            <span className="whitespace-pre-wrap">{msg.content.replace(/\*\*/g, "")}</span>
          </div>
        ))}
        {busy && (
          <div className="mr-6 rounded-2xl px-4 py-3 text-sm bg-[#F9F7F3] border border-[#E8E5DF] text-[#5A5653]">
            <span className="inline-flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22] animate-pulse [animation-delay:300ms]" />
              </span>
              Writing a reply…
            </span>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-[#E8E5DF] p-4 shrink-0 bg-[#FDFCFA]">
        {intakeDone && savedId && (
          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8BA896] mb-2">
              Session saved
            </p>
            <Link
              href={`/vault?tab=weave&id=${encodeURIComponent(savedId)}`}
              className="text-xs font-bold text-[#E67E22] hover:underline"
            >
              View in Vault →
            </Link>
          </div>
        )}
        {intakeDone && chatEnabled === false && (
          <p className="text-[10px] text-[#9C7C5B] text-center mb-3">
            AI follow-up unavailable — your brief is saved.
          </p>
        )}
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (phase === "intake") advanceIntake(input);
              else void sendFollowUp();
            }
          }}
          placeholder={currentPlaceholder}
          disabled={busy || (intakeDone && chatEnabled === false)}
          className="w-full resize-none rounded-xl border border-[#E8E5DF] bg-white px-3 py-2 text-sm text-[#2C2A29] placeholder:text-[#B8B5AE] focus:outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/15 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || busy || (intakeDone && chatEnabled === false)}
          className="mt-2 w-full rounded-xl bg-[#E67E22] py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#2C2A29] disabled:opacity-40 transition-all"
        >
          {phase === "intake" ? "Continue" : "Ask follow-up"}
        </button>
        {phase === "intake" && (
          <p className="text-[10px] text-[#B8B5AE] text-center mt-2">
            Step {Math.min(stepIndex + 1, INTAKE_STEPS.length)} of {INTAKE_STEPS.length}
          </p>
        )}
      </form>
    </div>
  );
}
