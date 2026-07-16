import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface TestimonialItem {
  id: string;
  quote: string;
  role: string;
  company: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function TestimonialsList() {
  const { t: ui } = useAdminLang();
  return (
    <EntityList<TestimonialItem>
      title={ui.nav.testimonials}
      basePath="/admin/testimonials"
      permissionKey="testimonials"
      searchPlaceholder={ui.common.search}
      matchesSearch={(t, s) => `${t.quote} ${t.company} ${t.role}`.toLowerCase().includes(s.toLowerCase())}
      columns={[
        { header: ui.lists.quote, render: (t) => <span className="line-clamp-1 max-w-md">{t.quote}</span> },
        { header: ui.lists.company, render: (t) => <span className="text-ink/60">{t.company}</span> },
        { header: ui.lists.role, render: (t) => <span className="text-ink/60">{t.role}</span> },
        {
          header: ui.common.status,
          render: (t) => (
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                t.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-ink/[0.06] text-ink/50",
              )}
            >
              {t.status === "PUBLISHED" ? ui.common.published : ui.common.draft}
            </span>
          ),
        },
      ]}
    />
  );
}
