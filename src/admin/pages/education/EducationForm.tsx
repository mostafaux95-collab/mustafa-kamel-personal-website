import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Select, FormActions } from "@/admin/components/FormFields";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface FormValues {
  degree: string;
  degreeAr: string;
  school: string;
  schoolAr: string;
  years: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const EMPTY: FormValues = {
  degree: "",
  degreeAr: "",
  school: "",
  schoolAr: "",
  years: "",
  status: "DRAFT",
  sortOrder: 0,
};

export default function EducationForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "education", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/education/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        degreeAr: (existing.degreeAr as string) ?? "",
        schoolAr: (existing.schoolAr as string) ?? "",
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      isEdit ? api.patch(`/admin/education/${id}`, values) : api.post("/admin/education", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "education"] });
      navigate("/admin/education");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.education.edit : t.editTitles.education.new}
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
        <Section title={t.sections.details}>
          <Row>
            <Field label={t.fields.degreeEn} value={values.degree} onChange={(v) => set("degree", v)} required />
            <Field label={t.fields.degreeAr} value={values.degreeAr} onChange={(v) => set("degreeAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.schoolEn} value={values.school} onChange={(v) => set("school", v)} required />
            <Field label={t.fields.schoolAr} value={values.schoolAr} onChange={(v) => set("schoolAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.yearsRange} value={values.years} onChange={(v) => set("years", v)} required />
            <div />
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
          onCancel={() => navigate("/admin/education")}
          createLabel={t.createLabels.education}
        />
      </form>
    </div>
  );
}
