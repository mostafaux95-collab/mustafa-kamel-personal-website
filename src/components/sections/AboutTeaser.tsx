import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import PortraitCard from "@/components/about/PortraitCard";
import { useLang } from "@/lib/i18n";

export default function AboutTeaser() {
  const { t } = useLang();

  return (
    <section className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <FadeIn>
              <PortraitCard className="max-w-sm" />
            </FadeIn>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <FadeIn>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.aboutTeaser.eyebrow}
              </span>
            </FadeIn>
            <SplitReveal
              as="h2"
              type="lines"
              className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
            >
              {t.aboutTeaser.title}
            </SplitReveal>
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-lg text-lg text-[var(--color-ink-secondary)]">
                {t.aboutTeaser.para}
              </p>
              <Link
                to="/about"
                data-cursor="link"
                className="link-underline group mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold text-ink transition-colors hover:text-[var(--color-accent)]"
              >
                {t.aboutTeaser.link}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                />
              </Link>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
