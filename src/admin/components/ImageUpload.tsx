import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { api, getAssetUrl, ApiError } from "@/admin/lib/api";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface UploadedAsset {
  url: string;
}

// Direct per-field upload (not a full media-library browser) — click or
// drop an image, it uploads immediately and the field stores the
// returned relative URL. Good enough for "this project's cover image";
// a proper reusable media picker (browse/reuse past uploads) is a later
// pass once there's enough uploaded volume to make browsing worthwhile.
export function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (url: string | undefined) => void;
}) {
  const { t } = useAdminLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const asset = await api.upload<UploadedAsset>("/admin/media/upload", formData);
      onChange(asset.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const previewSrc = getAssetUrl(value);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>

      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}

      {previewSrc ? (
        <div className="relative w-40">
          <img
            src={previewSrc}
            alt=""
            className="aspect-square w-40 rounded-2xl border border-ink/10 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -end-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-bg shadow-md"
            aria-label={t.imageUpload.remove}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-ink/40 transition-colors ${
            dragOver ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-ink/15 hover:border-ink/30"
          }`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <ImagePlus size={20} />
              <span className="text-xs">{t.imageUpload.clickOrDrop}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
