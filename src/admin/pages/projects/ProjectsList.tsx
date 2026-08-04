import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Plus, Star, Trash2 } from "lucide-react";
import clsx from "clsx";
import { api } from "@/admin/lib/api";
import { useHasPermission } from "@/admin/lib/auth";
import { useAdminLang } from "@/admin/lib/adminI18n";
import { useConfirm } from "@/admin/lib/confirm";

interface ProjectListItem {
  id: string;
  slug: string;
  title: string;
  company: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  updatedAt: string;
  sortOrder: number;
}

interface ProjectListResult {
  items: ProjectListItem[];
  total: number;
}

export default function ProjectsList() {
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canWrite = useHasPermission("projects:write");
  const queryClient = useQueryClient();
  const { t } = useAdminLang();
  const confirm = useConfirm();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "projects", "list"],
    queryFn: () => api.get<ProjectListResult>("/admin/projects?pageSize=100"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => api.patch("/admin/projects/reorder", { ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });

  const allItems = data?.items ?? [];
  const items = allItems.filter((p) =>
    `${p.title} ${p.company} ${p.slug}`.toLowerCase().includes(search.toLowerCase()),
  );
  // Row order only maps onto sortOrder when the list isn't filtered — a
  // filtered view's row positions don't correspond to the real global
  // order, so dragging is only meaningful (and only enabled) when search
  // is empty.
  const canReorder = canWrite && search.trim() === "";

  function onDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    const ids = allItems.map((i) => i.id);
    const from = ids.indexOf(draggingId);
    const to = ids.indexOf(targetId);
    ids.splice(from, 1);
    ids.splice(to, 0, draggingId);
    setDraggingId(null);
    reorderMutation.mutate(ids);
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{t.nav.projects}</h1>
          <p className="mt-1 text-sm text-ink/50">
            {data?.total ?? 0} {t.common.total}
          </p>
        </div>
        {canWrite && (
          <Link
            to="/admin/projects/new"
            className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-display text-sm font-semibold text-[#1a0f10]"
          >
            <Plus size={16} />
            {t.common.new}
          </Link>
        )}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.common.search}
        className="mt-6 w-full max-w-sm rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-[var(--color-accent)] focus:outline-none"
      />

      {canReorder && <p className="mt-4 text-xs text-ink/35">{t.common.dragHintRows}</p>}

      <div className="mt-3 overflow-hidden rounded-2xl border border-ink/[0.08]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/[0.08] bg-[var(--color-card)] text-start text-xs uppercase tracking-widest text-ink/45">
              {canReorder && <th className="w-10 px-5 py-3"></th>}
              <th className="px-5 py-3 text-start font-medium">{t.lists.title}</th>
              <th className="px-5 py-3 text-start font-medium">{t.lists.company}</th>
              <th className="px-5 py-3 text-start font-medium">{t.lists.category}</th>
              <th className="px-5 py-3 text-start font-medium">{t.common.status}</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/40">
                  {t.common.loading}
                </td>
              </tr>
            )}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/40">
                  {t.common.empty}
                </td>
              </tr>
            )}
            {items.map((p) => (
              <tr
                key={p.id}
                draggable={canReorder}
                onDragStart={() => setDraggingId(p.id)}
                onDragOver={(e) => canReorder && e.preventDefault()}
                onDrop={() => canReorder && onDrop(p.id)}
                className={clsx(
                  "border-b border-ink/[0.06] last:border-0 hover:bg-ink/[0.02]",
                  draggingId === p.id && "opacity-40",
                )}
              >
                {canReorder && (
                  <td className="px-5 py-3.5 text-ink/30">
                    <GripVertical size={14} className="cursor-grab active:cursor-grabbing" />
                  </td>
                )}
                <td className="px-5 py-3.5">
                  <Link
                    to={canWrite ? `/admin/projects/${p.id}` : "#"}
                    className={clsx(
                      "flex items-center gap-2 font-medium text-ink",
                      canWrite && "hover:text-[var(--color-accent)]",
                    )}
                  >
                    {p.featured && <Star size={13} className="shrink-0 fill-[var(--color-accent)] text-[var(--color-accent)]" />}
                    {p.title}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-ink/60">{p.company}</td>
                <td className="px-5 py-3.5 text-ink/60">{p.category}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      p.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-ink/[0.06] text-ink/50",
                    )}
                  >
                    {p.status === "PUBLISHED" ? t.common.published : t.common.draft}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-end">
                  {canWrite && (
                    <button
                      onClick={async () => {
                        if (await confirm(t.common.deleteConfirm)) deleteMutation.mutate(p.id);
                      }}
                      className="text-ink/35 transition-colors hover:text-red-400"
                      aria-label={t.common.delete}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
