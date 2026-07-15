import { Code2, Target, TrendingUp } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { useStaggerReveal } from "@/lib/useStaggerReveal";

const ICONS = [Target, Code2, TrendingUp];

export default function Collaboration() {
  const { t } = useLang();
  const isRtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";
  const listRef = useStaggerReveal<HTMLDivElement>({
    x: isRtl ? 60 : -60,
    y: 0,
    duration: 1,
    stagger: 0.16,
    ease: "power3.out",
  });

  return (
    <section className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <FadeIn>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.collab.eyebrow}
              </span>
            </FadeIn>
            <SplitReveal
              as="h2"
              type="lines"
              className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
            >
              {t.collab.title}
            </SplitReveal>
          </div>
          <div ref={listRef} className="flex flex-col divide-y divide-ink/[0.08] lg:col-span-8">
            {t.collab.items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={item.title} data-reveal>
                  <div className="group flex gap-6 py-10">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-ink/[0.03] transition-colors duration-500 group-hover:border-[var(--color-accent)]/40">
                      <Icon size={20} className="text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-ink-secondary)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
