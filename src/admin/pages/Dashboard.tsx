import { useQuery } from "@tanstack/react-query";
import { FolderKanban } from "lucide-react";
import { api } from "@/admin/lib/api";
import { useAdminAuth } from "@/admin/lib/auth";

interface ProjectListResult {
  items: unknown[];
  total: number;
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const { data } = useQuery({
    queryKey: ["admin", "projects", "count"],
    queryFn: () => api.get<ProjectListResult>("/admin/projects?pageSize=1"),
  });

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Welcome back, {user?.firstName}
      </h1>
      <p className="mt-1 text-sm text-ink/50">Here's what's happening with your site.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
            <FolderKanban size={18} className="text-[var(--color-accent)]" />
          </div>
          <div className="mt-4 font-display text-3xl font-semibold text-ink">
            {data?.total ?? "—"}
          </div>
          <div className="mt-1 text-sm text-ink/50">Projects</div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-ink/[0.12] p-8 text-center text-sm text-ink/40">
        More modules (Case Studies, Testimonials, Services, Blog, Media Library) land here as
        Phase 2 continues.
      </div>
    </div>
  );
}
