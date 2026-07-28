import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import GradientMesh from "@/components/ui/GradientMesh";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";
import { useLang } from "@/lib/i18n";
import { postPublic } from "@/lib/api";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { SOCIALS } from "@/data/socials";

const RING_LENGTH = 2 * Math.PI * 34; // r=34 circle circumference
const PARTICLES = Array.from({ length: 12 }, (_, i) => i);

function SentSuccess({ title, body }: { title: string; body: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const checkLength = checkRef.current?.getTotalLength() ?? 40;
      gsap.set(ringRef.current, {
        strokeDasharray: RING_LENGTH,
        strokeDashoffset: RING_LENGTH,
      });
      gsap.set(checkRef.current, {
        strokeDasharray: checkLength,
        strokeDashoffset: checkLength,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(badgeRef.current, { scale: 0.4, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" })
        // ring draws itself closed
        .to(ringRef.current, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.1)
        // check strokes in
        .to(checkRef.current, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, 0.55)
        // celebratory pop + particle burst
        .to(badgeRef.current, { scale: 1.08, duration: 0.12, ease: "power2.in" }, 0.9)
        .to(badgeRef.current, { scale: 1, duration: 0.35, ease: "elastic.out(1.2, 0.5)" }, 1.02)
        .add(() => {
          const parts = rootRef.current?.querySelectorAll("[data-particle]");
          parts?.forEach((p) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 44 + Math.random() * 46;
            gsap.fromTo(
              p,
              { x: 0, y: 0, scale: 1, autoAlpha: 1 },
              {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                scale: 0,
                autoAlpha: 0,
                duration: 0.7 + Math.random() * 0.35,
                ease: "power2.out",
              },
            );
          });
        }, 0.92)
        // copy rises in
        .from(titleRef.current, { y: 18, autoAlpha: 0, duration: 0.6 }, 1.0)
        .from(bodyRef.current, { y: 14, autoAlpha: 0, duration: 0.6 }, 1.12);
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center justify-center gap-3 py-14 text-center"
      role="status"
    >
      <div ref={badgeRef} className="relative mb-3">
        <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
          <circle
            ref={ringRef}
            cx="42"
            cy="42"
            r="34"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform="rotate(-90 42 42)"
          />
          <path
            ref={checkRef}
            d="M28 43.5 L38.5 53.5 L57 32.5"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {PARTICLES.map((i) => (
          <span
            key={i}
            data-particle
            aria-hidden
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full opacity-0"
            style={{
              backgroundColor: i % 3 === 0 ? "var(--color-primary-soft)" : "var(--color-accent)",
            }}
          />
        ))}
      </div>
      <span ref={titleRef} className="font-display text-2xl font-semibold text-ink">
        {title}
      </span>
      <p ref={bodyRef} className="text-sm text-[var(--color-ink-secondary)]">
        {body}
      </p>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", whatsapp: "", message: "" });
  const { t } = useLang();

  const submitMutation = useMutation({
    mutationFn: () =>
      postPublic("/contact", {
        name: values.name,
        email: values.email,
        whatsapp: values.whatsapp || undefined,
        message: values.message,
      }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitMutation.mutate();
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-ink/[0.06] py-32 sm:py-40"
    >
      <GradientMesh className="opacity-70" />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <FadeIn>
              <span className="inline-flex items-center gap-3 rounded-full border border-ink/10 py-1.5 ps-1.5 pe-4 font-display text-xs font-medium uppercase tracking-widest text-[var(--color-ink-secondary)]">
                <span className="relative shrink-0">
                  <img
                    src="/portrait.jpg"
                    alt=""
                    className="h-8 w-8 rounded-full border border-ink/15 object-cover object-top"
                  />
                  <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-bg" />
                </span>
                {t.contact.badge}
              </span>
              <h2 className="mt-8 font-display text-5xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                <SplitReveal as="span" type="chars" className="block">
                  {t.contact.line1}
                </SplitReveal>
                <SplitReveal
                  as="span"
                  type="chars"
                  delay={0.2}
                  className="block text-[var(--color-accent)]"
                >
                  {t.contact.line2}
                </SplitReveal>
              </h2>
              <p className="mt-8 max-w-md text-lg text-[var(--color-ink-secondary)]">
                {t.contact.para}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Magnetic cursor="link">
                  <a
                    href="mailto:hi@mustafakamel.com"
                    className="group flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-display text-sm font-semibold text-bg"
                  >
                    <Mail size={16} />
                    hi@mustafakamel.com
                  </a>
                </Magnetic>
              </div>

              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="group flex items-center gap-1 font-display text-sm font-medium text-ink/60 transition-colors hover:text-ink"
                  >
                    {s.label}
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                    />
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <FadeIn delay={0.1}>
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-8"
              >
                {submitMutation.isSuccess ? (
                  <SentSuccess title={t.contact.sentTitle} body={t.contact.sentBody} />
                ) : (
                  <div className="flex flex-col gap-5">
                    {submitMutation.isError && (
                      <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {t.contact.error}
                      </p>
                    )}
                    <Field
                      id="name"
                      label={t.contact.name}
                      placeholder={t.contact.namePh}
                      value={values.name}
                      onChange={(v) => setValues((s) => ({ ...s, name: v }))}
                    />
                    <Field
                      id="email"
                      label={t.contact.email}
                      placeholder={t.contact.emailPh}
                      type="email"
                      value={values.email}
                      onChange={(v) => setValues((s) => ({ ...s, email: v }))}
                    />
                    <Field
                      id="whatsapp"
                      label={t.contact.whatsapp}
                      placeholder={t.contact.whatsappPh}
                      type="tel"
                      required={false}
                      value={values.whatsapp}
                      onChange={(v) => setValues((s) => ({ ...s, whatsapp: v }))}
                    />
                    <Field
                      id="message"
                      label={t.contact.message}
                      placeholder={t.contact.messagePh}
                      textarea
                      value={values.message}
                      onChange={(v) => setValues((s) => ({ ...s, message: v }))}
                    />
                    <Magnetic cursor="view" className="mt-2 w-full">
                      <button
                        type="submit"
                        disabled={submitMutation.isPending}
                        className="btn-shine w-full rounded-full bg-[var(--color-accent)] px-6 py-4 font-display text-sm font-semibold text-[#1a0f10] transition-transform disabled:opacity-60"
                      >
                        {submitMutation.isPending ? t.contact.sending : t.contact.send}
                      </button>
                    </Magnetic>
                  </div>
                )}
              </form>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  textarea = false,
  required = true,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const fieldId = `field-${id}`;
  const shared =
    "w-full border border-ink/10 bg-ink/[0.02] px-5 py-3 text-sm text-ink placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent)] focus:outline-none";
  return (
    <div className="relative">
      <label
        htmlFor={fieldId}
        className="mb-2 block text-xs font-medium uppercase tracking-widest text-[var(--color-ink-muted)]"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={fieldId}
          required
          placeholder={placeholder}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} rounded-3xl`}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} rounded-full`}
        />
      )}
    </div>
  );
}
