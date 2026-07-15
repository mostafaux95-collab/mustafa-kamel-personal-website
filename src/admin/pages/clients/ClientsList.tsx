import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";

interface ClientItem {
  id: string;
  name: string;
  category: string | null;
  status: "DRAFT" | "PUBLISHED";
}

export default function ClientsList() {
  return (
    <EntityList<ClientItem>
      title="Clients"
      basePath="/admin/clients"
      permissionKey="clients"
      searchPlaceholder="Search clients…"
      matchesSearch={(c, s) => c.name.toLowerCase().includes(s.toLowerCase())}
      columns={[
        { header: "Name", render: (c) => c.name },
        { header: "Category", render: (c) => <span className="text-ink/60">{c.category ?? "—"}</span> },
        {
          header: "Status",
          render: (c) => (
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                c.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-ink/[0.06] text-ink/50",
              )}
            >
              {c.status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          ),
        },
      ]}
    />
  );
}
