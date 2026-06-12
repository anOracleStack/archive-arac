export type WeaveSessionStatus = "draft" | "intake_complete";

export interface WeaveChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface WeaveSession {
  id: string;
  savedAt: string;
  businessName: string;
  building: string;
  vibe: string;
  goals: string;
  pages: string;
  status: WeaveSessionStatus;
  messages: WeaveChatMessage[];
}
