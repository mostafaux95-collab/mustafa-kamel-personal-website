import clsx from "clsx";
import { EntityList } from "@/admin/components/EntityList";

interface TestimonialItem {
  id: string;
  quote: string;
  role: string;
  company: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function TestimonialsList() {
  return (
    <EntityList<TestimonialItem>
      title="Testimonials"
      basePath="/admin/testimonials"
      permissionKey="testimonials"
      searchPlaceholder="Search testimonials…"
      matchesSearch={(t, s) => `${t.quote} ${t.company} ${t.role}`.toLowerCase().includes(s.toLowerCase())}
      columns={[
        { header: "Quote", render: (t) => <span className="line-clamp-1 max-w-md">{t.quote}</span> },
        { header: "Company", render: (t) => <span className="text-ink/60">{t.company}</span> },
        { header: "Role", render: (t) => <span className="text-ink/60">{t.role}</span> },
        {
          header: "Status",
          render: (t) => (
            <span
              className={clsx(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                t.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-ink/[0.06] text-ink/50",
              )}
            >
              {t.status === "PUBLISHED" ? "Published" : "Draft"}
            </span>
          ),
        },
      ]}
    />
  );
}
