import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a helpful workshop guide for Archive Arac — a platform for understanding and improving digital real estate (websites, branding, domains, and build choices).

Tone: plain, practical, encouraging. Avoid jargon unless the user seems technical.

You can discuss:
- Interpreting site analysis results (scores, stack, UX, accessibility, performance)
- Prioritized improvements and quick wins
- Branding, layout, and interaction ideas
- How to choose tools, frameworks, and next steps

When analysis context is provided, reference it specifically. If no context is given, answer general questions about sites and digital presence.

Keep replies concise (2–4 short paragraphs or a brief bullet list). Do not invent analysis data that was not supplied.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chat is not configured. Set OPENAI_API_KEY in your environment." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const messages = body.messages as ChatMessage[] | undefined;
    const analysisContext = typeof body.analysisContext === "string" ? body.analysisContext : null;
    const formatHint = typeof body.formatHint === "string" ? body.formatHint : null;

    if (!messages?.length) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const systemContent = [
      analysisContext
        ? `${SYSTEM_PROMPT}\n\nCurrent site analysis (JSON):\n${analysisContext}`
        : SYSTEM_PROMPT,
      formatHint ? `\nFormat instruction: ${formatHint}` : "",
    ]
      .filter(Boolean)
      .join("");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: systemContent }, ...messages],
        temperature: 0.7,
        max_tokens: 800,
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
