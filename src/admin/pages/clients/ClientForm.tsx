import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, ColorField, Select, Checkbox, FormActions } from "@/admin/components/FormFields";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface FormValues {
  name: string;
  nameAr: string;
  logoInitial: string;
  logoBg: string;
  logoFg: string;
  logoUrl: string | undefined;
  website: string;
  category: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  sortOrder: number;
}

const EMPTY: FormValues = {
  name: "",
  nameAr: "",
  logoInitial: "",
  logoBg: "#432666",
  logoFg: "#ffffff",
  logoUrl: undefined,
  website: "",
  category: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
};

export default function ClientForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "clients", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/clients/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        nameAr: (existing.nameAr as string) ?? "",
        website: (existing.website as string) ?? "",
        category: (existing.category as string) ?? "",
        logoUrl: (existing.logoUrl as string) ?? undefined,
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      isEdit ? api.patch(`/admin/clients/${id}`, values) : api.post("/admin/clients", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
      navigate("/admin/clients");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.client.edit : t.editTitles.client.new}
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
            <Field label={t.fields.nameEn} value={values.name} onChange={(v) => set("name", v)} required />
            <Field label={t.fields.nameAr} value={values.nameAr} onChange={(v) => set("nameAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.website} value={values.website} onChange={(v) => set("website", v)} />
            <Field label={t.fields.category} value={values.category} onChange={(v) => set("category", v)} />
          </Row>
        </Section>

        <Section title={t.sections.logo}>
          <ImageUpload label={t.fields.logoImage} value={values.logoUrl} onChange={(v) => set("logoUrl", v)} trim />
          <p className="mt-4 mb-1.5 text-xs text-ink/40">{t.fields.logoNote}</p>
          <Row>
            <Field label={t.fields.initial} value={values.logoInitial} onChange={(v) => set("logoInitial", v)} />
            <div />
          </Row>
          <Row>
            <ColorField label={t.fields.background} value={values.logoBg} onChange={(v) => set("logoBg", v)} />
            <ColorField label={t.fields.text} value={values.logoFg} onChange={(v) => set("logoFg", v)} />
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
          onCancel={() => navigate("/admin/clients")}
          createLabel={t.createLabels.client}
        />
      </form>
    </div>
  );
}
