import { useRef } from "react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { useLang } from "@/lib/i18n";

export default function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const { t } = useLang();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
    },
    { scope: listRef },
  );

  return (
    <section className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.process.eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
        >
          {t.process.title}
        </SplitReveal>

        <ol
          ref={listRef}
          className="relative mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          <span
            aria-hidden
            className="absolute -top-6 start-0 hidden h-px w-full bg-ink/[0.08] lg:block"
          />
          <span
            ref={lineRef}
            aria-hidden
            className="absolute -top-6 start-0 hidden h-px w-full origin-left bg-[var(--color-accent)] rtl:origin-right lg:block"
          />
          {t.process.steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.08}>
              <li className="group">
                <span className="font-display text-sm text-[var(--color-ink-muted)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-secondary)]">
                  {step.body}
                </p>
              </li>
            </FadeIn>
          ))}
        </ol>
      </Container>
    </section>
  );
}
