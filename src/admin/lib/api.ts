const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
// The origin without the /api suffix — MediaAsset.url is stored as a path
// relative to this (e.g. "/uploads/xxx.jpg"), served outside the /api
// prefix (see server/src/main.ts's useStaticAssets call).
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function getAssetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}

// Access token lives in memory only (never localStorage) — the refresh
// token is an httpOnly cookie the browser handles automatically. On a
// fresh page load there's no access token yet; AuthProvider calls
// refresh() once on mount to silently restore the session from the cookie.
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ZodIssue {
  path?: (string | number)[];
  message?: string;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ZodIssue[];
}

// nestjs-zod collapses every field-level validation error into a single
// generic "Validation failed" message and puts the actual per-field
// issues in a separate `errors` array — surface those here instead, so
// e.g. "slug: Slug must be lowercase, hyphen-separated" shows up rather
// than a message that doesn't say which field or why.
function formatErrorMessage(body: Envelope<unknown> | null, status: number): string {
  if (body?.errors?.length) {
    return body.errors
      .map((issue) => {
        const field = issue.path?.join(".");
        return field ? `${field}: ${issue.message}` : issue.message;
      })
      .filter(Boolean)
      .join("; ");
  }
  return body?.message ?? `Request failed (${status})`;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  // De-dupe concurrent 401s (e.g. several requests firing at once) into a
  // single refresh call instead of racing multiple rotations.
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const body = (await res.json()) as Envelope<{ accessToken: string }>;
        if (body.data?.accessToken) {
          setAccessToken(body.data.accessToken);
          return true;
        }
        return false;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const headers = new Headers(options.headers);
  // Let the browser set Content-Type (with the multipart boundary) itself
  // when uploading FormData — setting it manually breaks the boundary.
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && !isRetry && !path.startsWith("/auth/")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, options, true);
    setAccessToken(null);
    throw new ApiError("Session expired", 401);
  }

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || !body?.success) {
    throw new ApiError(formatErrorMessage(body, res.status), res.status);
  }

  return body.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", body: formData }),
  refresh: refreshAccessToken,
};
