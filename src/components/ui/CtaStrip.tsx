import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";
import { useLang } from "@/lib/i18n";

export default function CtaStrip({
  headline,
  label,
}: {
  headline?: string;
  label?: string;
}) {
  const { t } = useLang();

  return (
    <section className="border-t border-ink/[0.06] py-24 sm:py-32">
      <Container className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
        <SplitReveal
          as="h2"
          type="lines"
          className="max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl"
        >
          {headline ?? t.cta.home}
        </SplitReveal>
        <FadeIn delay={0.15}>
          <Magnetic cursor="view">
            <Link
              to="/contact"
              className="btn-shine group flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-4 font-display text-sm font-semibold text-[#1a0f10]"
            >
              {label ?? t.cta.label}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
              />
            </Link>
          </Magnetic>
        </FadeIn>
      </Container>
    </section>
  );
}
