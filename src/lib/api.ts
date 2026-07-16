// Public-site data client — hits the backend's @Public() endpoints (no
// auth needed). Separate from src/admin/lib/api.ts, which handles
// authenticated admin CRUD; this one is a thin, unauthenticated wrapper
// for consuming published content and submitting the contact form.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function getAssetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function fetchPublic<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

export async function postPublic<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}
