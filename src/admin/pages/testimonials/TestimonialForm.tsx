import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Textarea, ColorField, Select, Checkbox, FormActions } from "@/admin/components/FormFields";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface FormValues {
  quote: string;
  quoteAr: string;
  role: string;
  roleAr: string;
  company: string;
  avatarInitial: string;
  avatarBg: string;
  avatarFg: string;
  avatarUrl: string | undefined;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  sortOrder: number;
}

const EMPTY: FormValues = {
  quote: "",
  quoteAr: "",
  role: "",
  roleAr: "",
  company: "",
  avatarInitial: "",
  avatarBg: "#432666",
  avatarFg: "#ffffff",
  avatarUrl: undefined,
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
};

export default function TestimonialForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "testimonials", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/testimonials/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        quoteAr: (existing.quoteAr as string) ?? "",
        roleAr: (existing.roleAr as string) ?? "",
        avatarInitial: (existing.avatarInitial as string) ?? "",
        avatarBg: (existing.avatarBg as string) ?? "#432666",
        avatarFg: (existing.avatarFg as string) ?? "#ffffff",
        avatarUrl: (existing.avatarUrl as string) ?? undefined,
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      isEdit ? api.patch(`/admin/testimonials/${id}`, values) : api.post("/admin/testimonials", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      navigate("/admin/testimonials");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.testimonial.edit : t.editTitles.testimonial.new}
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
        <Section title={t.sections.quote}>
          <Row>
            <Textarea label={t.fields.quoteEn} value={values.quote} onChange={(v) => set("quote", v)} required />
            <Textarea label={t.fields.quoteAr} value={values.quoteAr} onChange={(v) => set("quoteAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.roleEn} value={values.role} onChange={(v) => set("role", v)} required />
            <Field label={t.fields.roleAr} value={values.roleAr} onChange={(v) => set("roleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.company} value={values.company} onChange={(v) => set("company", v)} required />
          </Row>
        </Section>

        <Section title={t.sections.avatar}>
          <ImageUpload label={t.fields.photo} value={values.avatarUrl} onChange={(v) => set("avatarUrl", v)} />
          <p className="mt-4 mb-1.5 text-xs text-ink/40">{t.fields.avatarNote}</p>
          <Row>
            <Field label={t.fields.initial} value={values.avatarInitial} onChange={(v) => set("avatarInitial", v)} />
            <div />
          </Row>
          <Row>
            <ColorField label={t.fields.background} value={values.avatarBg} onChange={(v) => set("avatarBg", v)} />
            <ColorField label={t.fields.text} value={values.avatarFg} onChange={(v) => set("avatarFg", v)} />
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
            <Checkbox label={t.common.featured} checked={values.featured} onChange={(v) => set("featured", v)} />
          </div>
        </Section>

        <FormActions
          isEdit={isEdit}
          isPending={saveMutation.isPending}
          onCancel={() => navigate("/admin/testimonials")}
          createLabel={t.createLabels.testimonial}
        />
      </form>
    </div>
  );
}
