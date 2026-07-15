import { useQueries } from "@tanstack/react-query";
import { FolderKanban, Quote, Building2, Wrench, Sparkles, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/admin/lib/api";
import { useAdminAuth } from "@/admin/lib/auth";

interface ListResult {
  total: number;
}

const ENTITIES = [
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "testimonials", label: "Testimonials", icon: Quote },
  { key: "clients", label: "Clients", icon: Building2 },
  { key: "services", label: "Services", icon: Wrench },
  { key: "skills", label: "Skills", icon: Sparkles },
  { key: "experience", label: "Experience", icon: Briefcase },
];

export default function AdminDashboard() {
  const { user } = useAdminAuth();

  const results = useQueries({
    queries: ENTITIES.map((e) => ({
      queryKey: ["admin", e.key, "count"],
      queryFn: () => api.get<ListResult>(`/admin/${e.key}?pageSize=1`),
    })),
  });

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Welcome back, {user?.firstName}
      </h1>
      <p className="mt-1 text-sm text-ink/50">Here's what's happening with your site.</p>

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
        Case Studies, Blog, Media Library, Contact inbox, and Analytics land here as Phase 2
        continues.
      </div>
    </div>
  );
}
