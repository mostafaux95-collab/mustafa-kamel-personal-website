import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FolderKanban,
  Quote,
  Building2,
  Wrench,
  Sparkles,
  Briefcase,
  Inbox,
  LogOut,
  Moon,
  Sun,
  Languages,
} from "lucide-react";
import { api } from "@/admin/lib/api";
import { useAdminAuth } from "@/admin/lib/auth";
import { useAdminLang } from "@/admin/lib/adminI18n";
import { useTheme } from "@/lib/theme";
import clsx from "clsx";

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const { theme, toggle } = useTheme();
  const { t, toggle: toggleLang } = useAdminLang();

  const { data: messages } = useQuery({
    queryKey: ["admin", "messages", "unread-count"],
    queryFn: () => api.get<{ unread: number }>("/admin/messages?pageSize=1"),
    refetchInterval: 60_000,
  });

  const NAV = [
    { to: "/admin", label: t.nav.dashboard, icon: LayoutDashboard, end: true },
    { to: "/admin/projects", label: t.nav.projects, icon: FolderKanban, end: false },
    { to: "/admin/testimonials", label: t.nav.testimonials, icon: Quote, end: false },
    { to: "/admin/clients", label: t.nav.clients, icon: Building2, end: false },
    { to: "/admin/services", label: t.nav.services, icon: Wrench, end: false },
    { to: "/admin/skills", label: t.nav.skills, icon: Sparkles, end: false },
    { to: "/admin/experience", label: t.nav.experience, icon: Briefcase, end: false },
    {
      to: "/admin/messages",
      label: t.nav.messages,
      icon: Inbox,
      end: false,
      badge: messages?.unread,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)] text-ink">
      <aside className="flex w-64 shrink-0 flex-col border-e border-ink/[0.08] bg-[var(--color-card)]">
        <div className="flex h-16 shrink-0 items-center border-b border-ink/[0.08] px-6">
          <span className="font-display text-sm font-semibold tracking-tight">
            Mustafa Kamel <span className="text-ink/40">/ {t.layout.admin}</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-ink/60 hover:bg-ink/[0.04] hover:text-ink",
                )
              }
            >
              <item.icon size={17} />
              <span className="flex-1">{item.label}</span>
              {!!item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 text-[11px] font-semibold text-[#1a0f10]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="shrink-0 border-t border-ink/[0.08] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15 font-display text-sm font-semibold text-[var(--color-accent)]">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-ink">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="truncate text-xs text-ink/45">{user?.role}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink/10 py-2 text-xs font-medium text-ink/60 transition-colors hover:text-ink"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {t.layout.theme}
            </button>
            <button
              onClick={toggleLang}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink/10 py-2 text-xs font-medium text-ink/60 transition-colors hover:text-ink"
            >
              <Languages size={14} />
              {t.layout.language}
            </button>
          </div>
          <button
            onClick={() => logout()}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-ink/10 py-2 text-xs font-medium text-ink/60 transition-colors hover:text-ink"
          >
            <LogOut size={14} />
            {t.layout.signOut}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
