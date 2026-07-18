import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Select, FormActions } from "@/admin/components/FormFields";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface FormValues {
  name: string;
  nameAr: string;
  level: string;
  levelAr: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const EMPTY: FormValues = {
  name: "",
  nameAr: "",
  level: "",
  levelAr: "",
  status: "DRAFT",
  sortOrder: 0,
};

export default function LanguageForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "languages", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/languages/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        nameAr: (existing.nameAr as string) ?? "",
        levelAr: (existing.levelAr as string) ?? "",
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      isEdit ? api.patch(`/admin/languages/${id}`, values) : api.post("/admin/languages", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "languages"] });
      navigate("/admin/languages");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.language.edit : t.editTitles.language.new}
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
            <Field label={t.fields.nameEn} value={values.name} onChange={(v) => set("name", v)} required />
            <Field label={t.fields.nameAr} value={values.nameAr} onChange={(v) => set("nameAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.langLevelEn} value={values.level} onChange={(v) => set("level", v)} required />
            <Field label={t.fields.langLevelAr} value={values.levelAr} onChange={(v) => set("levelAr", v)} dir="rtl" />
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
          onCancel={() => navigate("/admin/languages")}
          createLabel={t.createLabels.language}
        />
      </form>
    </div>
  );
}
