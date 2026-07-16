import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, ColorField, Select, Checkbox, FormActions } from "@/admin/components/FormFields";
import { ImageUpload } from "@/admin/components/ImageUpload";

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
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? "Edit client" : "New client"}
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
            <Field label="Name (EN)" value={values.name} onChange={(v) => set("name", v)} required />
            <Field label="Name (AR)" value={values.nameAr} onChange={(v) => set("nameAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field label="Website" value={values.website} onChange={(v) => set("website", v)} />
            <Field label="Category" value={values.category} onChange={(v) => set("category", v)} />
          </Row>
        </Section>

        <Section title="Logo">
          <ImageUpload label="Logo image" value={values.logoUrl} onChange={(v) => set("logoUrl", v)} />
          <p className="mt-4 mb-1.5 text-xs text-ink/40">
            Fallback monogram tile — used until a logo is uploaded above.
          </p>
          <Row>
            <Field label="Initial" value={values.logoInitial} onChange={(v) => set("logoInitial", v)} />
            <div />
          </Row>
          <Row>
            <ColorField label="Background" value={values.logoBg} onChange={(v) => set("logoBg", v)} />
            <ColorField label="Text" value={values.logoFg} onChange={(v) => set("logoFg", v)} />
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
          onCancel={() => navigate("/admin/clients")}
          createLabel="Create client"
        />
      </form>
    </div>
  );
}
