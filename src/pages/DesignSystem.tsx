import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Loader2, Sparkles } from "lucide-react";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

const COLORS: { name: string; varName: string; hex: string }[] = [
  { name: "Background", varName: "--color-bg", hex: "#0D0D11" },
  { name: "Card", varName: "--color-card", hex: "#17171E" },
  { name: "Primary", varName: "--color-primary", hex: "#432666" },
  { name: "Primary Soft", varName: "--color-primary-soft", hex: "#6A3F9C" },
  { name: "Accent", varName: "--color-accent", hex: "#F58963" },
  { name: "Accent Soft", varName: "--color-accent-soft", hex: "#FFB99C" },
  { name: "Ink", varName: "--color-ink", hex: "#FFFFFF" },
  { name: "Ink Secondary", varName: "--color-ink-secondary", hex: "rgba(255,255,255,.72)" },
  { name: "Ink Muted", varName: "--color-ink-muted", hex: "rgba(255,255,255,.45)" },
];

const TYPE_SCALE = [
  { label: "Display", className: "text-6xl sm:text-7xl font-semibold", sample: "Designing products" },
  { label: "H1", className: "text-5xl font-semibold", sample: "Six years of product design" },
  { label: "H2", className: "text-4xl font-semibold", sample: "Products shipped, not just designed" },
  { label: "H3", className: "text-2xl font-semibold", sample: "Clarity over complexity" },
  { label: "Body", className: "text-lg font-normal", sample: "I design products people remember." },
  { label: "Caption", className: "text-xs uppercase tracking-widest font-medium", sample: "Senior Product Designer" },
];

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

export default function DesignSystem() {
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  const { t: tr } = useLang();
  usePageTitle(tr.titles.designSystem);

  return (
    <>
      <Nav />
      <main className="pt-40 pb-32">
        <Container>
          <FadeIn>
            <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
              {tr.ds.eyebrow}
            </span>
            <h1 className="mt-6 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              {tr.ds.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-secondary)]">
              {tr.ds.sub}
            </p>
          </FadeIn>

          {/* Colors */}
          <section className="mt-28">
            <FadeIn>
              <h2 className="font-display text-2xl font-semibold text-ink">{tr.ds.colorsTitle}</h2>
              <p className="mt-2 text-[var(--color-ink-secondary)]">
                {tr.ds.colorsDesc}
              </p>
            </FadeIn>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {COLORS.map((c, i) => (
                <FadeIn key={c.name} delay={i * 0.04}>
                  <div className="overflow-hidden rounded-2xl border border-ink/[0.08]">
                    <div className="h-20" style={{ background: c.hex }} />
                    <div className="bg-[var(--color-card)] p-4">
                      <div className="font-display text-sm font-medium text-ink">{c.name}</div>
                      <div className="mt-1 font-mono text-[11px] text-[var(--color-ink-muted)]">
                        {c.varName}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mt-28">
            <FadeIn>
              <h2 className="font-display text-2xl font-semibold text-ink">{tr.ds.typeTitle}</h2>
              <p className="mt-2 text-[var(--color-ink-secondary)]">
                {tr.ds.typeDesc}
              </p>
            </FadeIn>
            <div className="mt-10 divide-y divide-white/[0.08] border-t border-ink/[0.08]">
              {TYPE_SCALE.map((t, i) => (
                <FadeIn key={t.label} delay={i * 0.05}>
                  <div className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="w-24 shrink-0 font-display text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                      {t.label}
                    </span>
                    <span className={`font-display text-ink ${t.className}`}>{t.sample}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* Spacing */}
          <section className="mt-28">
            <FadeIn>
              <h2 className="font-display text-2xl font-semibold text-ink">{tr.ds.spacingTitle}</h2>
              <p className="mt-2 text-[var(--color-ink-secondary)]">
                {tr.ds.spacingDesc}
              </p>
            </FadeIn>
            <div className="mt-10 flex flex-col gap-3">
              {SPACING.map((s, i) => (
                <FadeIn key={s} delay={i * 0.03}>
                  <div className="flex items-center gap-4">
                    <span className="w-12 shrink-0 font-mono text-xs text-[var(--color-ink-muted)]">
                      {s}px
                    </span>
                    <div
                      className="h-3 rounded-full bg-[var(--color-primary-soft)]"
                      style={{ width: `${s * 2}px` }}
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* Components */}
          <section className="mt-28">
            <FadeIn>
              <h2 className="font-display text-2xl font-semibold text-ink">{tr.ds.compTitle}</h2>
              <p className="mt-2 text-[var(--color-ink-secondary)]">
                {tr.ds.compDesc}
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="mt-10 flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-ink px-6 py-3 font-display text-sm font-semibold text-bg">
                Primary
              </button>
              <button className="rounded-full border border-ink/15 px-6 py-3 font-display text-sm font-semibold text-ink transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                Secondary
              </button>
              <button className="rounded-full bg-[var(--color-accent)] px-6 py-3 font-display text-sm font-semibold text-[#1a0f10]">
                Accent
              </button>
              <button
                disabled
                className="cursor-not-allowed rounded-full border border-ink/10 px-6 py-3 font-display text-sm font-semibold text-ink/30"
              >
                Disabled
              </button>
              <button
                onClick={() => setLoading((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 font-display text-sm font-semibold text-ink"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Toggle loading
              </button>
            </FadeIn>

            <FadeIn delay={0.15} className="mt-8 flex flex-wrap items-center gap-4">
              <input
                placeholder="Input field"
                className="rounded-xl border border-ink/10 bg-ink/[0.02] px-4 py-3 text-sm text-ink placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <button
                onClick={() => setChecked((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-ink/10 bg-ink/[0.02] px-4 py-3 text-sm text-ink"
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded border transition-colors"
                  style={{
                    borderColor: checked ? "var(--color-accent)" : "rgba(255,255,255,0.3)",
                    backgroundColor: checked ? "var(--color-accent)" : "transparent",
                  }}
                >
                  {checked && <Check size={12} className="text-[#1a0f10]" />}
                </span>
                Checkbox
              </button>
              <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.02] px-4 py-2 text-sm text-ink">
                Select <ChevronDown size={14} className="text-ink/50" />
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/[0.02] px-3 py-1 text-xs font-medium text-ink/80">
                Default badge
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                <Sparkles size={12} /> AI-assisted
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Available
              </span>
            </FadeIn>
          </section>

          {/* Interaction states & motion */}
          <section className="mt-28">
            <FadeIn>
              <h2 className="font-display text-2xl font-semibold text-ink">{tr.ds.motionTitle}</h2>
              <p className="mt-2 text-[var(--color-ink-secondary)]">
                {tr.ds.motionDesc}
              </p>
            </FadeIn>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { label: "Hover lift", demo: "hover" },
                { label: "Spring press", demo: "press" },
                { label: "Continuous float", demo: "float" },
              ].map((d, i) => (
                <FadeIn key={d.label} delay={i * 0.06}>
                  <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-ink/[0.08] bg-[var(--color-card)]">
                    {d.demo === "hover" && (
                      <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="h-12 w-12 rounded-xl bg-[var(--color-primary-soft)]"
                      />
                    )}
                    {d.demo === "press" && (
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="h-12 w-12 cursor-pointer rounded-xl bg-[var(--color-accent)]"
                      />
                    )}
                    {d.demo === "float" && (
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="h-12 w-12 rounded-full bg-ink/80"
                      />
                    )}
                    <span className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                      {d.label}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* Accessibility */}
          <section className="mt-28">
            <FadeIn>
              <h2 className="font-display text-2xl font-semibold text-ink">{tr.ds.a11yTitle}</h2>
              <ul className="mt-6 flex max-w-2xl flex-col gap-3">
                {tr.ds.a11y.map((item) => (
                  <li key={item} className="flex gap-3 text-[var(--color-ink-secondary)]">
                    <Check size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </section>

          <FadeIn delay={0.1} className="mt-28">
            <a
              href="/"
              data-cursor="link"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold text-ink"
            >
              {tr.ds.back} <ArrowRight size={16} className="rtl:-scale-x-100" />
            </a>
          </FadeIn>
        </Container>
      </main>
      <Footer />
    </>
  );
}
