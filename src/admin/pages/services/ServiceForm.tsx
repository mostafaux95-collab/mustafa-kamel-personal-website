import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/admin/lib/api";
import { Section, Row, Field, Textarea, Select, FormActions } from "@/admin/components/FormFields";

interface FormValues {
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  icon: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const EMPTY: FormValues = {
  title: "",
  titleAr: "",
  body: "",
  bodyAr: "",
  icon: "",
  status: "DRAFT",
  sortOrder: 0,
};

export default function ServiceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin", "services", id],
    queryFn: () => api.get<Record<string, unknown>>(`/admin/services/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setValues((v) => ({
        ...v,
        ...existing,
        titleAr: (existing.titleAr as string) ?? "",
        bodyAr: (existing.bodyAr as string) ?? "",
        icon: (existing.icon as string) ?? "",
      }));
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      isEdit ? api.patch(`/admin/services/${id}`, values) : api.post("/admin/services", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      navigate("/admin/services");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        {isEdit ? "Edit service" : "New service"}
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
        <Section title="Content">
          <Row>
            <Field label="Title (EN)" value={values.title} onChange={(v) => set("title", v)} required />
            <Field label="Title (AR)" value={values.titleAr} onChange={(v) => set("titleAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Textarea label="Body (EN)" value={values.body} onChange={(v) => set("body", v)} required />
            <Textarea label="Body (AR)" value={values.bodyAr} onChange={(v) => set("bodyAr", v)} dir="rtl" />
          </Row>
          <Row>
            <Field
              label="Icon (lucide-react name, e.g. PenLine)"
              value={values.icon}
              onChange={(v) => set("icon", v)}
            />
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
          </div>
        </Section>

        <FormActions
          isEdit={isEdit}
          isPending={saveMutation.isPending}
          onCancel={() => navigate("/admin/services")}
          createLabel="Create service"
        />
      </form>
    </div>
  );
}
