import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api, setAccessToken } from "./api";

export type AdminRole = "SUPER_ADMIN" | "EDITOR" | "VIEWER";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: AdminUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>("loading");

  // On mount, try to silently restore a session from the httpOnly refresh
  // cookie — this is what makes a page reload not force a re-login.
  useEffect(() => {
    (async () => {
      const refreshed = await api.refresh();
      if (!refreshed) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const me = await api.get<AdminUser>("/users/me");
        setUser(me);
        setStatus("authenticated");
      } catch {
        setStatus("unauthenticated");
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post<{ accessToken: string; user: AdminUser }>("/auth/login", {
      email,
      password,
    });
    setAccessToken(res.accessToken);
    setUser(res.user);
    setStatus("authenticated");
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — we're clearing local state regardless
    }
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

// Route-level permission check, mirroring the backend's seeded permission
// keys (see server/prisma/seed.ts) so the UI hides actions a role can't
// perform rather than letting them hit a 403.
const CONTENT_ENTITIES = ["projects", "testimonials", "clients", "services", "skills", "experience", "media"];
const CONTENT_READ = CONTENT_ENTITIES.map((e) => `${e}:read`);
const CONTENT_WRITE = CONTENT_ENTITIES.map((e) => `${e}:write`);

const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: [
    "users:invite",
    "users:read",
    "users:write",
    "settings:manage",
    ...CONTENT_READ,
    ...CONTENT_WRITE,
  ],
  EDITOR: [...CONTENT_READ, ...CONTENT_WRITE],
  VIEWER: [...CONTENT_READ],
};

export function useHasPermission(permission: string) {
  const { user } = useAdminAuth();
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role].includes(permission);
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAdminAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-[var(--color-accent)]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
