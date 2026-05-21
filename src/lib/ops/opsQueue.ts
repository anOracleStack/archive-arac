import { readVaultJson, writeVaultJson } from "@/lib/server/vaultStorage";

const OPS_CLIENT = "__ops__";
const QUEUE_FILE = "fulfillment-queue.json";

export type OpsEventType = "registrar" | "hosting" | "payment";

export interface OpsEvent {
  id: string;
  type: OpsEventType;
  createdAt: string;
  clientId: string;
  lockId: string;
  orderId?: string;
  summary: string;
  details: Record<string, string>;
}

export async function appendOpsEvent(
  event: Omit<OpsEvent, "id" | "createdAt">
): Promise<void> {
  const queue = await readVaultJson<OpsEvent[]>(OPS_CLIENT, QUEUE_FILE, []);
  const entry: OpsEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await writeVaultJson(OPS_CLIENT, QUEUE_FILE, [entry, ...queue].slice(0, 200));
}
