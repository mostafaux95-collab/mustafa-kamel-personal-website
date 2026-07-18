import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { api, ApiError, getAssetUrl } from "@/admin/lib/api";
import { Section, Row, Textarea, Field, FormActions, TagInput } from "@/admin/components/FormFields";
import { useAdminLang } from "@/admin/lib/adminI18n";

interface Stat {
  value: string;
  label: string;
  labelAr: string;
}

interface CvSettingsValue {
  profile: string;
  profileAr: string;
  stats: Stat[];
  skills: string[];
  skillsAr: string[];
  tools: string[];
  toolsAr: string[];
  resumeUrl: string;
}

const EMPTY: CvSettingsValue = {
  profile: "",
  profileAr: "",
  stats: [],
  skills: [],
  skillsAr: [],
  tools: [],
  toolsAr: [],
  resumeUrl: "",
};

interface SiteSettingRow {
  key: string;
  value: unknown;
}

export default function CvSettings() {
  const { t } = useAdminLang();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<CvSettingsValue>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => api.get<SiteSettingRow[]>("/settings"),
  });

  useEffect(() => {
    const cv = settings?.find((s) => s.key === "cv")?.value as Partial<CvSettingsValue> | undefined;
    if (cv) setValues((v) => ({ ...v, ...cv }));
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: () => api.patch("/settings", { key: "cv", value: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Failed to save"),
  });

  function set<K extends keyof CvSettingsValue>(key: K, value: CvSettingsValue[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function setStat(index: number, patch: Partial<Stat>) {
    setValues((v) => ({
      ...v,
      stats: v.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  async function handleResumeFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const asset = await api.upload<{ url: string }>("/admin/media/upload", formData);
      set("resumeUrl", asset.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const resumeHref = getAssetUrl(values.resumeUrl);

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl font-semibold text-ink">{t.cvSettings.title}</h1>
      <p className="mt-1 text-sm text-ink/50">{t.cvSettings.subtitle}</p>

      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}
      {saved && (
        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-500">
          {t.cvSettings.saved}
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
        <Section title={t.sections.profile}>
          <Row>
            <Textarea label={t.fields.profileEn} value={values.profile} onChange={(v) => set("profile", v)} />
            <Textarea label={t.fields.profileAr} value={values.profileAr} onChange={(v) => set("profileAr", v)} dir="rtl" />
          </Row>
        </Section>

        <Section title={t.sections.stats}>
          <div className="space-y-4">
            {values.stats.map((stat, i) => (
              <div key={i} className="rounded-2xl border border-ink/[0.08] p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label={t.fields.statValue} value={stat.value} onChange={(v) => setStat(i, { value: v })} />
                  <Field label={t.fields.statLabelEn} value={stat.label} onChange={(v) => setStat(i, { label: v })} />
                  <Field label={t.fields.statLabelAr} value={stat.labelAr} onChange={(v) => setStat(i, { labelAr: v })} dir="rtl" />
                </div>
                <button
                  type="button"
                  onClick={() => set("stats", values.stats.filter((_, idx) => idx !== i))}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300"
                >
                  <Trash2 size={13} />
                  {t.fields.removeStat}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("stats", [...values.stats, { value: "", label: "", labelAr: "" }])}
              className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink/70 hover:border-ink/20"
            >
              + {t.fields.addStat}
            </button>
          </div>
        </Section>

        <Section title={t.sections.chips}>
          <Row>
            <TagInput label={t.fields.skillsEn} value={values.skills} onChange={(v) => set("skills", v)} suggestions={[]} />
            <TagInput label={t.fields.skillsAr} value={values.skillsAr} onChange={(v) => set("skillsAr", v)} suggestions={[]} />
          </Row>
          <Row>
            <TagInput label={t.fields.toolsEn} value={values.tools} onChange={(v) => set("tools", v)} suggestions={[]} />
            <TagInput label={t.fields.toolsAr} value={values.toolsAr} onChange={(v) => set("toolsAr", v)} suggestions={[]} />
          </Row>
        </Section>

        <Section title={t.sections.resume}>
          {resumeHref ? (
            <div className="flex items-center gap-3">
              <a href={resumeHref} target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
                {t.cvSettings.currentResume}
              </a>
              <button
                type="button"
                onClick={() => set("resumeUrl", "")}
                className="text-ink/35 transition-colors hover:text-red-400"
                aria-label={t.imageUpload.remove}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink/45">{t.cvSettings.noResume}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleResumeFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-3 flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-sm font-medium text-ink/70 hover:border-ink/20 disabled:opacity-60"
          >
            <Upload size={14} />
            {uploading ? t.common.saving : t.cvSettings.uploadResume}
          </button>
        </Section>

        <FormActions isEdit isPending={saveMutation.isPending} onCancel={() => {}} createLabel={t.common.save} />
      </form>
    </div>
  );
}
