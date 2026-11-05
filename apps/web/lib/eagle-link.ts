/** A small, validated protocol shared by the console and its story tab. */
export const EAGLE_CHANNEL = "eagle_mission_link";
const STORAGE_KEY = "tls:eagle:message";

export type EagleMessage = {
  type: "SCENE_PROGRESS" | "STORY_COMPLETED" | "STORY_CLOSED" | "STATUS_REQUEST";
  session: string;
  machineId: "apollo-11-lander";
  scene?: number;
  total?: number;
  title?: string;
};

export function isEagleMessage(value: unknown): value is EagleMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  if (m.machineId !== "apollo-11-lander" || typeof m.session !== "string") return false;
  if (!["SCENE_PROGRESS", "STORY_COMPLETED", "STORY_CLOSED", "STATUS_REQUEST"].includes(String(m.type))) return false;
  return m.type !== "SCENE_PROGRESS" || (
    Number.isInteger(m.scene) && Number.isInteger(m.total) &&
    Number(m.scene) >= 1 && Number(m.scene) <= Number(m.total) && Number(m.total) <= 100 &&
    typeof m.title === "string"
  );
}

export function connectEagle(onMessage: (message: EagleMessage) => void) {
  let channel: BroadcastChannel | null = null;
  try { channel = new BroadcastChannel(EAGLE_CHANNEL); } catch { /* Storage events are the fallback. */ }
  const received = new Set<string>();
  const receive = (value: unknown) => {
    if (!isEagleMessage(value)) return;
    const { messageId } = value as EagleMessage & { messageId?: string };
    if (messageId && received.has(messageId)) return;
    if (messageId) {
      received.add(messageId);
      if (received.size > 32) received.delete(received.values().next().value!);
    }
    onMessage(value);
  };
  if (channel) channel.onmessage = (event) => receive(event.data);
  const storage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try { receive(JSON.parse(event.newValue)); } catch { /* Ignore unrelated or malformed storage. */ }
  };
  window.addEventListener("storage", storage);
  return {
    send(message: EagleMessage) {
      const payload = { ...message, messageId: crypto.randomUUID() };
      channel?.postMessage(payload);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch { /* A direct return link also works without storage. */ }
    },
    close() { channel?.close(); window.removeEventListener("storage", storage); },
  };
}
