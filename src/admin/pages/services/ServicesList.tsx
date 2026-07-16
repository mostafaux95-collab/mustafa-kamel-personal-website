import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface ServiceItem {
  id: string;
  title: string;
  body: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function ServicesList() {
  const { t: ui } = useAdminLang();
  return (
    <EntityList<ServiceItem>
      title="Services"
      basePath="/admin/services"
      permissionKey="services"
      searchPlaceholder="Search services…"
      matchesSearch={(s, q) => s.title.toLowerCase().includes(q.toLowerCase())}
      columns={[
        { header: "Title", render: (s) => s.title },
        { header: "Body", render: (s) => <span className="line-clamp-1 max-w-md text-ink/60">{s.body}</span> },
        {
          header: "Status",
          render: (s) => (
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                s.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-ink/[0.06] text-ink/50",
              )}
            >
              {s.status === "PUBLISHED" ? ui.common.published : ui.common.draft}
            </span>
          ),
        },
      ]}
    />
  );
}
