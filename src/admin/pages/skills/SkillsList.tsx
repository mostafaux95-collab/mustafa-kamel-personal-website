import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function SkillsList() {
  const { t: ui } = useAdminLang();
  return (
    <EntityList<SkillItem>
      title="Skills"
      basePath="/admin/skills"
      permissionKey="skills"
      searchPlaceholder="Search skills…"
      matchesSearch={(s, q) => `${s.name} ${s.category}`.toLowerCase().includes(q.toLowerCase())}
      columns={[
        { header: "Name", render: (s) => s.name },
        { header: "Category", render: (s) => <span className="text-ink/60">{s.category}</span> },
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
