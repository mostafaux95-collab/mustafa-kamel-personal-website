import { ArrowDown, MessageCircle, PenLine, Rocket } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { useStaggerReveal } from "@/lib/useStaggerReveal";

const ICONS = [PenLine, MessageCircle, Rocket];

export default function NextSteps() {
  const { t } = useLang();
  const stepsRef = useStaggerReveal<HTMLDivElement>({
    y: 52,
    scale: 0.97,
    duration: 1,
    stagger: 0.18,
    ease: "power4.out",
  });

  return (
    <section className="relative border-t border-ink/[0.06] py-24 sm:py-32">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.nextSteps.eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="mt-6 max-w-xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl"
        >
          {t.nextSteps.title}
        </SplitReveal>

        <div ref={stepsRef} className="mt-14 flex flex-col gap-4 lg:flex-row lg:gap-6">
          {t.nextSteps.steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isLast = i === t.nextSteps.steps.length - 1;
            return (
              <div key={step.title} data-reveal className="flex-1">
                <div className="flex h-full items-stretch gap-4">
                  <div className="group relative flex-1 rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-7 transition-colors duration-500 hover:border-[var(--color-accent)]/40">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-ink/[0.03]">
                        <Icon size={19} className="text-[var(--color-accent)]" />
                      </div>
                      <span className="font-display text-sm text-[var(--color-ink-muted)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-secondary)]">
                      {step.body}
                    </p>
                  </div>
                  {!isLast && (
                    <ArrowDown
                      size={18}
                      aria-hidden
                      className="mt-10 hidden shrink-0 -rotate-90 text-ink/25 lg:block rtl:rotate-90"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
