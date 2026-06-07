# Workshop Chat — AI Layer Architecture

**Date:** 2026-06-07  
**Status:** Spec (no implementation in this deliverable)  
**Scope:** `/api/chat`, `buildAnalysisChatSummary`, `WorkshopChat`  
**Related:** Analysis pipeline (`/api/analyze`), `AnalysisResult` type  
**Parent elevation doc:** `2026-06-07-analysis-workshop-elevation-design.md` (not yet authored — this file is the AI appendix)

---

## Current baseline

| Layer | Today |
|-------|--------|
| Route | `POST /api/chat` — blocking `chat/completions`, `gpt-4o-mini`, `max_tokens: 800` |
| Context | `buildAnalysisChatSummary()` — overview + partial tech/design JSON (~1–2 KB) |
| Client | `WorkshopChat` — manual `fetch`, full reply, no chips, no output modes |
| SDK | Raw OpenAI HTTP (no Vercel AI SDK) |

---

## 1. Prompt architecture

### 1.1 Layered system prompt

Split the monolithic `SYSTEM_PROMPT` into four blocks concatenated server-side (never sent separately to the client):

```
[ROLE]
Workshop guide for Archive Arac — plain, practical, encouraging. Expert in interpreting site analysis, prioritizing improvements, branding/layout ideas, and build/tool choices.

[GROUNDING RULES]
- Reference supplied analysis fields by name (score, vibe, problems, stack).
- Never invent metrics, URLs, or stack items not in context.
- If context is missing, answer generally and say you lack site-specific data.
- No legal/medical/financial advice; no guarantees of ranking or revenue.

[RESPONSE SHAPE]
- Default: 2–4 short paragraphs or ≤6 bullets.
- When user asks for priorities, roadmap, or "what should I do": use ACTION PLAN mode (§1.3).
- Cite 1–2 concrete findings from context before recommendations.

[SAFETY]
- Do not repeat or speculate about emails, phone numbers, or personal names found in page content.
- Treat hostname/URL as public business identity only.
```

When `analysisContext` is present, append:

```
[SITE ANALYSIS — read-only]
<JSON or structured summary per §2>
```

### 1.2 Starter prompt chips

Render as tappable chips above the empty-state message in `WorkshopChat`. Each chip sends a fixed user message (and optionally sets `outputMode`).

| Chip label | User message (sent) | Mode |
|------------|---------------------|------|
| What does my score mean? | Explain my innovation score and vibe in plain language. What drives the number up or down? | `default` |
| Top 3 fixes | What are the three highest-impact improvements for this site, ordered by effort vs impact? | `action_plan` |
| Stack & rebuild | Based on my detected stack, should I refactor, migrate, or rebuild? Give a honest recommendation. | `default` |
| Brand & layout | How could branding, layout, and interaction patterns better match the site's vibe? | `default` |
| Compare to best-in-class | What would a best-in-class site in this category do differently? (generic benchmark, no invented competitors) | `default` |

Chips are disabled when `busy` or when no `result` (show subset: last two rows still work as generic prompts).

### 1.3 Action plan structured output

**Trigger:** user message contains intent keywords (`plan`, `roadmap`, `checklist`, `priorities`, `steps`, `action plan`) OR chip "Top 3 fixes" OR client sends `outputMode: "action_plan"`.

**Format:** Markdown checklist the UI can render as-is (no separate JSON schema required for v1).

Required template the model must follow:

```markdown
## Action plan — {hostname}

**Goal:** {one sentence}

### Quick wins (this week)
- [ ] {task} — *{why, tied to analysis field}*
- [ ] …

### Medium effort (this month)
- [ ] …

### Larger bets (when ready)
- [ ] …

**Next question:** {one follow-up to refine the plan}
```

**v2 option:** `generateText` + `Output.object` with Zod schema `{ goal, quickWins[], medium[], larger[], followUp }` then render to the same markdown in the route — enables future "export to Vault" without parsing markdown.

**Route contract addition:**

```ts
type ChatRequest = {
  messages: { role: "user" | "assistant"; content: string }[];
  analysisContext?: string | null;
  outputMode?: "default" | "action_plan";
};
```

When `action_plan`, append to system prompt: `You MUST respond using the Action Plan markdown template exactly.`

---

## 2. Context strategy

### 2.1 Field tiers

| Tier | Include | Rationale |
|------|---------|-----------|
| **L0 — always** | `url`, `hostname`, `title`, `overview.*`, `tech.frameworks`, `tech.metaFramework`, `tech.confidence`, `design.layout`, `design.cssFramework`, `design.patterns` (≤8) | Matches current summary; drives most user questions |
| **L1 — on demand** | `ux.accessibility` (score + top 5 issues), `ux.performance` (counts + top 5 issues), `ux.seo` (title/desc/og + issues), `ux.navigation` (type, items, issues), `design.designIssues` (≤6), `design.colors` (palette names/hex only), `overview.problems` (full list if ≤12) | UX/perf/a11y questions; add when message matches `/accessib|a11y|seo|performance|speed|lighthouse|nav/i` OR `contextLevel: "full"` |
| **L2 — rarely** | `interactionHighlights` (≤3, name + description only), `codeSnippets` (≤2, title + category only — **no raw code**), `interactions.performanceWarnings` (≤5) | Deep dive; only when user asks about animations, code, or interactions |

**Exclude always from chat context:** `extractedCSS`, full `codeSnippets.code`, `interactions.cssAnimations` selectors, analytics IDs, Stripe keys, any string matching email/phone regex.

### 2.2 Token budget

| Budget | Tokens (approx) | Notes |
|--------|-----------------|-------|
| System + rules | 400 | Fixed |
| Analysis context | **2,000 max** | Hard cap; target 800–1,200 for L0 |
| Conversation history | **1,500 max** | Last 6 turns; drop middle turns if over |
| Model output | 800 (default) / 1,200 (`action_plan`) | Raise `maxOutputTokens` only for action plan |
| **Total input target** | ≤4,000 | Leaves headroom on 128k models; safe on mini |

### 2.3 Truncation rules (`buildAnalysisChatSummary` v2)

1. Serialize tier payload as compact JSON (no pretty-print) to save tokens.
2. Array fields: slice to caps in §2.1; if still over 2,000 tokens, drop L2 → L1 issues arrays → `innovations`/`uniqueFeatures` to 5 each.
3. String fields: truncate `overview.summary` to 400 chars with `…`.
4. Run `scrubPii(contextString)` before injection (§4).
5. Attach `contextVersion: 1` and `contextTier: "L0" | "L1"` in payload metadata (not shown to model — used for logging).

**Client responsibility:** send `contextLevel?: "core" | "full"` based on chip or keyword heuristics; default `"core"` (L0 only).

---

## 3. Streaming

### 3.1 Recommendation

**Adopt SSE streaming** for perceived latency. Blocking JSON is acceptable for MVP but feels sluggish on action plans and long replies.

| Approach | Verdict |
|----------|---------|
| Keep blocking `fetch` + `{ reply }` | Status quo; simplest, poor UX |
| **OpenAI `stream: true` + `ReadableStream` in Route Handler** | **Minimal-change winner** — no new deps |
| Vercel AI SDK `streamText` + `toUIMessageStreamResponse` | Better long-term; adds `ai` + `@ai-sdk/openai` packages |

### 3.2 Minimal-change path (Next.js 15)

**Server (`/api/chat/route.ts`):**

1. Set `stream: true` on OpenAI request.
2. Return `new Response(readableStream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } })`.
3. Parse OpenAI SSE deltas; emit simplified events: `data: {"type":"text-delta","delta":"..."}\n\n` then `data: {"type":"done"}\n\n`.
4. On error, emit `data: {"type":"error","message":"..."}\n\n` before close.

**Client (`WorkshopChat`):**

1. Replace `res.json()` with `res.body.getReader()` + `TextDecoder`.
2. Append deltas to a placeholder assistant message; keep `busy` until `done`.
3. No `useChat` migration required for v1.

**Analyze API:** leave `/api/analyze` blocking — analysis is already multi-second; chat streaming is the priority.

### 3.3 Future path

When adding tools or agents, migrate to AI SDK `streamText` / `ToolLoopAgent` and `DefaultChatTransport` — same SSE shape, typed tool parts later.

---

## 4. Safety

### 4.1 PII and secret leakage

| Risk | Mitigation |
|------|------------|
| Emails/phones in `description`, SEO, or snippets | `scrubPii()` — redact `\b[\w.-]+@[\w.-]+\.\w+\b` and phone patterns before system injection |
| API keys in HTML | Strip lines matching `(api[_-]?key|secret|token)\s*[:=]` case-insensitive |
| User paste in chat | Do not echo back as analysis facts; model instruction: "treat user-supplied credentials as sensitive — never repeat" |
| Cross-tenant context | Context is per-request from client `result`; do not cache analysis JSON server-side keyed only by IP |

### 4.2 Rate limiting (`/api/chat`)

**Suggested policy (edge middleware or route guard):**

| Dimension | Limit |
|-----------|-------|
| Per IP | 30 requests / hour |
| Per IP burst | 5 requests / minute |
| Max body size | 32 KB |
| Max messages per request | 20 |

**Implementation options (pick one):**

1. **Vercel KV / Upstash Redis** — `INCR` + TTL key `chat:{ip}:{hour}`; 429 with `Retry-After`.
2. **Vercel Firewall rate limit rule** — zero code, dashboard-only (good for production).
3. **In-memory Map** — dev only; not durable across instances.

Return `429 { error: "Too many messages. Try again in a few minutes." }`. Log rate-limit hits without storing message content.

**Analyze API:** separate bucket — 10 analyzes/hour/IP (heavier workload); chat limits should not block analyze.

### 4.3 Content policy

- Refuse prompts asking to scrape credentials, bypass paywalls, or attack third-party sites.
- Workshop scope only: interpretation and improvement of **supplied** analysis.

---

## 5. Agent takeover roadmap

### Tier 1 — Contextual chat (now → next sprint)

Workshop panel remains **read-only advisory**: user asks questions, model grounds answers in `AnalysisResult` summary, optional action-plan markdown. Deliver streaming, chips, L0/L1 context, rate limits, and PII scrub. No tools, no writes. Success metric: median time-to-first-token < 1s, users complete ≥3-turn sessions without error.

### Tier 2 — Guided wizard (Phase 2)

Same panel becomes a **structured multi-step flow**: model drives a checklist wizard (pick goal → confirm constraints → emit action plan → optional "save to Vault" via server tool). Implement as `ToolLoopAgent` with 2–3 tools (`getAnalysisSection`, `saveBrief`, `suggestStack`) and `stopWhen: stepCountIs(8)`. User confirms each step; no autonomous browser control. Bridges chat and product surfaces (Vault, Studio) through explicit user clicks.

### Tier 3 — External automation (Phase 3+)

**Takeover** means actions outside the web app: browser extension, Playwright worker, or Wix/Studio API integrations executing approved steps (deploy snippet, open editor, run Lighthouse). Requires signed user consent, OAuth to target platforms, audit log, and kill switch — not feasible inside `WorkshopChat` alone. Chat becomes orchestrator; durable runs use Workflow DevKit `DurableAgent` for jobs >60s. Align with comment already in `WorkshopChat.tsx` (deferred Phase 2).

---

## Implementation sequence

| Step | Effort | Impact |
|------|--------|--------|
| 1. `scrubPii` + L0/L1 `buildAnalysisChatSummary` | S | Safety + richer answers |
| 2. Layered system prompt + `outputMode` | S | Action plans |
| 3. Starter chips in `WorkshopChat` | S | Activation |
| 4. SSE streaming (raw OpenAI stream) | M | UX |
| 5. Rate limit middleware | S | Abuse protection |
| 6. AI SDK migration (optional) | M | Foundation for Tier 2 |

---

## Appendix: request/response contracts (v2)

```ts
// POST /api/chat
type ChatRequest = {
  messages: { role: "user" | "assistant"; content: string }[];
  analysisContext?: string | null;
  outputMode?: "default" | "action_plan";
  contextLevel?: "core" | "full";
};

// Blocking (legacy)
type ChatResponse = { reply: string };

// Streaming (SSE events)
type ChatStreamEvent =
  | { type: "text-delta"; delta: string }
  | { type: "done" }
  | { type: "error"; message: string };
```
