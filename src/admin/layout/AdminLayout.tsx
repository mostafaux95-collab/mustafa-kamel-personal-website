import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, FolderKanban, LogOut, Moon, Sun } from "lucide-react";
import { useAdminAuth } from "@/admin/lib/auth";
import { useTheme } from "@/lib/theme";
import clsx from "clsx";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, end: false },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-ink">
      <aside className="flex w-64 shrink-0 flex-col border-e border-ink/[0.08] bg-[var(--color-card)]">
        <div className="flex h-16 items-center border-b border-ink/[0.08] px-6">
          <span className="font-display text-sm font-semibold tracking-tight">
            Mustafa Kamel <span className="text-ink/40">/ Admin</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
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
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink/[0.08] p-4">
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
              Theme
            </button>
            <button
              onClick={() => logout()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink/10 py-2 text-xs font-medium text-ink/60 transition-colors hover:text-ink"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
