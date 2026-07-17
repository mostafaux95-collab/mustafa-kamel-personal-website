import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Textarea, Select, FormActions } from "@/admin/components/FormFields";
import { useAdminLang } from "@/admin/lib/adminI18n";

// Curated rather than a free-text field — must be an exact lucide-react
// export name to render on the public site, so typos silently produce a
// blank icon there.
const ICON_OPTIONS = [
  "PenLine",
  "Layers",
  "Sparkles",
  "Compass",
  "Palette",
  "Code2",
  "Zap",
  "Target",
  "Rocket",
  "LayoutGrid",
  "Boxes",
  "Wrench",
  "ShieldCheck",
  "TrendingUp",
  "Users",
  "BarChart3",
  "Search",
  "Settings",
  "MessageSquare",
  "Lightbulb",
  "Figma",
  "Smartphone",
  "Globe",
  "Database",
];

interface FormValues {
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  icon: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const EMPTY: FormValues = {
  title: "",
  titleAr: "",
  body: "",
  bodyAr: "",
  icon: ICON_OPTIONS[0],
  status: "DRAFT",
  sortOrder: 0,
};

export default function ServiceForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "services", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/services/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        titleAr: (existing.titleAr as string) ?? "",
        bodyAr: (existing.bodyAr as string) ?? "",
        icon: (existing.icon as string) ?? "",
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      isEdit ? api.patch(`/admin/services/${id}`, values) : api.post("/admin/services", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      navigate("/admin/services");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.service.edit : t.editTitles.service.new}
      </h1>

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          saveMutation.mutate();
        }}
        className="mt-6 space-y-8"
      >
        <Section title={t.sections.content}>
          <Row>
            <Field label={t.fields.titleEn} value={values.title} onChange={(v) => set("title", v)} required />
            <Field label={t.fields.titleAr} value={values.titleAr} onChange={(v) => set("titleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Textarea label={t.fields.bodyEn} value={values.body} onChange={(v) => set("body", v)} required />
            <Textarea label={t.fields.bodyAr} value={values.bodyAr} onChange={(v) => set("bodyAr", v)} dir="rtl" />
          </Row>
          <Row>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Select
                  label={t.fields.icon}
                  value={values.icon}
                  onChange={(v) => set("icon", v)}
                  options={ICON_OPTIONS.map((name) => ({ value: name, label: name }))}
                />
              </div>
              <div className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-ink/[0.02]">
                {(() => {
                  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[values.icon];
                  return Icon ? <Icon size={18} className="text-ink/70" /> : null;
                })()}
              </div>
            </div>
          </Row>
        </Section>

        <Section title={t.sections.publishing}>
          <div className="flex flex-wrap items-end gap-4">
            <Select
              label={t.common.status}
              value={values.status}
              onChange={(v) => set("status", v as "DRAFT" | "PUBLISHED")}
              options={[
                { value: "DRAFT", label: t.common.draft },
                { value: "PUBLISHED", label: t.common.published },
              ]}
            />
            <Field
              label={t.common.sortOrder}
              type="number"
              value={String(values.sortOrder)}
              onChange={(v) => set("sortOrder", Number(v) || 0)}
              compact
            />
          </div>
        </Section>

        <FormActions
          isEdit={isEdit}
          isPending={saveMutation.isPending}
          onCancel={() => navigate("/admin/services")}
          createLabel={t.createLabels.service}
        />
      </form>
    </div>
  );
}
