import { useState, type ReactNode } from "react";
import { useAdminLang } from "@/admin/lib/adminI18n";

// Shared building blocks for admin entity forms (Projects, Testimonials,
// Clients, Services, Skills, Experience) — kept deliberately plain
// (no form library) since every entity form here is a flat set of
// controlled inputs bound to local component state.

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] p-6">
      <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-ink/50">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="mb-4 grid grid-cols-1 gap-4 last:mb-0 sm:grid-cols-2">{children}</div>;
}

export function Field({
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

export function Textarea({
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

export function ColorField({
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
          value={value || "#432666"}
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

export function Select({
  label,
  value,
  onChange,
  options,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? undefined : undefined}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function MultiSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options: { value: string; label: string }[];
}) {
  function toggle(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                  : "border-ink/10 bg-ink/[0.02] text-ink/60 hover:border-ink/20"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Free-text tags with autocomplete, not a fixed enum: `suggestions` is
// whatever values already exist elsewhere (e.g. other projects' tags),
// offered as one-click pills, but typing something new and pressing
// Enter (or the Add button) works too. This is what lets a new filter
// tab appear on the public site without a code change — the tag value
// typed here becomes that tab.
export function TagInput({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const { t } = useAdminLang();
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  const unusedSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
        {label}
      </label>

      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => remove(tag)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)]/15 px-4 py-2 text-sm font-medium text-[var(--color-accent)]"
            >
              {tag}
              <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      {unusedSuggestions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {unusedSuggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => add(tag)}
              className="rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2 text-sm text-ink/60 hover:border-ink/20"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2.5 text-sm text-ink focus:border-[var(--color-accent)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => add(draft)}
          className="shrink-0 rounded-full border border-ink/10 px-4 py-2.5 text-sm font-medium text-ink/70 hover:border-ink/20"
        >
          {t.common.add}
        </button>
      </div>
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="mb-2.5 flex items-center gap-2 text-sm text-ink/70">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function FormActions({
  isEdit,
  isPending,
  onCancel,
  createLabel,
}: {
  isEdit: boolean;
  isPending: boolean;
  onCancel: () => void;
  createLabel: string;
}) {
  const { t } = useAdminLang();
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--color-accent)] px-7 py-3 font-display text-sm font-semibold text-[#1a0f10] disabled:opacity-60"
      >
        {isPending ? t.common.saving : isEdit ? t.common.save : createLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-ink/10 px-7 py-3 font-display text-sm font-semibold text-ink/70"
      >
        {t.common.cancel}
      </button>
    </div>
  );
}
