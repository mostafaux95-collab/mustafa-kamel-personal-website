import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, GripVertical, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { api, ApiError, getAssetUrl } from "@/admin/lib/api";
import { useConfirm } from "@/admin/lib/confirm";
import { useHasPermission } from "@/admin/lib/auth";
import { useAdminLang } from "@/admin/lib/adminI18n";
import { Field, FormActions } from "@/admin/components/FormFields";

interface Certificate {
  id: string;
  imageUrl: string;
  title: string | null;
  titleAr: string | null;
  issuer: string | null;
  issuerAr: string | null;
  issueDate: string | null;
  verifyUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
}

interface ListResult {
  items: Certificate[];
  total: number;
}

interface EditValues {
  title: string;
  titleAr: string;
  issuer: string;
  issuerAr: string;
  issueDate: string;
  verifyUrl: string;
}

export default function CertificatesManager() {
  const { t } = useAdminLang();
  const canWrite = useHasPermission("certificates:write");
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({
    title: "",
    titleAr: "",
    issuer: "",
    issuerAr: "",
    issueDate: "",
    verifyUrl: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "certificates", "list"],
    queryFn: () => api.get<ListResult>("/admin/certificates?pageSize=200"),
  });
  const items = data?.items ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "certificates"] });

  const createMutation = useMutation({
    mutationFn: (imageUrl: string) =>
      api.post("/admin/certificates", { imageUrl, sortOrder: items.length }),
    onSuccess: invalidate,
  });

  const toggleVisibleMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      api.patch(`/admin/certificates/${id}`, { isVisible }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/certificates/${id}`),
    onSuccess: invalidate,
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => api.patch("/admin/certificates/reorder", { ids }),
    onSuccess: invalidate,
  });

  const editMutation = useMutation({
    mutationFn: () => api.patch(`/admin/certificates/${editing!.id}`, editValues),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  async function handleFiles(files: FileList | File[] | undefined) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const asset = await api.upload<{ url: string }>("/admin/media/upload", formData);
        await createMutation.mutateAsync(asset.url);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function openEdit(cert: Certificate) {
    setEditing(cert);
    setEditValues({
      title: cert.title ?? "",
      titleAr: cert.titleAr ?? "",
      issuer: cert.issuer ?? "",
      issuerAr: cert.issuerAr ?? "",
      issueDate: cert.issueDate ?? "",
      verifyUrl: cert.verifyUrl ?? "",
    });
  }

  function onDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    const ids = items.map((i) => i.id);
    const from = ids.indexOf(draggingId);
    const to = ids.indexOf(targetId);
    ids.splice(from, 1);
    ids.splice(to, 0, draggingId);
    setDraggingId(null);
    reorderMutation.mutate(ids);
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{t.certificates.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-ink/50">{t.certificates.subtitle}</p>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 font-display text-sm font-semibold text-[#1a0f10] disabled:opacity-60"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {uploading ? t.certificates.uploading : t.certificates.upload}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files ?? undefined)}
      />

      {canWrite && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={clsx(
            "mt-6 flex h-24 items-center justify-center rounded-2xl border-2 border-dashed text-sm transition-colors",
            dragOver ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-ink/15 text-ink/40",
          )}
        >
          {t.imageUpload.clickOrDrop}
        </div>
      )}

      {isLoading && <p className="mt-10 text-center text-sm text-ink/40">{t.common.loading}</p>}
      {!isLoading && items.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink/40">{t.certificates.empty}</p>
      )}

      {items.length > 0 && (
        <>
          {canWrite && <p className="mt-6 text-xs text-ink/35">{t.certificates.dragHint}</p>}
          <div className="mt-3 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((cert) => {
              const src = getAssetUrl(cert.imageUrl);
              return (
                <div
                  key={cert.id}
                  draggable={canWrite}
                  onDragStart={() => setDraggingId(cert.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(cert.id)}
                  className={clsx(
                    "group relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] transition-opacity",
                    draggingId === cert.id && "opacity-40",
                    !cert.isVisible && "opacity-60",
                  )}
                >
                  {canWrite && (
                    <div className="absolute start-2 top-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm active:cursor-grabbing">
                      <GripVertical size={14} />
                    </div>
                  )}
                  <img
                    src={src}
                    alt={cert.title ?? ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {!cert.isVisible && (
                    <span className="absolute end-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
                      {t.certificates.hide}
                    </span>
                  )}
                  {canWrite && (
                    <div className="flex items-center justify-between gap-1 border-t border-ink/[0.08] p-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleVisibleMutation.mutate({ id: cert.id, isVisible: !cert.isVisible })
                        }
                        title={cert.isVisible ? t.certificates.hide : t.certificates.show}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                      >
                        {cert.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(cert)}
                        title={t.certificates.edit}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (await confirm(t.certificates.deleteConfirm)) {
                            deleteMutation.mutate(cert.id);
                          }
                        }}
                        title={t.common.delete}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">{t.certificates.editTitle}</h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-ink/40 hover:text-ink"
                aria-label={t.common.cancel}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                editMutation.mutate();
              }}
              className="mt-5 space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={t.certificates.titleEn}
                  value={editValues.title}
                  onChange={(v) => setEditValues((s) => ({ ...s, title: v }))}
                />
                <Field
                  label={t.certificates.titleAr}
                  value={editValues.titleAr}
                  onChange={(v) => setEditValues((s) => ({ ...s, titleAr: v }))}
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={t.certificates.issuerEn}
                  value={editValues.issuer}
                  onChange={(v) => setEditValues((s) => ({ ...s, issuer: v }))}
                />
                <Field
                  label={t.certificates.issuerAr}
                  value={editValues.issuerAr}
                  onChange={(v) => setEditValues((s) => ({ ...s, issuerAr: v }))}
                  dir="rtl"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={t.certificates.issueDate}
                  value={editValues.issueDate}
                  onChange={(v) => setEditValues((s) => ({ ...s, issueDate: v }))}
                />
                <Field
                  label={t.certificates.verifyUrl}
                  value={editValues.verifyUrl}
                  onChange={(v) => setEditValues((s) => ({ ...s, verifyUrl: v }))}
                />
              </div>

              <FormActions
                isEdit
                isPending={editMutation.isPending}
                onCancel={() => setEditing(null)}
                createLabel={t.common.save}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
