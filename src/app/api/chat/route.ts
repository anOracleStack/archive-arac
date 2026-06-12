import { NextRequest, NextResponse } from "next/server";
import { scrubPii, scrubMessages } from "@/lib/scrubPii";
import { checkChatRateLimit, getClientIp } from "@/lib/rateLimit";

const SYSTEM_PROMPT = `You are a helpful workshop guide for Archive Arac — a platform for understanding and improving digital real estate (websites, branding, domains, and build choices).

Tone: plain, practical, encouraging. Avoid jargon unless the user seems technical.

You can discuss:
- Interpreting site analysis results (scores, stack, UX, accessibility, performance)
- Prioritized improvements and quick wins
- Branding, layout, and interaction ideas
- How to choose tools, frameworks, and next steps

When analysis context is provided, reference it specifically. If no context is given, answer general questions about sites and digital presence.

Keep replies concise (2–4 short paragraphs or a brief bullet list). Do not invent analysis data that was not supplied.
Do not repeat or speculate about emails, phone numbers, or personal names found in page content.`;

const ACTION_PLAN_JSON_HINT = `Respond with ONLY valid JSON (no markdown prose) matching this schema:
{
  "goal": "one sentence",
  "quickWins": [{ "task": "...", "why": "...", "effort": "S|M|L" }],
  "medium": [{ "task": "...", "why": "...", "effort": "S|M|L" }],
  "larger": [{ "task": "...", "why": "...", "effort": "S|M|L" }],
  "firstMove": "one concrete step for today"
}
Include 2–4 items per array. Tie each "why" to analysis fields.`;

const ACTION_PLAN_MARKDOWN_HINT = `Respond with a numbered action plan using markdown headings:
## Action plan
### Quick wins (this week)
- [ ] task — *why*
### Medium effort (this month)
- [ ] ...
### Larger bets (when ready)
- [ ] ...
End with **First move today:** one sentence.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function wantsJsonActionPlan(formatHint: string | null): boolean {
  return !!formatHint?.includes("JSON");
}

function buildSystemContent(
  analysisContext: string | null,
  formatHint: string | null
): string {
  const parts = [SYSTEM_PROMPT];
  if (analysisContext) {
    parts.push(`\nCurrent site analysis (JSON):\n${scrubPii(analysisContext)}`);
  }
  if (formatHint) {
    parts.push(`\nFormat instruction: ${formatHint}`);
  }
  return parts.join("");
}

function rateLimitResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Too many messages. Try again in a few minutes." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}

async function openAIStream(
  apiKey: string,
  systemContent: string,
  messages: ChatMessage[],
  maxTokens: number
): Promise<Response> {
  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: systemContent }, ...messages],
      temperature: 0.7,
      max_tokens: maxTokens,
      stream: true,
    }),
  });

  if (!upstream.ok) {
    const data = await upstream.json().catch(() => ({}));
    const detail = data?.error?.message || "Upstream chat request failed";
    return NextResponse.json({ error: detail }, { status: upstream.status });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body?.getReader();
      if (!reader) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: "No stream body" })}\n\n`
          )
        );
        controller.close();
        return;
      }

      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "text-delta", delta })}\n\n`
                  )
                );
              }
            } catch {
              /* skip malformed SSE chunk */
            }
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Stream failed";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured. Set OPENAI_API_KEY in your environment." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const limited = checkChatRateLimit(ip);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

  try {
    const rawBody = await request.text();
    if (rawBody.length > 32_000) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }

    const body = JSON.parse(rawBody) as {
      messages?: ChatMessage[];
      analysisContext?: string | null;
      formatHint?: string | null;
      stream?: boolean;
    };

    const messages = body.messages;
    const analysisContext =
      typeof body.analysisContext === "string" ? body.analysisContext : null;
    const formatHint = typeof body.formatHint === "string" ? body.formatHint : null;
    const useStream = body.stream !== false;

    if (!messages?.length) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }
    if (messages.length > 20) {
      return NextResponse.json({ error: "Too many messages in one request" }, { status: 400 });
    }

    const scrubbed = scrubMessages(messages).slice(-12);
    const actionPlan = !!formatHint;
    const jsonPlan = wantsJsonActionPlan(formatHint);
    const resolvedHint = actionPlan
      ? jsonPlan
        ? ACTION_PLAN_JSON_HINT
        : ACTION_PLAN_MARKDOWN_HINT
      : formatHint;

    const systemContent = buildSystemContent(analysisContext, resolvedHint);
    const maxTokens = actionPlan ? 1200 : 800;

    if (useStream) {
      return openAIStream(apiKey, systemContent, scrubbed, maxTokens);
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: systemContent }, ...scrubbed],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const detail = data?.error?.message || "Upstream chat request failed";
      return NextResponse.json({ error: detail }, { status: res.status });
    }

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Chat request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
