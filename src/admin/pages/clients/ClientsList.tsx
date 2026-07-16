import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface ClientItem {
  id: string;
  name: string;
  category: string | null;
  status: "DRAFT" | "PUBLISHED";
}

export default function ClientsList() {
  const { t: ui } = useAdminLang();
  return (
    <EntityList<ClientItem>
      title={ui.nav.clients}
      basePath="/admin/clients"
      permissionKey="clients"
      searchPlaceholder={ui.common.search}
      matchesSearch={(c, s) => c.name.toLowerCase().includes(s.toLowerCase())}
      columns={[
        { header: ui.lists.name, render: (c) => c.name },
        { header: ui.lists.category, render: (c) => <span className="text-ink/60">{c.category ?? "—"}</span> },
        {
          header: ui.common.status,
          render: (c) => (
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                c.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-ink/[0.06] text-ink/50",
              )}
            >
              {c.status === "PUBLISHED" ? ui.common.published : ui.common.draft}
            </span>
          ),
        },
      ]}
    />
  );
}
