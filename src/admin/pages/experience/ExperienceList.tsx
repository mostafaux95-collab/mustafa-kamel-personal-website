import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function ExperienceList() {
  return (
    <EntityList<ExperienceItem>
      title="Experience"
      basePath="/admin/experience"
      permissionKey="experience"
      searchPlaceholder="Search experience…"
      matchesSearch={(e, q) => `${e.company} ${e.role}`.toLowerCase().includes(q.toLowerCase())}
      columns={[
        { header: "Company", render: (e) => e.company },
        { header: "Role", render: (e) => <span className="text-ink/60">{e.role}</span> },
        { header: "Period", render: (e) => <span className="text-ink/60">{e.period}</span> },
        {
          header: "Status",
          render: (e) => (
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                e.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-ink/[0.06] text-ink/50",
              )}
            >
              {e.status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          ),
        },
      ]}
    />
  );
}
