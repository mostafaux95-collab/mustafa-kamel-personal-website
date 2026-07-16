import { useQueries } from "@tanstack/react-query";
import { FolderKanban, Quote, Building2, Wrench, Sparkles, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/admin/lib/api";
import { useAdminAuth } from "@/admin/lib/auth";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface ListResult {
  total: number;
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const { t } = useAdminLang();

  const ENTITIES = [
    { key: "projects", label: t.nav.projects, icon: FolderKanban },
    { key: "testimonials", label: t.nav.testimonials, icon: Quote },
    { key: "clients", label: t.nav.clients, icon: Building2 },
    { key: "services", label: t.nav.services, icon: Wrench },
    { key: "skills", label: t.nav.skills, icon: Sparkles },
    { key: "experience", label: t.nav.experience, icon: Briefcase },
  ];

  const results = useQueries({
    queries: ENTITIES.map((e) => ({
      queryKey: ["admin", e.key, "count"],
      queryFn: () => api.get<ListResult>(`/admin/${e.key}?pageSize=1`),
    })),
  });

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {t.dashboard.welcome}, {user?.firstName}
      </h1>
      <p className="mt-1 text-sm text-ink/50">{t.dashboard.subtitle}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ENTITIES.map((entity, i) => (
          <Link
            key={entity.key}
            to={`/admin/${entity.key}`}
            className="rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] p-6 transition-colors hover:border-[var(--color-accent)]/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
              <entity.icon size={18} className="text-[var(--color-accent)]" />
            </div>
            <div className="mt-4 font-display text-3xl font-semibold text-ink">
              {results[i]?.data?.total ?? "—"}
            </div>
            <div className="mt-1 text-sm text-ink/50">{entity.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-ink/[0.12] p-8 text-center text-sm text-ink/40">
        {t.dashboard.comingSoon}
      </div>
    </div>
  );
}
