export type StoredChatMessage = {
  role: "user" | "assistant";
  content: string;
  actionPlan?: boolean;
  actionPlanData?: ActionPlanPayload | null;
};

export type ActionPlanItem = {
  task: string;
  why: string;
  effort: "S" | "M" | "L";
};

export type ActionPlanPayload = {
  goal: string;
  quickWins: ActionPlanItem[];
  medium: ActionPlanItem[];
  larger: ActionPlanItem[];
  firstMove: string;
};

const THREAD_KEY = "archive-arac:workshop-thread";

function threadKey(hostname: string): string {
  return `${THREAD_KEY}:${hostname}`;
}

export function loadWorkshopThread(hostname: string): StoredChatMessage[] | null {
  if (typeof window === "undefined" || !hostname) return null;
  try {
    const raw = sessionStorage.getItem(threadKey(hostname));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredChatMessage[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveWorkshopThread(
  hostname: string,
  messages: StoredChatMessage[]
): void {
  if (typeof window === "undefined" || !hostname) return;
  try {
    sessionStorage.setItem(threadKey(hostname), JSON.stringify(messages));
  } catch {
    /* quota */
  }
}

export function clearWorkshopThread(hostname: string): void {
  if (typeof window === "undefined" || !hostname) return;
  try {
    sessionStorage.removeItem(threadKey(hostname));
  } catch {
    /* ignore */
  }
}

/** Safely parse action-plan JSON from assistant text (fenced or raw). */
export function parseActionPlanPayload(text: string): ActionPlanPayload | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  try {
    const data = JSON.parse(candidate) as Partial<ActionPlanPayload>;
    if (!data.goal || !Array.isArray(data.quickWins)) return null;
    const norm = (items: unknown): ActionPlanItem[] => {
      if (!Array.isArray(items)) return [];
      return items
        .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
        .map((x) => ({
          task: String(x.task ?? ""),
          why: String(x.why ?? ""),
          effort: (["S", "M", "L"].includes(String(x.effort))
            ? String(x.effort)
            : "M") as ActionPlanItem["effort"],
        }))
        .filter((x) => x.task);
    };
    return {
      goal: String(data.goal),
      quickWins: norm(data.quickWins),
      medium: norm(data.medium),
      larger: norm(data.larger),
      firstMove: String(data.firstMove ?? ""),
    };
  } catch {
    return null;
  }
}
