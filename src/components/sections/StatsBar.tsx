import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import CountUp from "@/components/ui/CountUp";
import { useLang } from "@/lib/i18n";

export default function StatsBar() {
  const { t } = useLang();

  return (
    <section className="border-t border-ink/[0.06] py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {t.stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.06}>
              <CountUp
                value={stat.value}
                className="font-display text-5xl font-semibold text-ink sm:text-6xl"
              />
              <div className="mt-2 max-w-[200px] text-sm text-[var(--color-ink-muted)]">
                {stat.label}
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
