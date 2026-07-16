import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Textarea, ColorField, MultiSelect, FormActions } from "@/admin/components/FormFields";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface Metric {
  value: string;
  label: string;
  labelAr?: string;
}

interface ProjectFormValues {
  slug: string;
  title: string;
  titleAr: string;
  company: string;
  tagline: string;
  taglineAr: string;
  role: string;
  roleAr: string;
  category: string;
  year: string;
  coverGradientFrom: string;
  coverGradientTo: string;
  thumbnailUrl: string | undefined;
  coverImageUrl: string | undefined;
  challenge: string;
  challengeAr: string;
  solution: string;
  solutionAr: string;
  metrics: Metric[];
  techStack: string;
  tags: string[];
  hasCaseStudy: boolean;
  metaTitle: string;
  metaTitleAr: string;
  metaDescription: string;
  metaDescriptionAr: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  sortOrder: number;
}

const EMPTY: ProjectFormValues = {
  slug: "",
  title: "",
  titleAr: "",
  company: "",
  tagline: "",
  taglineAr: "",
  role: "",
  roleAr: "",
  category: "",
  year: "",
  coverGradientFrom: "#432666",
  coverGradientTo: "#6a3f9c",
  thumbnailUrl: undefined,
  coverImageUrl: undefined,
  challenge: "",
  challengeAr: "",
  solution: "",
  solutionAr: "",
  metrics: [],
  techStack: "",
  tags: [],
  hasCaseStudy: false,
  metaTitle: "",
  metaTitleAr: "",
  metaDescription: "",
  metaDescriptionAr: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
};

type ApiProject = Omit<ProjectFormValues, "techStack"> & {
  id: string;
  techStack: string[];
};

export default function ProjectForm() {
  const { t } = useAdminLang();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<ProjectFormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "projects", id],
    queryFn: () => api.get<ApiProject>(`/admin/projects/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues({
        ...existing,
        titleAr: existing.titleAr ?? "",
        taglineAr: existing.taglineAr ?? "",
        roleAr: existing.roleAr ?? "",
        challengeAr: existing.challengeAr ?? "",
        solutionAr: existing.solutionAr ?? "",
        metaTitle: existing.metaTitle ?? "",
        metaTitleAr: existing.metaTitleAr ?? "",
        metaDescription: existing.metaDescription ?? "",
        metaDescriptionAr: existing.metaDescriptionAr ?? "",
        techStack: existing.techStack.join(", "),
        tags: existing.tags,
        thumbnailUrl: existing.thumbnailUrl ?? undefined,
        coverImageUrl: existing.coverImageUrl ?? undefined,
      });
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...values,
        techStack: values.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      };
      return isEdit
        ? api.patch(`/admin/projects/${id}`, payload)
        : api.post("/admin/projects", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      navigate("/admin/projects");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function addMetric() {
    set("metrics", [...values.metrics, { value: "", label: "", labelAr: "" }]);
  }

  function updateMetric(i: number, field: keyof Metric, value: string) {
    const next = [...values.metrics];
    next[i] = { ...next[i], [field]: value };
    set("metrics", next);
  }

  function removeMetric(i: number) {
    set("metrics", values.metrics.filter((_, idx) => idx !== i));
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? t.editTitles.project.edit : t.editTitles.project.new}
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
            <Field label={t.fields.slug} value={values.slug} onChange={(v) => set("slug", v)} required />
            <Field label={t.fields.company} value={values.company} onChange={(v) => set("company", v)} required />
          </Row>
          <Row>
            <Field label={t.fields.titleEn} value={values.title} onChange={(v) => set("title", v)} required />
            <Field label={t.fields.titleAr} value={values.titleAr} onChange={(v) => set("titleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.taglineEn} value={values.tagline} onChange={(v) => set("tagline", v)} required />
            <Field label={t.fields.taglineAr} value={values.taglineAr} onChange={(v) => set("taglineAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.roleEn} value={values.role} onChange={(v) => set("role", v)} required />
            <Field label={t.fields.roleAr} value={values.roleAr} onChange={(v) => set("roleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label={t.fields.category} value={values.category} onChange={(v) => set("category", v)} required />
            <Field label={t.fields.year} value={values.year} onChange={(v) => set("year", v)} required />
          </Row>
        </Section>

        <Section title={t.sections.coverImage}>
          <div className="flex flex-wrap gap-6">
            <ImageUpload
              label={t.fields.thumbnail}
              value={values.thumbnailUrl}
              onChange={(v) => set("thumbnailUrl", v)}
            />
            <ImageUpload
              label={t.fields.cover}
              value={values.coverImageUrl}
              onChange={(v) => set("coverImageUrl", v)}
            />
          </div>
          <p className="mt-4 text-xs text-ink/40">{t.fields.gradientNote}</p>
          <Row>
            <ColorField label={t.fields.gradientFrom} value={values.coverGradientFrom} onChange={(v) => set("coverGradientFrom", v)} />
            <ColorField label={t.fields.gradientTo} value={values.coverGradientTo} onChange={(v) => set("coverGradientTo", v)} />
          </Row>
        </Section>

        <Section title={t.sections.story}>
          <Row>
            <Textarea label={t.fields.challengeEn} value={values.challenge} onChange={(v) => set("challenge", v)} required />
            <Textarea label={t.fields.challengeAr} value={values.challengeAr} onChange={(v) => set("challengeAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Textarea label={t.fields.solutionEn} value={values.solution} onChange={(v) => set("solution", v)} required />
            <Textarea label={t.fields.solutionAr} value={values.solutionAr} onChange={(v) => set("solutionAr", v)} dir="rtl" />
          </Row>
        </Section>

        <Section title={t.sections.metrics}>
          <div className="space-y-3">
            {values.metrics.map((m, i) => (
              <div key={i} className="flex items-end gap-3">
                <Field label={t.fields.metricValue} value={m.value} onChange={(v) => updateMetric(i, "value", v)} compact />
                <Field label={t.fields.metricLabelEn} value={m.label} onChange={(v) => updateMetric(i, "label", v)} compact />
                <Field
                  label={t.fields.metricLabelAr}
                  value={m.labelAr ?? ""}
                  onChange={(v) => updateMetric(i, "labelAr", v)}
                  dir="rtl"
                  compact
                />
                <button
                  type="button"
                  onClick={() => removeMetric(i)}
                  className="mb-1 shrink-0 text-ink/35 hover:text-red-400"
                  aria-label={t.common.delete}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMetric}
              className="flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]"
            >
              <Plus size={15} /> {t.fields.addMetric}
            </button>
          </div>
        </Section>

        <Section title={t.sections.techTags}>
          <Field
            label={t.fields.techStack}
            value={values.techStack}
            onChange={(v) => set("techStack", v)}
          />
          <div className="mt-4">
            <MultiSelect
              label={t.fields.tags}
              value={values.tags}
              onChange={(v) => set("tags", v)}
              options={[
                { value: "saas", label: t.fields.tagSaas },
                { value: "ecommerce", label: t.fields.tagEcommerce },
                { value: "fnb", label: t.fields.tagFnb },
              ]}
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={values.hasCaseStudy}
              onChange={(e) => set("hasCaseStudy", e.target.checked)}
            />
            {t.fields.hasCaseStudy}
          </label>
        </Section>

        <Section title={t.sections.seo}>
          <Row>
            <Field label={t.fields.metaTitleEn} value={values.metaTitle} onChange={(v) => set("metaTitle", v)} />
            <Field label={t.fields.metaTitleAr} value={values.metaTitleAr} onChange={(v) => set("metaTitleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Textarea
              label={t.fields.metaDescriptionEn}
              value={values.metaDescription}
              onChange={(v) => set("metaDescription", v)}
            />
            <Textarea
              label={t.fields.metaDescriptionAr}
              value={values.metaDescriptionAr}
              onChange={(v) => set("metaDescriptionAr", v)}
              dir="rtl"
            />
          </Row>
        </Section>

        <Section title={t.sections.publishing}>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
                {t.common.status}
              </label>
              <select
                value={values.status}
                onChange={(e) => set("status", e.target.value as "DRAFT" | "PUBLISHED")}
                className="rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="DRAFT">{t.common.draft}</option>
                <option value="PUBLISHED">{t.common.published}</option>
              </select>
            </div>
            <Field
              label={t.common.sortOrder}
              type="number"
              value={String(values.sortOrder)}
              onChange={(v) => set("sortOrder", Number(v) || 0)}
              compact
            />
            <label className="mb-2.5 flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              {t.common.featured}
            </label>
          </div>
        </Section>

        <FormActions
          isEdit={isEdit}
          isPending={saveMutation.isPending}
          onCancel={() => navigate("/admin/projects")}
          createLabel={t.createLabels.project}
        />
      </form>
    </div>
  );
}
