import { Briefcase, MessageSquare, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { useStaggerReveal } from "@/lib/useStaggerReveal";

const ICONS = [Briefcase, Zap, MessageSquare];

export default function EngagementModels() {
  const { t } = useLang();
  const gridRef = useStaggerReveal<HTMLDivElement>({
    y: 64,
    scale: 0.96,
    duration: 1.05,
    stagger: 0.14,
    ease: "power4.out",
  });

  return (
    <section className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.engagement.eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
        >
          {t.engagement.title}
        </SplitReveal>

        <div ref={gridRef} className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {t.engagement.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={item.title} data-reveal className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--color-accent)]/40">
                  <span className="absolute end-6 top-6 font-display text-5xl font-semibold text-ink/[0.06] transition-colors duration-500 group-hover:text-[var(--color-accent)]/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-ink/[0.03] transition-colors duration-500 group-hover:border-[var(--color-accent)]/40">
                    <Icon size={22} className="text-[var(--color-accent)]" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-secondary)]">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
