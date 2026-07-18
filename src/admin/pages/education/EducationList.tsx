import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  years: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function EducationList() {
  const { t: ui } = useAdminLang();
  return (
    <EntityList<EducationItem>
      title={ui.nav.education}
      basePath="/admin/education"
      permissionKey="education"
      searchPlaceholder={ui.common.search}
      matchesSearch={(e, q) => `${e.degree} ${e.school}`.toLowerCase().includes(q.toLowerCase())}
      columns={[
        { header: ui.lists.degree, render: (e) => e.degree },
        { header: ui.lists.school, render: (e) => <span className="text-ink/60">{e.school}</span> },
        { header: ui.lists.years, render: (e) => <span className="text-ink/60">{e.years}</span> },
        {
          header: ui.common.status,
          render: (e) => (
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                e.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-ink/[0.06] text-ink/50",
              )}
            >
              {e.status === "PUBLISHED" ? ui.common.published : ui.common.draft}
            </span>
          ),
        },
      ]}
    />
  );
}
