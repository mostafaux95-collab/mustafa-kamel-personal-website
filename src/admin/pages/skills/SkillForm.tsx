import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Textarea, Select, FormActions } from "@/admin/components/FormFields";
import { useAdminLang } from "@/admin/lib/adminI18n";

const CATEGORIES = ["Design", "Research", "Systems", "AI", "Frontend", "Leadership"];

interface FormValues {
  name: string;
  category: string;
  detail: string;
  detailAr: string;
  level: string;
  years: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const EMPTY: FormValues = {
  name: "",
  category: CATEGORIES[0],
  detail: "",
  detailAr: "",
  level: "",
  years: "",
  status: "DRAFT",
  sortOrder: 0,
};

export default function SkillForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "skills", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/skills/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        detailAr: (existing.detailAr as string) ?? "",
        level: existing.level != null ? String(existing.level) : "",
        years: existing.years != null ? String(existing.years) : "",
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...values,
        level: values.level ? Number(values.level) : undefined,
        years: values.years ? Number(values.years) : undefined,
      };
      return isEdit ? api.patch(`/admin/skills/${id}`, payload) : api.post("/admin/skills", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "skills"] });
      navigate("/admin/skills");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.skill.edit : t.editTitles.skill.new}
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
        <Section title={t.sections.basics}>
          <Row>
            <Field label={t.fields.name} value={values.name} onChange={(v) => set("name", v)} required />
            <Select
              label={t.fields.category}
              value={values.category}
              onChange={(v) => set("category", v)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </Row>
          <Row>
            <Textarea label={t.fields.detailEn} value={values.detail} onChange={(v) => set("detail", v)} required />
            <Textarea label={t.fields.detailAr} value={values.detailAr} onChange={(v) => set("detailAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.level} type="number" value={values.level} onChange={(v) => set("level", v)} />
            <Field label={t.fields.years} type="number" value={values.years} onChange={(v) => set("years", v)} />
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
          onCancel={() => navigate("/admin/skills")}
          createLabel={t.createLabels.skill}
        />
      </form>
    </div>
  );
}
