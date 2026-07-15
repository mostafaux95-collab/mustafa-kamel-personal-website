import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { useStaggerReveal } from "@/lib/useStaggerReveal";

export default function Industries() {
  const { t } = useLang();
  const listRef = useStaggerReveal<HTMLDivElement>({
    y: 36,
    duration: 0.9,
    stagger: 0.09,
    ease: "power3.out",
  });

  return (
    <section className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.industries.eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
        >
          {t.industries.title}
        </SplitReveal>

        <div ref={listRef} className="mt-16 divide-y divide-ink/[0.08] border-t border-ink/[0.08]">
          {t.industries.items.map((item, i) => (
            <div key={item.name} data-reveal>
              <div className="group grid grid-cols-1 items-baseline gap-2 py-7 sm:grid-cols-12 sm:gap-8">
                <span className="font-display text-sm text-[var(--color-ink-muted)] sm:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl font-semibold text-ink transition-colors duration-300 group-hover:text-[var(--color-accent)] sm:col-span-4 sm:text-3xl">
                  {item.name}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-ink-secondary)] sm:col-span-7">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
