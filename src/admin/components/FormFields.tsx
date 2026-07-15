import type { ReactNode } from "react";

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
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[var(--color-accent)] px-7 py-3 font-display text-sm font-semibold text-[#1a0f10] disabled:opacity-60"
      >
        {isPending ? "Saving…" : isEdit ? "Save changes" : createLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-ink/10 px-7 py-3 font-display text-sm font-semibold text-ink/70"
      >
        Cancel
      </button>
    </div>
  );
}
