/* ───────── Translation Service ───────── */

export async function googleTranslate(text: string, target: string, source = "en"): Promise<string> {
  if (!text || target === source) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = (await res.json()) as [Array<[string, string]>, ...unknown[]];
    return (data?.[0] || []).map((s) => s[0]).join("");
  } catch {
    return text;
  }
}

/* ───────── Pending Message Service ───────── */

export const PENDING_KEY = "reko_pending_message";

export type PendingMessage = { text: string; askedAt: number };

export function getPendingMessage(): PendingMessage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPendingMessage(text: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_KEY, JSON.stringify({ text, askedAt: Date.now() }));
}

export function clearPendingMessage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_KEY);
}