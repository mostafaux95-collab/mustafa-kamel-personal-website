import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface LanguageItem {
  id: string;
  name: string;
  level: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function LanguageList() {
  const { t: ui } = useAdminLang();
  return (
    <EntityList<LanguageItem>
      title={ui.nav.languages}
      basePath="/admin/languages"
      permissionKey="languages"
      searchPlaceholder={ui.common.search}
      matchesSearch={(e, q) => e.name.toLowerCase().includes(q.toLowerCase())}
      columns={[
        { header: ui.lists.name, render: (e) => e.name },
        { header: ui.lists.level, render: (e) => <span className="text-ink/60">{e.level}</span> },
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
