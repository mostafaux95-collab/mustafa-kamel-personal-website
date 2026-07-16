import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { api, getAssetUrl, ApiError } from "@/admin/lib/api";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface UploadedAsset {
  url: string;
}

// Multi-image variant of ImageUpload — an ordered list of URLs instead
// of a single one. Each upload appends to the array; each tile can be
// removed independently. Same direct-upload-on-select mechanism, no
// media-library browsing yet (matches ImageUpload's scope).
export function GalleryUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const { t } = useAdminLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList | File[] | undefined) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const asset = await api.upload<UploadedAsset>("/admin/media/upload", formData);
        uploaded.push(asset.url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>

      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-4">
        {value.map((url, i) => {
          const src = getAssetUrl(url);
          return (
            <div key={`${url}-${i}`} className="relative w-32">
              <img
                src={src}
                alt=""
                className="aspect-square w-32 rounded-2xl border border-ink/10 object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -end-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-bg shadow-md"
                aria-label={t.imageUpload.remove}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

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
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-ink/40 transition-colors ${
            dragOver ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-ink/15 hover:border-ink/30"
          }`}
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <ImagePlus size={18} />
              <span className="text-xs">{t.imageUpload.addAnother}</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files ?? undefined)}
      />
    </div>
  );
}
