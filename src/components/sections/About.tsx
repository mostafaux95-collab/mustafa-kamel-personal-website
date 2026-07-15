import FadeIn from "@/components/ui/FadeIn";
import Container from "@/components/ui/Container";
import SplitReveal from "@/components/ui/SplitReveal";
import PortraitCard from "@/components/about/PortraitCard";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import { useLang } from "@/lib/i18n";

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <FadeIn>
                <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                  {t.aboutSection.eyebrow}
                </span>
              </FadeIn>
              <SplitReveal
                as="h2"
                type="lines"
                className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
              >
                {t.aboutSection.title}
              </SplitReveal>
              <FadeIn delay={0.15}>
                <p className="mt-8 max-w-md text-[var(--color-ink-secondary)]">
                  {t.aboutSection.p1}
                </p>
                <p className="mt-4 max-w-md text-[var(--color-ink-secondary)]">
                  {t.aboutSection.p2}
                </p>
              </FadeIn>
              <FadeIn delay={0.25}>
                <PortraitCard className="mt-14 max-w-sm" />
              </FadeIn>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ExperienceTimeline roles={t.cv.roles} />
          </div>
        </div>
      </Container>
    </section>
  );
}
