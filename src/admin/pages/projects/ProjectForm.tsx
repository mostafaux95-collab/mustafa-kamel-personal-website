import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "@/admin/lib/api";

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
  challenge: string;
  challengeAr: string;
  solution: string;
  solutionAr: string;
  metrics: Metric[];
  techStack: string;
  tags: string;
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
  challenge: "",
  challengeAr: "",
  solution: "",
  solutionAr: "",
  metrics: [],
  techStack: "",
  tags: "",
  hasCaseStudy: false,
  metaTitle: "",
  metaTitleAr: "",
  metaDescription: "",
  metaDescriptionAr: "",
  status: "DRAFT",
  featured: false,
  sortOrder: 0,
};

type ApiProject = Omit<ProjectFormValues, "techStack" | "tags"> & {
  id: string;
  techStack: string[];
  tags: string[];
};

export default function ProjectForm() {
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
        tags: existing.tags.join(", "),
      });
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...values,
        techStack: values.techStack.split(",").map((s) => s.trim()).filter(Boolean),
        tags: values.tags.split(",").map((s) => s.trim()).filter(Boolean),
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
        {isEdit ? "Edit project" : "New project"}
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
        <Section title="Basics">
          <Row>
            <Field label="Slug" value={values.slug} onChange={(v) => set("slug", v)} required />
            <Field label="Company" value={values.company} onChange={(v) => set("company", v)} required />
          </Row>
          <Row>
            <Field label="Title (EN)" value={values.title} onChange={(v) => set("title", v)} required />
            <Field label="Title (AR)" value={values.titleAr} onChange={(v) => set("titleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label="Tagline (EN)" value={values.tagline} onChange={(v) => set("tagline", v)} required />
            <Field label="Tagline (AR)" value={values.taglineAr} onChange={(v) => set("taglineAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label="Role (EN)" value={values.role} onChange={(v) => set("role", v)} required />
            <Field label="Role (AR)" value={values.roleAr} onChange={(v) => set("roleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label="Category" value={values.category} onChange={(v) => set("category", v)} required />
            <Field label="Year" value={values.year} onChange={(v) => set("year", v)} required />
          </Row>
        </Section>

        <Section title="Cover gradient">
          <Row>
            <ColorField label="From" value={values.coverGradientFrom} onChange={(v) => set("coverGradientFrom", v)} />
            <ColorField label="To" value={values.coverGradientTo} onChange={(v) => set("coverGradientTo", v)} />
          </Row>
        </Section>

        <Section title="Story">
          <Row>
            <Textarea label="Challenge (EN)" value={values.challenge} onChange={(v) => set("challenge", v)} required />
            <Textarea label="Challenge (AR)" value={values.challengeAr} onChange={(v) => set("challengeAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Textarea label="Solution (EN)" value={values.solution} onChange={(v) => set("solution", v)} required />
            <Textarea label="Solution (AR)" value={values.solutionAr} onChange={(v) => set("solutionAr", v)} dir="rtl" />
          </Row>
        </Section>

        <Section title="Metrics">
          <div className="space-y-3">
            {values.metrics.map((m, i) => (
              <div key={i} className="flex items-end gap-3">
                <Field label="Value" value={m.value} onChange={(v) => updateMetric(i, "value", v)} compact />
                <Field label="Label (EN)" value={m.label} onChange={(v) => updateMetric(i, "label", v)} compact />
                <Field
                  label="Label (AR)"
                  value={m.labelAr ?? ""}
                  onChange={(v) => updateMetric(i, "labelAr", v)}
                  dir="rtl"
                  compact
                />
                <button
                  type="button"
                  onClick={() => removeMetric(i)}
                  className="mb-1 shrink-0 text-ink/35 hover:text-red-400"
                  aria-label="Remove metric"
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
              <Plus size={15} /> Add metric
            </button>
          </div>
        </Section>

        <Section title="Tech & tags">
          <Row>
            <Field
              label="Tech stack (comma-separated)"
              value={values.techStack}
              onChange={(v) => set("techStack", v)}
            />
            <Field label="Tags (comma-separated)" value={values.tags} onChange={(v) => set("tags", v)} />
          </Row>
          <label className="mt-3 flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={values.hasCaseStudy}
              onChange={(e) => set("hasCaseStudy", e.target.checked)}
            />
            Has a full case study page
          </label>
        </Section>

        <Section title="SEO">
          <Row>
            <Field label="Meta title (EN)" value={values.metaTitle} onChange={(v) => set("metaTitle", v)} />
            <Field label="Meta title (AR)" value={values.metaTitleAr} onChange={(v) => set("metaTitleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Textarea
              label="Meta description (EN)"
              value={values.metaDescription}
              onChange={(v) => set("metaDescription", v)}
            />
            <Textarea
              label="Meta description (AR)"
              value={values.metaDescriptionAr}
              onChange={(v) => set("metaDescriptionAr", v)}
              dir="rtl"
            />
          </Row>
        </Section>

        <Section title="Publishing">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
                Status
              </label>
              <select
                value={values.status}
                onChange={(e) => set("status", e.target.value as "DRAFT" | "PUBLISHED")}
                className="rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <Field
              label="Sort order"
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
              Featured
            </label>
          </div>
        </Section>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-full bg-[var(--color-accent)] px-7 py-3 font-display text-sm font-semibold text-[#1a0f10] disabled:opacity-60"
          >
            {saveMutation.isPending ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="rounded-full border border-ink/10 px-7 py-3 font-display text-sm font-semibold text-ink/70"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] p-6">
      <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-ink/50">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 grid grid-cols-1 gap-4 last:mb-0 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  dir,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  dir?: "rtl" | "ltr";
  compact?: boolean;
}) {
  return (
    <div className={compact ? "flex-1" : undefined}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>
      <input
        type={type}
        required={required}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>
      <textarea
        required={required}
        dir={dir}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.02] px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-8 shrink-0 cursor-pointer rounded"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-ink focus:outline-none"
        />
      </div>
    </div>
  );
}
