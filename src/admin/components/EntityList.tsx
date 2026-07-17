import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { api } from "@/admin/lib/api";
import { useHasPermission } from "@/admin/lib/auth";
import { useAdminLang } from "@/admin/lib/adminI18n";
import { useConfirm } from "@/admin/lib/confirm";

export interface EntityListColumn<T> {
  header: string;
  render: (item: T) => ReactNode;
}

interface ListResult<T> {
  items: T[];
  total: number;
}

// Generic admin list table shared by every "flat" content entity
// (Testimonials, Clients, Services, Skills, Experience) — Projects keeps
// its own richer list page since it has status badges/featured stars
// baked into a specific layout, but the underlying data flow here is
// identical: fetch, optionally search client-side, delete with confirm.
export function EntityList<T extends { id: string }>({
  title,
  basePath,
  permissionKey,
  columns,
  searchPlaceholder,
  matchesSearch,
}: {
  title: string;
  basePath: string; // e.g. "/admin/testimonials" and "/admin/testimonials" api path suffix
  permissionKey: string; // e.g. "testimonials"
  columns: EntityListColumn<T>[];
  searchPlaceholder?: string;
  matchesSearch?: (item: T, search: string) => boolean;
}) {
  const [search, setSearch] = useState("");
  const canWrite = useHasPermission(`${permissionKey}:write`);
  const queryClient = useQueryClient();
  const { t } = useAdminLang();
  const confirm = useConfirm();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", permissionKey, "list"],
    queryFn: () => api.get<ListResult<T>>(`/admin/${permissionKey}?pageSize=100`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/${permissionKey}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", permissionKey] }),
  });

  const items = (data?.items ?? []).filter((item) =>
    matchesSearch ? matchesSearch(item, search) : true,
  );

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-ink/50">
            {data?.total ?? 0} {t.common.total}
          </p>
        </div>
        {canWrite && (
          <Link
            to={`${basePath}/new`}
            className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-display text-sm font-semibold text-[#1a0f10]"
          >
            <Plus size={16} />
            {t.common.new}
          </Link>
        )}
      </div>

      {matchesSearch && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder ?? t.common.search}
          className="mt-6 w-full max-w-sm rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-[var(--color-accent)] focus:outline-none"
        />
      )}

      <div className={clsx("overflow-hidden rounded-2xl border border-ink/[0.08]", matchesSearch ? "mt-6" : "mt-6")}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/[0.08] bg-[var(--color-card)] text-start text-xs uppercase tracking-widest text-ink/45">
              {columns.map((c) => (
                <th key={c.header} className="px-5 py-3 text-start font-medium">
                  {c.header}
                </th>
              ))}
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-ink/40">
                  {t.common.loading}
                </td>
              </tr>
            )}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-ink/40">
                  {t.common.empty}
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-b border-ink/[0.06] last:border-0 hover:bg-ink/[0.02]">
                {columns.map((c, i) => (
                  <td key={c.header} className="px-5 py-3.5">
                    {i === 0 && canWrite ? (
                      <Link
                        to={`${basePath}/${item.id}`}
                        className="font-medium text-ink hover:text-[var(--color-accent)]"
                      >
                        {c.render(item)}
                      </Link>
                    ) : (
                      c.render(item)
                    )}
                  </td>
                ))}
                <td className="px-5 py-3.5 text-end">
                  {canWrite && (
                    <button
                      onClick={async () => {
                        if (await confirm(t.common.deleteConfirm)) deleteMutation.mutate(item.id);
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
