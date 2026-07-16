import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Textarea, ColorField, Select, Checkbox, FormActions } from "@/admin/components/FormFields";
import { ImageUpload } from "@/admin/components/ImageUpload";

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
        {isEdit ? "Edit testimonial" : "New testimonial"}
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
        <Section title="Quote">
          <Row>
            <Textarea label="Quote (EN)" value={values.quote} onChange={(v) => set("quote", v)} required />
            <Textarea label="Quote (AR)" value={values.quoteAr} onChange={(v) => set("quoteAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label="Role (EN)" value={values.role} onChange={(v) => set("role", v)} required />
            <Field label="Role (AR)" value={values.roleAr} onChange={(v) => set("roleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label="Company" value={values.company} onChange={(v) => set("company", v)} required />
          </Row>
        </Section>

        <Section title="Avatar">
          <ImageUpload label="Photo" value={values.avatarUrl} onChange={(v) => set("avatarUrl", v)} />
          <p className="mt-4 mb-1.5 text-xs text-ink/40">
            Fallback monogram tile — used until a photo is uploaded above.
          </p>
          <Row>
            <Field label="Initial" value={values.avatarInitial} onChange={(v) => set("avatarInitial", v)} />
            <div />
          </Row>
          <Row>
            <ColorField label="Background" value={values.avatarBg} onChange={(v) => set("avatarBg", v)} />
            <ColorField label="Text" value={values.avatarFg} onChange={(v) => set("avatarFg", v)} />
          </Row>
        </Section>

        <Section title="Publishing">
          <div className="flex flex-wrap items-end gap-4">
            <Select
              label="Status"
              value={values.status}
              onChange={(v) => set("status", v as "DRAFT" | "PUBLISHED")}
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" },
              ]}
            />
            <Field
              label="Sort order"
              type="number"
              value={String(values.sortOrder)}
              onChange={(v) => set("sortOrder", Number(v) || 0)}
              compact
            />
            <Checkbox label="Featured" checked={values.featured} onChange={(v) => set("featured", v)} />
          </div>
        </Section>

        <FormActions
          isEdit={isEdit}
          isPending={saveMutation.isPending}
          onCancel={() => navigate("/admin/testimonials")}
          createLabel="Create testimonial"
        />
      </form>
    </div>
  );
}
