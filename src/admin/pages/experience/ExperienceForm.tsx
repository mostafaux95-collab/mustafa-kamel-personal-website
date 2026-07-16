import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Textarea, ColorField, Select, FormActions } from "@/admin/components/FormFields";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface FormValues {
  company: string;
  role: string;
  roleAr: string;
  period: string;
  location: string;
  locationAr: string;
  summary: string;
  summaryAr: string;
  highlights: string; // newline-separated in the UI, array on the wire
  highlightsAr: string;
  logoInitial: string;
  logoBg: string;
  logoFg: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const EMPTY: FormValues = {
  company: "",
  role: "",
  roleAr: "",
  period: "",
  location: "",
  locationAr: "",
  summary: "",
  summaryAr: "",
  highlights: "",
  highlightsAr: "",
  logoInitial: "",
  logoBg: "#432666",
  logoFg: "#ffffff",
  status: "DRAFT",
  sortOrder: 0,
};

export default function ExperienceForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "experience", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/experience/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        roleAr: (existing.roleAr as string) ?? "",
        locationAr: (existing.locationAr as string) ?? "",
        summaryAr: (existing.summaryAr as string) ?? "",
        highlights: ((existing.highlights as string[]) ?? []).join("\n"),
        highlightsAr: ((existing.highlightsAr as string[]) ?? []).join("\n"),
        logoInitial: (existing.logoInitial as string) ?? "",
        logoBg: (existing.logoBg as string) ?? "#432666",
        logoFg: (existing.logoFg as string) ?? "#ffffff",
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...values,
        highlights: values.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
        highlightsAr: values.highlightsAr.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      return isEdit
        ? api.patch(`/admin/experience/${id}`, payload)
        : api.post("/admin/experience", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "experience"] });
      navigate("/admin/experience");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.experience.edit : t.editTitles.experience.new}
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
        <Section title={t.sections.role}>
          <Row>
            <Field label={t.fields.company} value={values.company} onChange={(v) => set("company", v)} required />
            <Field label={t.fields.period} value={values.period} onChange={(v) => set("period", v)} required />
          </Row>
          <Row>
            <Field label={t.fields.roleEn} value={values.role} onChange={(v) => set("role", v)} required />
            <Field label={t.fields.roleAr} value={values.roleAr} onChange={(v) => set("roleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.locationEn} value={values.location} onChange={(v) => set("location", v)} required />
            <Field label={t.fields.locationAr} value={values.locationAr} onChange={(v) => set("locationAr", v)} dir="rtl" />
          </Row>
        </Section>

        <Section title={t.sections.summary}>
          <Row>
            <Textarea label={t.fields.summaryEn} value={values.summary} onChange={(v) => set("summary", v)} required />
            <Textarea label={t.fields.summaryAr} value={values.summaryAr} onChange={(v) => set("summaryAr", v)} dir="rtl" />
          </Row>
          <Row>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
                {t.fields.highlightsEn}
              </label>
              <textarea
                rows={5}
                value={values.highlights}
                onChange={(e) => set("highlights", e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
                {t.fields.highlightsAr}
              </label>
              <textarea
                dir="rtl"
                rows={5}
                value={values.highlightsAr}
                onChange={(e) => set("highlightsAr", e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </Row>
        </Section>

        <Section title={t.sections.logoTile}>
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
          </div>
        </Section>

        <FormActions
          isEdit={isEdit}
          isPending={saveMutation.isPending}
          onCancel={() => navigate("/admin/experience")}
          createLabel={t.createLabels.experience}
        />
      </form>
    </div>
  );
}
