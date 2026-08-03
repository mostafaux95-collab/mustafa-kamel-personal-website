import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import ProjectGrid from "@/components/sections/ProjectGrid";
import { useLang } from "@/lib/i18n";

export default function Projects() {
  const { t } = useLang();

  return (
    <section id="work" className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 sm:mb-24 sm:flex-row sm:items-end">
          <div>
            <FadeIn>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.projectsSection.eyebrow}
              </span>
            </FadeIn>
            <SplitReveal
              as="h2"
              type="lines"
              className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
            >
              {t.projectsSection.title}
            </SplitReveal>
          </div>
          <FadeIn delay={0.15}>
            <p className="max-w-sm text-[var(--color-ink-secondary)]">
              {t.projectsSection.para}
            </p>
            <Link
              to="/work"
              data-cursor="link"
              className="link-underline group mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold text-ink transition-colors hover:text-[var(--color-accent)]"
            >
              {t.projectsSection.allWork}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
              />
            </Link>
          </FadeIn>
        </div>

        <ProjectGrid limit={4} />
      </Container>
    </section>
  );
}
